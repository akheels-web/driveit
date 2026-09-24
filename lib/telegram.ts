import { escapeHtml } from '@/lib/html'

/**
 * Server-only Telegram alerts.
 *
 * The bot token must never be exposed to the browser (it used to be shipped in
 * the client bundle via NEXT_PUBLIC_ variables). Only call this from route
 * handlers / server code.
 */
export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
}

export async function sendTelegramAlert(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) return false

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    })

    if (!response.ok) {
      console.error('[telegram] alert failed with status', response.status)
      return false
    }
    return true
  } catch (error) {
    console.error('[telegram] alert failed:', error instanceof Error ? error.message : error)
    return false
  }
}

/**
 * Alert sent when a coupon could not be counted at confirmation time.
 *
 * This is a money problem, not a logging problem: the customer kept a discount
 * that the coupon's own limit says they should not have. Staff need to decide
 * whether to collect the difference or adjust the booking.
 */
export function couponAlertText(input: {
  reference: string
  couponCode: string
  discount: number
  reason: string
}): string {
  return [
    '⚠️ <b>Coupon not counted</b>',
    '',
    `Booking: ${escapeHtml(input.reference)}`,
    `Coupon: ${escapeHtml(input.couponCode)}`,
    `Discount applied: ₹${Number(input.discount || 0).toLocaleString('en-IN')}`,
    `Reason: ${escapeHtml(input.reason)}`,
    '',
    'The booking stands with its discount. Please collect the difference or adjust it in the admin.',
  ].join('\n')
}

/**
 * The booking alert, with the payment-verification prompt appended.
 *
 * Confirmation in this system means "the customer says they paid" — the UPI
 * reference is typed by hand and nothing verifies it, so every new booking is a
 * request for staff to check the account.
 */
export function bookingAlertText(input: {
  reference: string
  carName: string
  serviceType?: string | null
  pickupLocation?: string | null
  startDate?: string | null
  endDate?: string | null
  totalPrice?: number | null
  customerName?: string | null
  customerPhone?: string | null
  customerEmail?: string | null
  notes?: string | null
  paymentReference?: string | null
}): string {
  return [
    '🚗 <b>New DRIVEIT booking</b>',
    '',
    `Ref: ${escapeHtml(input.reference)}`,
    `Car: ${escapeHtml(input.carName)}`,
    `Service: ${escapeHtml(input.serviceType || 'chauffeur')}`,
    `Pickup: ${escapeHtml(input.pickupLocation || '—')}`,
    `Dates: ${escapeHtml(input.startDate || '—')} → ${escapeHtml(input.endDate || '—')}`,
    `Amount: ₹${Number(input.totalPrice || 0).toLocaleString('en-IN')}`,
    '',
    `Customer: ${escapeHtml(input.customerName || '—')}`,
    `Phone: ${escapeHtml(input.customerPhone || '—')}`,
    input.customerEmail ? `Email: ${escapeHtml(input.customerEmail)}` : '',
    input.notes ? `Notes: ${escapeHtml(input.notes)}` : '',
    input.paymentReference ? `UPI ref: ${escapeHtml(input.paymentReference)}` : '',
    '',
    '💳 <b>Payment not verified</b> — check this UPI reference against the account, then set',
    '“Payment Verification: ✅ Verified” on the booking.',
  ]
    .filter(Boolean)
    .join('\n')
}
