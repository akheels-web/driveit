import { invoiceUrl, rebookUrl, sendWacrmEvent } from '@/lib/notifications'

/**
 * Booking notifications.
 *
 * Single entry point so we never send the same thing twice through two
 * different systems (the old code had a stub NotificationService *and* a direct
 * payload.sendEmail path). Transactional email/WhatsApp stay in the route
 * handlers; these helpers push CRM events to WaCRM.
 */

export async function notifyBookingHoldCreated(input: {
  bookingId: string | number
  reference: string
  carSlug: string
  carName: string
  serviceType?: string | null
  customerName: string
  customerPhone: string
  pickupLocation?: string | null
  totalPrice: number
}) {
  return sendWacrmEvent('booking.hold_created', {
    booking_ref: input.reference,
    booking_id: String(input.bookingId),
    car_name: input.carName,
    car_slug: input.carSlug,
    service_type: input.serviceType ?? 'chauffeur',
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    pickup_location: input.pickupLocation ?? null,
    total_amount: input.totalPrice,
    status: 'pending_hold',
    rebook_url: rebookUrl(input.carSlug, input.serviceType ?? undefined),
  })
}

export async function notifyBookingConfirmed(input: {
  bookingId: string | number
  reference: string
  carSlug: string
  customerName: string
  totalPrice: number
}) {
  return sendWacrmEvent('booking.confirmed', {
    booking_ref: input.reference,
    booking_id: String(input.bookingId),
    car_slug: input.carSlug,
    customer_name: input.customerName,
    total_amount: input.totalPrice,
    status: 'confirmed',
    ticket_url: invoiceUrl(input.bookingId),
    rebook_url: input.carSlug ? rebookUrl(input.carSlug) : undefined,
  })
}
