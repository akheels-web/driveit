import { sanitizeText } from '@/lib/html'

/**
 * Meta WhatsApp Cloud API — booking confirmations.
 *
 * `WHATSAPP_API_VERSION` defaults to a currently supported Graph version
 * (the previous hardcoded v17.0 was long past its sunset date).
 */
const GRAPH_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0'
const TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || 'booking_confirmation_luxury'

type BookingLike = {
  whatsappNumber?: string | null
  customerPhone?: string | null
  customerName?: string | null
  carName?: string | null
  startDate?: string | null
  pickupLocation?: string | null
}

function normalisePhone(raw?: string | null): string | null {
  if (!raw) return null
  let phone = raw.replace(/\D/g, '')
  if (phone.length === 10) phone = `91${phone}` // default to India
  if (phone.length < 10) return null
  return phone
}

export async function sendWhatsAppConfirmation(booking: BookingLike): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    console.warn('[whatsapp] credentials missing — skipping confirmation message.')
    return false
  }

  const to = normalisePhone(booking.whatsappNumber || booking.customerPhone)
  if (!to) {
    console.warn('[whatsapp] no usable phone number on the booking — skipping.')
    return false
  }

  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: TEMPLATE_NAME,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: sanitizeText(booking.customerName, 80) || 'Guest' },
            { type: 'text', text: sanitizeText(booking.carName, 80) || 'your vehicle' },
            {
              type: 'text',
              text: booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—',
            },
            { type: 'text', text: sanitizeText(booking.pickupLocation, 160) || '—' },
          ],
        },
      ],
    },
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    const result = (await response.json().catch(() => ({}))) as { error?: { message?: string } }

    if (!response.ok || result.error) {
      console.error('[whatsapp] API error:', result.error?.message || response.status)
      return false
    }

    return true
  } catch (error) {
    console.error('[whatsapp] send failed:', error instanceof Error ? error.message : error)
    return false
  }
}
