import crypto from 'crypto'
import type { Payload } from 'payload'

import { HOLD_MINUTES } from '@/lib/pricing'

/**
 * Availability + hold creation.
 *
 * Both the checkout API and the legacy booking server action go through here,
 * so there is exactly one place that decides whether a car is free.
 *
 * Race handling on SQLite:
 *  1. The check + insert run inside a database transaction.
 *  2. After the transaction commits we "settle": if another overlapping hold
 *     already exists with a lower id (i.e. it arrived first), our hold is
 *     deleted and the caller gets a 409.
 *
 * Step 2 is what makes the flow safe on SQLite, which has no partial unique
 * indexes via Payload and where two deferred transactions can both read before
 * either writes. Once the fleet moves to Postgres, replace step 2 with a real
 * exclusion constraint so the database enforces it.
 */

export class BookingConflictError extends Error {
  status = 409
}

export class BookingInputError extends Error {
  status = 400
}

export type HoldInput = {
  carSlug: string
  carName: string
  startDate: string
  endDate: string
  days: number
  totalPrice: number
  serviceType: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupLocation?: string | null
  dropoffLocation?: string | null
  addons?: string | null
  couponCode?: string | null
  discountApplied?: number
  whatsappNumber?: string | null
}

export type HoldResult = {
  bookingId: number | string
  holdToken: string
  holdExpiresAt: string
}

const ACTIVE_BOOKING_MATCH = (carSlug: string) => ({
  carSlug: { equals: carSlug },
  or: [
    { status: { equals: 'confirmed' } },
    {
      status: { equals: 'pending' },
      holdExpiresAt: { greater_than: new Date().toISOString() },
    },
  ],
})

function overlaps(
  candidate: { startDate?: string | null; endDate?: string | null },
  requestedStart: number,
  requestedEnd: number,
): boolean {
  if (!candidate.startDate || !candidate.endDate) return false
  const start = new Date(candidate.startDate).getTime()
  const end = new Date(candidate.endDate).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return false
  return requestedStart <= end && requestedEnd >= start
}

export async function assertCarIsAvailable(
  payload: Payload,
  args: { carSlug: string; startDate: string; endDate: string; ignoreBookingId?: number | string },
) {
  const requestedStart = new Date(args.startDate).getTime()
  const requestedEnd = new Date(args.endDate).getTime()

  if (Number.isNaN(requestedStart) || Number.isNaN(requestedEnd)) {
    throw new BookingInputError('Invalid booking dates.')
  }

  const { docs } = await payload.find({
    collection: 'bookings',
    where: ACTIVE_BOOKING_MATCH(args.carSlug) as any,
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const conflict = docs.find(
    (booking: any) =>
      String(booking.id) !== String(args.ignoreBookingId ?? '') &&
      overlaps(booking, requestedStart, requestedEnd),
  )

  if (conflict) throw new BookingConflictError('This car is already reserved for the selected dates.')
}

export async function createBookingHold(payload: Payload, input: HoldInput): Promise<HoldResult> {
  const holdToken = crypto.randomBytes(32).toString('base64url')
  const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000).toISOString()

  const transactionID = await payload.db.beginTransaction()
  const req = transactionID ? { transactionID } : undefined

  let bookingId: number | string

  try {
    await assertCarIsAvailable(payload, input)

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        ...input,
        status: 'pending',
        holdToken,
        holdExpiresAt,
        days: input.days,
      },
      overrideAccess: true,
      depth: 0,
      ...(req ? { req } : {}),
    })

    bookingId = booking.id

    if (transactionID) await payload.db.commitTransaction(transactionID)
  } catch (error) {
    if (transactionID) {
      try {
        await payload.db.rollbackTransaction(transactionID)
      } catch {
        // transaction already finished
      }
    }
    throw error
  }

  // Settle: whoever created an overlapping hold first keeps the car.
  try {
    const requestedStart = new Date(input.startDate).getTime()
    const requestedEnd = new Date(input.endDate).getTime()

    const { docs } = await payload.find({
      collection: 'bookings',
      where: ACTIVE_BOOKING_MATCH(input.carSlug) as any,
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    const earlierRival = docs.find(
      (booking: any) =>
        String(booking.id) !== String(bookingId) &&
        overlaps(booking, requestedStart, requestedEnd) &&
        Number(booking.id) < Number(bookingId),
    )

    if (earlierRival) {
      await payload.delete({ collection: 'bookings', id: bookingId, overrideAccess: true })
      throw new BookingConflictError('This car was just booked by someone else. Please pick another vehicle or time.')
    }
  } catch (error) {
    if (error instanceof BookingConflictError) throw error
    // A failure while settling must not silently keep a duplicate hold.
    await payload
      .delete({ collection: 'bookings', id: bookingId, overrideAccess: true })
      .catch(() => undefined)
    throw error
  }

  return { bookingId, holdToken, holdExpiresAt }
}

/** Constant-time comparison so a hold token cannot be brute-forced byte by byte. */
export function holdTokenMatches(expected?: string | null, provided?: string | null): boolean {
  if (!expected || !provided) return false
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)
  if (expectedBuffer.length !== providedBuffer.length) return false
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

export function isHoldExpired(holdExpiresAt?: string | null, status?: string | null): boolean {
  if (status !== 'pending') return false
  if (!holdExpiresAt) return true
  return new Date(holdExpiresAt).getTime() < Date.now()
}
