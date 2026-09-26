'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

import { auth } from '@/auth'
import configPromise from '@/payload.config'
import { getCarByIdentifier } from '@/lib/cms'
import {
  BookingConflictError,
  BookingInputError,
  createBookingHold,
  holdTokenMatches,
  isHoldExpired,
} from '@/lib/booking-holds'
import { validateCoupon } from '@/lib/coupons'
import { computeQuote, QuoteError } from '@/lib/pricing'
import type { Booking, BookingFormData } from '@/lib/types'
import { bookingAlertText, sendTelegramAlert } from '@/lib/telegram'
import { notifyBookingConfirmed, notifyBookingHoldCreated } from '@/lib/booking-notifications'
import { findCustomerByEmail, isProfileAndKycComplete } from '@/lib/customers'

const toBooking = (doc: Record<string, any>): Booking => ({
  id: String(doc.id),
  customerName: doc.customerName,
  customerEmail: doc.customerEmail,
  customerPhone: doc.customerPhone,
  carName: doc.carName,
  carSlug: doc.carSlug ?? null,
  pickupLocation: doc.pickupLocation ?? null,
  dropoffLocation: doc.dropoffLocation ?? null,
  serviceType: doc.serviceType ?? null,
  status: doc.status,
  startDate: doc.startDate ?? null,
  endDate: doc.endDate ?? null,
  days: doc.days ?? null,
  totalPrice: Number(doc.totalPrice) || 0,
  discountApplied: doc.discountApplied ?? 0,
  couponCode: doc.couponCode ?? null,
  createdAt: doc.createdAt,
})

/**
 * Creates a 10 minute hold (status `pending`) for a booking request.
 *
 * The previous implementation wrote a production-ready `confirmed` booking
 * directly from the browser with no availability check, no pricing check and no
 * payment — anyone could block the whole fleet. Now it goes through the exact
 * same hold flow as /api/checkout/init, and confirmation requires the returned
 * hold token.
 */
export async function createBooking(data: BookingFormData) {
  const session = await auth()

  try {
    const identifier = data.carSlug || data.carId
    if (!identifier) return { success: false as const, error: 'Please choose a vehicle.' }

    const car = await getCarByIdentifier(identifier)
    if (!car) return { success: false as const, error: 'That vehicle is no longer available.' }

    const startDate = data.bookingDate ? new Date(data.bookingDate) : new Date()
    const days = Math.max(1, Math.min(90, Number(data.durationDays) || 1))
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)

    const payload = await getPayload({ config: configPromise })

    const customerEmail = data.customerEmail || session?.user?.email
    if (!customerEmail) {
      return { success: false as const, error: 'Please sign in or provide your registered email to book.' }
    }

    const customer = await findCustomerByEmail(payload, customerEmail)
    const kycCheck = isProfileAndKycComplete(customer)
    if (!kycCheck.complete) {
      return {
        success: false as const,
        error: `Booking blocked: ${kycCheck.reasons.join(' ')} Please complete your profile and KYC in your dashboard.`,
      }
    }

    const isSelfDrive = data.serviceType === 'selfdrive'
    const dailyRate = isSelfDrive
      ? (car.selfDrivePrice ?? Math.round(car.price * 0.85))
      : car.price

    const base = computeQuote({
      pricePerDay: dailyRate,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })

    let couponCode: string | null = null
    let discount = 0
    const requestedCoupon = (data as any).couponCode as string | undefined

    if (requestedCoupon) {
      const coupon = await validateCoupon(payload, {
        code: requestedCoupon,
        email: data.customerEmail || session?.user?.email,
        subtotal: base.base + base.addonsTotal,
      })
      if (!coupon.valid) {
        return {
          success: false as const,
          error: `Promo code error: ${coupon.message}`,
        }
      }
      couponCode = coupon.code
      discount = coupon.discount
    }

    const quote = computeQuote({
      pricePerDay: dailyRate,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      discount,
    })

    const hold = await createBookingHold(payload, {
      carSlug: car.slug,
      carName: car.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days: quote.days,
      totalPrice: quote.total,
      serviceType: data.serviceType || 'chauffeur',
      customerName: data.customerName,
      customerEmail: (data.customerEmail || session?.user?.email || '').toLowerCase(),
      customerPhone: data.customerPhone,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation ?? null,
      couponCode,
      discountApplied: quote.discount,
      whatsappNumber: data.customerPhone,
    })

    const reference = `DRV-${String(hold.bookingId).padStart(5, '0')}`

    await sendTelegramAlert(
      bookingAlertText({
        reference,
        carName: car.name,
        serviceType: data.serviceType,
        pickupLocation: data.pickupLocation,
        startDate: startDate.toLocaleString('en-IN'),
        endDate: endDate.toLocaleString('en-IN'),
        totalPrice: quote.total,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        notes: data.notes,
      }),
    )

    await notifyBookingHoldCreated({
      bookingId: hold.bookingId,
      reference,
      carSlug: car.slug,
      carName: car.name,
      serviceType: data.serviceType,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      pickupLocation: data.pickupLocation,
      totalPrice: quote.total,
    })

    return {
      success: true as const,
      bookingId: String(hold.bookingId),
      reference,
      holdToken: hold.holdToken,
      holdExpiresAt: hold.holdExpiresAt,
      totalPrice: quote.total,
      days: quote.days,
    }
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return { success: false as const, error: error.message }
    }
    if (error instanceof BookingInputError || error instanceof QuoteError) {
      return { success: false as const, error: error.message }
    }

    console.error('[createBooking] failed:', error)
    return { success: false as const, error: 'We could not create this booking. Please try again.' }
  }
}

