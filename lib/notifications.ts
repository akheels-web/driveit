import crypto from 'crypto'

import { serverUrl } from '@/lib/env'

/**
 * Outbound WaCRM bridge.
 *
 * Replaces the old NotificationService, which contained console.log "email" and
 * "SMS" stubs (duplicating the real Resend path) and hardcoded localhost links
 * into customer messages.
 *
 * Requests are HMAC-signed so the receiving WaCRM instance can verify they came
 * from DriveIt.
 */

export type WacrmEvent =
  | 'booking.hold_created'
  | 'booking.confirmed'
  | 'booking.rebook_offer'

function sign(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex')
}

export async function sendWacrmEvent(event: WacrmEvent, data: Record<string, unknown>) {
  const url = process.env.WACRM_WEBHOOK_URL
  const secret = process.env.WACRM_WEBHOOK_SECRET

  if (!url || !secret) {
    // WaCRM is optional; never break a booking because it is unconfigured.
    return false
  }

  const payload = JSON.stringify({ event, data })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': sign(payload, secret),
      },
      body: payload,
    })

    if (!response.ok) {
      console.error('[wacrm] webhook responded with', response.status)
      return false
    }

    return true
  } catch (error) {
    console.error('[wacrm] webhook failed:', error instanceof Error ? error.message : error)
    return false
  }
}

/** Deep link that pre-fills checkout so a customer can re-book their usual car. */
export function rebookUrl(carSlug: string, serviceType?: string | null): string {
  const params = new URLSearchParams({ rebook: 'true', carId: carSlug })
  if (serviceType) params.set('service', serviceType)
  return `${serverUrl()}/checkout?${params.toString()}`
}

export function invoiceUrl(bookingId: string | number): string {
  return `${serverUrl()}/dashboard/invoices/${bookingId}`
}
