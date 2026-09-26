import { serverUrl } from '@/lib/env'
import {
  renderBookingConfirmedEmail,
  renderPaymentVerifiedEmail,
  renderPaymentFailedEmail,
  renderBookingReminderEmail,
  renderVehicleReturnReminderEmail,
  renderBookingCancelledEmail,
  renderAccountWelcomeEmail,
  renderTripCompletedReviewEmail,
} from './email-templates'

export interface BrevoRecipient {
  email: string
  name?: string
}

export interface BrevoAttachment {
  name: string
  content: string // Base64 encoded string
}

export interface SendBrevoEmailOptions {
  to: string | BrevoRecipient | BrevoRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: BrevoAttachment[]
  replyTo?: BrevoRecipient
}

export interface SyncBrevoContactOptions {
  email: string
  name?: string | null
  phone?: string | null
  attributes?: Record<string, unknown>
  listIds?: number[]
}

const BREVO_API_URL = 'https://api.brevo.com/v3'

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL_FROM_ADDRESS?.trim() || 'concierge@driveitluxury.in'
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || process.env.EMAIL_FROM_NAME?.trim() || 'DriveIt Luxury Concierge'
  const marketingListId = process.env.BREVO_MARKETING_LIST_ID ? parseInt(process.env.BREVO_MARKETING_LIST_ID, 10) : undefined

  return { apiKey, senderEmail, senderName, marketingListId }
}

/**
 * Sends a transactional email using Brevo's v3 SMTP REST API.
 * Never throws errors: fails soft and logs warnings so customer checkout / bookings
 * are never broken if email credentials are not yet configured or API is temporarily down.
 */
