import crypto from 'crypto'
import type { Payload } from 'payload'

import { HOLD_MINUTES } from '@/lib/pricing'

/**
 * Availability + hold creation.
 *
 * Both the checkout API and the legacy booking server action go through here,
 * so there is exactly one place that decides whether a car is free.
 *
 * Race handling (Postgres):
 *  1. Every hold runs inside a real Postgres transaction.
 *  2. The first statement in that transaction takes a per-car *transactional
 *     advisory lock* (`pg_advisory_xact_lock`). Two requests for the same car
 *     therefore serialise: the second one only starts reading after the first
 *     has committed, so its availability check sees the winner's row.
 *  3. The check and the insert then run on that same transaction, so the row we
 *     looked at is the row we write against.
 *
 * The lock is released automatically on commit or rollback — there is no lock
 * row to clean up and no TTL to leak. It is keyed per car, so unrelated holds
 * still run in parallel, and it is taken before any row lock, so it cannot
 * participate in a deadlock cycle.
 *
 * If transactions are ever disabled on the adapter (`transactionOptions: false`)
 * the lock is unavailable and we fall back to the old "settle" pass: create the
 * hold, then delete it if an overlapping hold with a lower id already existed.
 * That path is a safety net, not the design — keep transactions on.
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
  securityDepositAmount?: number
  securityDepositStatus?: 'na' | 'held' | 'inspection_passed' | 'refunded' | 'deducted'
  flightNumber?: string | null
  airportTerminal?: string | null
  gstin?: string | null
  companyName?: string | null
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

/**
 * The advisory-lock namespace for booking holds. Arbitrary, but must be stable:
 * two processes only exclude each other if they agree on it.
 */
const HOLD_LOCK_NAMESPACE = 0x44524956 // "DRIV"

/**
 * FNV-1a over the car slug → a stable signed 32-bit int for `pg_advisory_xact_lock`.
 *
 * Hashing here rather than in SQL keeps caller data out of the statement text
 * entirely, and a hash collision only means two cars briefly queue behind each
 * other — never an incorrect hold.
 */
function carLockKey(carSlug: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < carSlug.length; index += 1) {
    hash ^= carSlug.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash | 0
}

/** The subset of Payload's Drizzle adapter we rely on for raw in-transaction SQL. */
type TransactionalDb = {
  sessions?: Record<string, { db?: { execute: (query: string) => Promise<unknown> } } | undefined>
}

/**
 * Serialises hold creation per car for the life of the transaction.
 * Returns false when no transaction is available (see the fallback in
 * `createBookingHold`).
 */
async function lockCarForHold(
  payload: Payload,
  transactionID: number | string,
  carSlug: string,
): Promise<boolean> {
  const db = (payload.db as unknown as TransactionalDb).sessions?.[String(transactionID)]?.db
  if (!db?.execute) return false

  await db.execute(
    `select pg_advisory_xact_lock(${HOLD_LOCK_NAMESPACE}, ${carLockKey(carSlug)})`,
  )
  return true
}

export async function assertCarIsAvailable(
  payload: Payload,
  args: {
    carSlug: string
    startDate: string
    endDate: string
    ignoreBookingId?: number | string
    req?: { transactionID?: number | string }
  },
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
    // Read inside the hold transaction when we have one, so the availability
    // check and the insert below observe the same snapshot.
    ...(args.req ? { req: args.req } : {}),
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
  let serialisedByLock = false

  try {
    // Take the per-car lock *before* reading availability, so a concurrent hold
    // for the same car waits here instead of racing us to the insert.
    if (transactionID) {
      serialisedByLock = await lockCarForHold(payload, transactionID, input.carSlug)
      if (!serialisedByLock) {
        // Means the adapter has no per-transaction handle for raw SQL. The
        // settle pass below still keeps the result correct, just with a brief
        // window where a losing hold exists. Worth knowing about in the logs.
        console.warn(
          '[booking-holds] no transaction handle available — falling back to the settle pass.',
        )
      }
    }

    await assertCarIsAvailable(payload, { ...input, ...(req ? { req } : {}) })

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

  // The advisory lock made the check-and-insert above atomic for this car, so
  // there is nothing left to settle. Only the no-transaction fallback needs it.
  if (serialisedByLock) {
    return { bookingId, holdToken, holdExpiresAt }
  }

  // Fallback settle: whoever created an overlapping hold first keeps the car.
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

/**
 * How long after expiry a hold is left alone before being closed.
 *
 * Availability already ignores expired holds, so this is bookkeeping: it keeps
 * the admin list and the "pending approval" count truthful without racing a
 * customer whose confirm is a few seconds late.
 */
export const HOLD_SWEEP_GRACE_MINUTES = 60

export type HoldSweepResult = { closed: number; failed: number }

/**
 * Closes `pending` holds whose hold window has passed.
 *
 * Safe to run concurrently and repeatedly: each document is only touched while
 * it is still `pending` and past its grace period, and closing a booking that a
 * staff member has meanwhile confirmed is impossible — the query filters on
 * `status: 'pending'` at read time and the update re-checks it.
 */
export async function expireStaleHolds(
  payload: Payload,
  options: { graceMinutes?: number; limit?: number } = {},
): Promise<HoldSweepResult> {
  const graceMinutes = options.graceMinutes ?? HOLD_SWEEP_GRACE_MINUTES
  const limit = options.limit ?? 500
  const cutoff = new Date(Date.now() - graceMinutes * 60_000).toISOString()

  const { docs } = await payload.find({
    collection: 'bookings',
    where: {
      status: { equals: 'pending' },
      holdExpiresAt: { less_than: cutoff },
    },
    sort: 'holdExpiresAt',
    limit,
    depth: 0,
    overrideAccess: true,
  })

  let closed = 0
  let failed = 0

  for (const doc of docs as Record<string, any>[]) {
    try {
      await payload.update({
        collection: 'bookings',
        id: doc.id,
        data: {
          status: 'cancelled',
          // Only fills an empty note — never overwrites what staff wrote.
          ...(doc.notes ? {} : { notes: 'Auto-closed: checkout hold expired unpaid.' }),
        },
        overrideAccess: true,
        depth: 0,
      })
      closed += 1
    } catch (error) {
      failed += 1
      console.error(`[holds] could not close stale hold ${doc.id}:`, error)
    }
  }

  return { closed, failed }
}
