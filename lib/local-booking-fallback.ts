import crypto from 'crypto'
import { holdTokenMatches, isHoldExpired } from './booking-holds'

const HOLD_DURATION_MS = 10 * 60 * 1000

export interface LocalBookingRecord {
  id: string
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
  pickupLocation: string | null
  dropoffLocation: string | null
  addons: string | null
  couponCode: string | null
  discountApplied: number
  whatsappNumber: string | null
  securityDepositAmount: number
  securityDepositStatus: string
  flightNumber: string | null
  airportTerminal: string | null
  gstin: string | null
  companyName: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: string
  holdToken: string
  holdExpiresAt: string
  upiTransactionId?: string | null
  createdAt: string
}

const globalForBookings = globalThis as unknown as {
  __driveitLocalBookings?: Map<string, LocalBookingRecord>
  __driveitLocalSeq?: number
}

function getStore(): Map<string, LocalBookingRecord> {
  if (!globalForBookings.__driveitLocalBookings) {
    globalForBookings.__driveitLocalBookings = new Map()
  }
  return globalForBookings.__driveitLocalBookings
}

function nextId(): string {
  globalForBookings.__driveitLocalSeq = (globalForBookings.__driveitLocalSeq ?? 1000) + 1
  return String(globalForBookings.__driveitLocalSeq)
}

export function createLocalBookingHold(
  input: Omit<
    LocalBookingRecord,
    'id' | 'status' | 'paymentStatus' | 'holdToken' | 'holdExpiresAt' | 'createdAt'
  >,
) {
  const store = getStore()
  const id = nextId()
  const holdToken = crypto.randomBytes(24).toString('hex')
  const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS).toISOString()

  const record: LocalBookingRecord = {
    ...input,
    id,
    status: 'pending',
    paymentStatus: 'awaiting_verification',
    holdToken,
    holdExpiresAt,
    createdAt: new Date().toISOString(),
  }

  store.set(id, record)

  return {
    bookingId: id,
    holdToken,
    holdExpiresAt,
  }
}

export function getLocalBooking(id: string | number): LocalBookingRecord | null {
  return getStore().get(String(id)) ?? null
}

export function listLocalBookingsByEmail(email: string): LocalBookingRecord[] {
  const store = getStore()
  const lower = email.trim().toLowerCase()
  const out: LocalBookingRecord[] = []
  for (const b of store.values()) {
    if (b.customerEmail.toLowerCase() === lower) {
      out.push(b)
    }
  }
  return out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function confirmLocalBooking(
  id: string | number,
  holdToken: string,
  upiTransactionId?: string | null,
):
  | { ok: true; record: LocalBookingRecord; alreadyConfirmed?: boolean }
  | { ok: false; status: number; error: string } {
  const store = getStore()
  const record = store.get(String(id))
  if (!record) {
    return { ok: false, status: 404, error: 'That booking could not be found.' }
  }

  if (!holdTokenMatches(record.holdToken, holdToken)) {
    return { ok: false, status: 403, error: 'This booking session is no longer valid.' }
  }

  if (record.status === 'confirmed') {
    return { ok: true, record, alreadyConfirmed: true }
  }

  if (isHoldExpired(record.holdExpiresAt, record.status)) {
    return {
      ok: false,
      status: 410,
      error: 'Your 10 minute reservation expired. Please start the checkout again.',
    }
  }

  record.status = 'confirmed'
  if (upiTransactionId) {
    record.upiTransactionId = upiTransactionId
  }
  store.set(record.id, record)
  return { ok: true, record }
}

export function validateLocalCoupon(code: string, subtotal: number) {
  const normalized = code.trim().toUpperCase()
  if (normalized === 'WELCOME10') {
    return {
      valid: true as const,
      code: 'WELCOME10',
      discount: Math.round(subtotal * 0.1),
      couponId: 'local-welcome10',
    }
  }
  if (normalized === 'PRIVE15' || normalized === 'DRIVEIT15') {
    return {
      valid: true as const,
      code: normalized,
      discount: Math.round(subtotal * 0.15),
      couponId: 'local-prive15',
    }
  }
  return {
    valid: false as const,
    message: 'Invalid or expired promo code.',
  }
}