export async function sendBrevoEmail(options: SendBrevoEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { apiKey, senderEmail, senderName } = getBrevoConfig()

  if (!apiKey) {
    console.warn('[brevo] BREVO_API_KEY is not set — email notification skipped.')
    return { success: false, error: 'BREVO_API_KEY not configured' }
  }

  const recipients: BrevoRecipient[] = Array.isArray(options.to)
    ? options.to
    : typeof options.to === 'string'
      ? [{ email: options.to }]
      : [options.to]

  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: recipients,
    subject: options.subject,
    htmlContent: options.htmlContent,
  }

  if (options.textContent) {
    payload.textContent = options.textContent
  }

  if (options.replyTo) {
    payload.replyTo = options.replyTo
  }

  if (options.attachments && options.attachments.length > 0) {
    payload.attachment = options.attachments
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[brevo] Transactional email failed (${response.status}):`, errorText)
      return { success: false, error: errorText }
    }

    const data = (await response.json()) as { messageId?: string }
    return { success: true, messageId: data.messageId }
  } catch (error) {
    console.error('[brevo] Network error sending email:', error instanceof Error ? error.message : error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Creates or updates a contact in Brevo's contact list for email marketing & CRM.
 */
export async function syncBrevoContact(options: SyncBrevoContactOptions): Promise<{ success: boolean; error?: string }> {
  const { apiKey, marketingListId } = getBrevoConfig()

  if (!apiKey) {
    return { success: false, error: 'BREVO_API_KEY not configured' }
  }

  const attributes: Record<string, unknown> = {
    ...(options.attributes || {}),
  }

  if (options.name) {
    const parts = options.name.trim().split(/\s+/)
    attributes.FIRSTNAME = parts[0]
    if (parts.length > 1) attributes.LASTNAME = parts.slice(1).join(' ')
  }

  if (options.phone) {
    attributes.SMS = options.phone
  }

  const listIds = options.listIds || (marketingListId ? [marketingListId] : [])

  const body: Record<string, unknown> = {
    email: options.email.toLowerCase().trim(),
    attributes,
    updateEnabled: true,
  }

  if (listIds.length > 0) {
    body.listIds = listIds
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    // Brevo returns 201 Created or 204 No Content on success
    if (response.ok || response.status === 204) {
      return { success: true }
    }

    const err = await response.text()
    console.warn('[brevo] Contact sync notice:', err)
    return { success: false, error: err }
  } catch (error) {
    console.error('[brevo] Error syncing contact:', error instanceof Error ? error.message : error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// ─────────────────────────────────────────────────────────────
// High-Level Notification Dispatchers
// ─────────────────────────────────────────────────────────────

export async function sendBookingConfirmedNotification(booking: Record<string, any>, invoicePdfBuffer?: Buffer) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const invoiceUrl = `${base}/dashboard/invoices/${booking.id}`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderBookingConfirmedEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    serviceType: booking.serviceType,
    pickupLocation: booking.pickupLocation,
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalPrice: Number(booking.totalPrice || 0),
    paymentStatus: booking.paymentStatus,
    upiTransactionId: booking.upiTransactionId,
    invoiceUrl,
  })

  const attachments: BrevoAttachment[] = []
  if (invoicePdfBuffer && invoicePdfBuffer.length > 0) {
    attachments.push({
      name: `DriveIt-Invoice-${reference}.pdf`,
      content: invoicePdfBuffer.toString('base64'),
    })
  }

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })

  // Sync customer to Brevo contacts list as an active VIP lead
  syncBrevoContact({
    email: booking.customerEmail,
    name: booking.customerName,
    phone: booking.customerPhone,
    attributes: {
      LAST_BOOKING_REF: reference,
      LAST_CAR_BOOKED: booking.carName,
    },
  }).catch(() => {})

  return result.success
}

export async function sendPaymentVerifiedNotification(booking: Record<string, any>) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const invoiceUrl = `${base}/dashboard/invoices/${booking.id}`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderPaymentVerifiedEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    totalPrice: Number(booking.totalPrice || 0),
    upiTransactionId: booking.upiTransactionId,
    invoiceUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendPaymentFailedNotification(booking: Record<string, any>) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const checkoutUrl = `${base}/checkout?carId=${encodeURIComponent(booking.carSlug || '')}`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderPaymentFailedEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    totalPrice: Number(booking.totalPrice || 0),
    upiTransactionId: booking.upiTransactionId,
    checkoutUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendBookingCancelledNotification(booking: Record<string, any>, cancellationReason?: string | null) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const exploreFleetUrl = `${base}/cars`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderBookingCancelledEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    cancellationReason: cancellationReason || booking.notes || null,
    exploreFleetUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendBookingPickupReminderNotification(booking: Record<string, any>) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const dashboardUrl = `${base}/dashboard/bookings`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderBookingReminderEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    serviceType: booking.serviceType,
    pickupLocation: booking.pickupLocation,
    startDate: booking.startDate,
    dashboardUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendVehicleReturnReminderNotification(booking: Record<string, any>) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const dashboardUrl = `${base}/dashboard/bookings`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderVehicleReturnReminderEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    endDate: booking.endDate,
    dropoffLocation: booking.dropoffLocation || booking.pickupLocation,
    dashboardUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendTripCompletedReviewNotification(booking: Record<string, any>, pointsEarned: number, currentTier?: string | null) {
  if (!booking.customerEmail) return false

  const base = serverUrl()
  const feedbackUrl = `${base}/dashboard?review=prompt`
  const reference = booking.reference || `DRV-${String(booking.id).padStart(5, '0')}`

  const { subject, html } = renderTripCompletedReviewEmail({
    customerName: booking.customerName || 'Valued Guest',
    reference,
    carName: booking.carName || 'Luxury Vehicle',
    pointsEarned,
    currentTier,
    feedbackUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: booking.customerEmail, name: booking.customerName },
    subject,
    htmlContent: html,
  })

  return result.success
}

export async function sendAccountWelcomeNotification(customerName: string, customerEmail: string) {
  if (!customerEmail) return false

  const base = serverUrl()
  const exploreFleetUrl = `${base}/cars`

  const { subject, html } = renderAccountWelcomeEmail({
    customerName: customerName || 'Valued Member',
    exploreFleetUrl,
  })

  const result = await sendBrevoEmail({
    to: { email: customerEmail, name: customerName },
    subject,
    htmlContent: html,
  })

  // Add new customer to Brevo Marketing List
  syncBrevoContact({
    email: customerEmail,
    name: customerName,
    attributes: {
      SIGNUP_DATE: new Date().toISOString(),
    },
  }).catch(() => {})

  return result.success
}