/** Bookings belonging to the signed-in customer. */
export async function getUserBookings(): Promise<{ bookings: Booking[]; error: string | null }> {
  const session = await auth()
  if (!session?.user?.email) return { bookings: [], error: 'Not authenticated' }

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'bookings',
      where: { customerEmail: { equals: session.user.email.toLowerCase() } },
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true, // filtered by the session email above
    })

    return { bookings: docs.map((doc) => toBooking(doc as Record<string, any>)), error: null }
  } catch (error) {
    console.error('[getUserBookings] failed:', error)
    return { bookings: [], error: 'Could not load your bookings.' }
  }
}

/**
 * Marks a UPI payment as complete and confirms the booking.
 *
 * Requires the hold token issued when the booking was created — without it,
 * anybody who guessed a booking id could confirm (and "pay for") someone
 * else's reservation.
 */
export async function updatePaymentStatus(
  bookingId: string,
  upiTransactionId: string,
  holdToken: string,
) {
  if (!bookingId || !holdToken) {
    return { success: false as const, error: 'Missing booking session token.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const booking = (await payload.findByID({
      collection: 'bookings',
      id: bookingId,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, any> | null

    if (!booking) return { success: false as const, error: 'Booking not found.' }

    if (!holdTokenMatches(booking.holdToken, holdToken)) {
      return { success: false as const, error: 'This booking session is no longer valid.' }
    }

    if (booking.status === 'confirmed') return { success: true as const, alreadyConfirmed: true }

    if (isHoldExpired(booking.holdExpiresAt, booking.status)) {
      return { success: false as const, error: 'Your reservation hold expired. Please book again.' }
    }

    const updated = await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: { status: 'confirmed', ...(upiTransactionId ? { upiTransactionId } : {}) },
      overrideAccess: true,
      depth: 0,
    })

    await notifyBookingConfirmed({
      bookingId: String(updated.id),
      reference: `DRV-${String(updated.id).padStart(5, '0')}`,
      carSlug: booking.carSlug ?? '',
      customerName: booking.customerName,
      totalPrice: Number(booking.totalPrice) || 0,
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/bookings')

    return { success: true as const, bookingId: String(updated.id) }
  } catch (error) {
    console.error('[updatePaymentStatus] failed:', error)
    return { success: false as const, error: 'Could not confirm the payment. Please contact support.' }
  }
}
