import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Payment state for a booking.
 *
 * There is no payment gateway in this project: the customer pays to a UPI id and
 * types the reference back into checkout. That reference is *unverified input*,
 * so a confirmed booking does not mean a paid booking. Modelling that explicitly
 * is what stops the business from treating every confirmation as settled:
 *
 *   awaiting_verification → the customer says they paid; staff must check the
 *                           UPI reference against the account
 *   verified              → somebody with an admin account confirmed the money
 *   rejected              → the reference did not match; chase the customer
 *
 * `paid` deliberately does not exist — it would be an assumption, not a fact.
 */
export const PAYMENT_STATUS_OPTIONS = [
  { label: '💳 Awaiting verification', value: 'awaiting_verification' },
  { label: '✅ Verified', value: 'verified' },
  { label: '⛔ Rejected', value: 'rejected' },
] as const

export type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number]['value']

export const AWAITING_VERIFICATION: PaymentStatus = 'awaiting_verification'

export function paymentStatusLabel(value?: string | null): string {
  return (
    PAYMENT_STATUS_OPTIONS.find((option) => option.value === value)?.label ??
    '💳 Awaiting verification'
  )
}

/** True while the money is unconfirmed — what the customer-facing copy keys off. */
export function paymentNeedsReview(booking: Record<string, any> | null | undefined): boolean {
  return (booking?.paymentStatus ?? AWAITING_VERIFICATION) === AWAITING_VERIFICATION
}

/**
 * Stamps *who* verified a payment and *when*, in the same write as the change.
 *
 * Data-only, like the loyalty stamp: no database calls from a hook (a nested
 * write on the same row inside the request's transaction deadlocks Postgres).
 * The stamp is therefore impossible to lose: the audit trail commits with the
 * transition it describes, and un-verifying clears it.
 */
export const stampPaymentVerification: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  const doc = data as Record<string, any>
  const before = originalDoc as Record<string, any> | undefined

  const nextStatus = doc.paymentStatus
  const previousStatus = before?.paymentStatus

  if (nextStatus === 'verified' && previousStatus !== 'verified') {
    doc.paymentVerifiedAt = new Date().toISOString()

    // `req.user` is the staff account making the change; absent during seed or
    // scripted writes, in which case the timestamp still records the decision.
    const userId = (req?.user as { id?: number | string } | undefined)?.id
    if (userId !== undefined) doc.paymentVerifiedBy = userId
  }

  if (nextStatus !== undefined && nextStatus !== 'verified' && previousStatus === 'verified') {
    doc.paymentVerifiedAt = null
    doc.paymentVerifiedBy = null
  }

  return doc
}
