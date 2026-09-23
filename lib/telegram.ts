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
  ]
    .filter(Boolean)
    .join('\n')
}
