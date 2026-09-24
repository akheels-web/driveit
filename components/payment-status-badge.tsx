import { AlertTriangle, Clock, XCircle } from 'lucide-react'

import { paymentNeedsReview } from '@/lib/payments'

/**
 * "Is my money confirmed?" — answered honestly wherever a booking is shown.
 *
 * A booking is marked confirmed as soon as the customer submits a UPI reference,
 * because nothing in this system can verify that reference automatically. Until
 * staff check it against the account, the payment is *under review*, and the
 * customer deserves to see that rather than a reassuring word we cannot back up.
 *
 * Renders nothing once the payment is verified — a badge saying "paid" on every
 * row would just be noise.
 */
export function PaymentStatusBadge({
  booking,
  className = '',
}: {
  booking: Record<string, any> | null | undefined
  className?: string
}) {
  const status = booking?.paymentStatus

  if (!status || status === 'verified') return null

  if (status === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-red-400/10 text-red-400 border-red-400/20 ${className}`}
        title="We could not match this payment to our account. Please contact the concierge."
      >
        <XCircle className="w-3 h-3" />
        Payment not received
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-[var(--gold-400)]/10 text-[var(--gold-400)] border-[var(--gold-400)]/20 ${className}`}
      title="We are checking your UPI reference against our account. Your booking is held meanwhile."
    >
      {paymentNeedsReview(booking) ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      Payment under review
    </span>
  )
}
