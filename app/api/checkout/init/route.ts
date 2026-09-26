import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { getCarByIdentifier } from '@/lib/cms'
import { BookingConflictError, BookingInputError, createBookingHold } from '@/lib/booking-holds'
import { validateCoupon } from '@/lib/coupons'
import { computeQuote, QuoteError } from '@/lib/pricing'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'
import { findCustomerByEmail, isProfileAndKycComplete } from '@/lib/customers'

export const dynamic = 'force-dynamic'

const InitSchema = z.object({
  carSlug: z.string().trim().min(1).max(200),
  startDate: z.string().trim().min(4),
  endDate: z.string().trim().min(4),
  customerName: z.string().trim().min(2).max(160),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().min(6).max(30),
  pickupLocation: z.string().trim().max(300).optional().nullable(),
  dropoffLocation: z.string().trim().max(300).optional().nullable(),
  serviceType: z.enum(['chauffeur', 'selfdrive', 'airport']).optional(),
  addons: z.string().trim().max(300).optional().nullable(),
  couponCode: z.string().trim().max(60).optional().nullable(),
  whatsappNumber: z.string().trim().max(30).optional().nullable(),
  packageType: z.string().trim().max(40).optional().nullable(),
  flightNumber: z.string().trim().max(30).optional().nullable(),
  airportTerminal: z.string().trim().max(100).optional().nullable(),
  gstin: z.string().trim().max(30).optional().nullable(),
  companyName: z.string().trim().max(160).optional().nullable(),
})

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'checkout-init', {
    limit: 10,
    windowMs: 60_000,
    globalLimit: 600,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = InitSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the booking details.' },
      { status: 400 },
    )
  }

  const input = parsed.data

  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: 'Invalid pickup date.' }, { status: 400 })
  }
  if (Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: 'Invalid return date.' }, { status: 400 })
  }

  // A return before pickup would otherwise be quietly coerced into a one-day
  // rental by the pricing rules (see lib/pricing.ts) — a silent wrong price is
  // worse than a rejected request.
  if (end.getTime() < start.getTime()) {
    return NextResponse.json(
      { error: 'The return date cannot be before the pickup date.' },
      { status: 400 },
    )
  }

  // Dates arrive as calendar days, and a customer booking "today" in UTC+13 is
  // already quoting yesterday in UTC — so allow a day of slack rather than
  // rejecting legitimate same-day bookings from the wrong timezone.
  if (start.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: 'Pickup date cannot be in the past.' }, { status: 400 })
  }

  const car = await getCarByIdentifier(input.carSlug)
  if (!car) {
    return NextResponse.json({ error: 'That vehicle is no longer available.' }, { status: 404 })
  }

  const addons = (input.addons || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  try {
    const payload = await getPayload({ config })

    // Strict Gate: Profile and KYC verification must be complete before creating a booking hold
    const customer = await findCustomerByEmail(payload, input.customerEmail)
    const kycCheck = isProfileAndKycComplete(customer)
    if (!kycCheck.complete) {
      return NextResponse.json(
        {
          error: `Booking blocked: ${kycCheck.reasons.join(' ')} Please complete your profile and KYC in your dashboard before booking.`,
          code: 'KYC_INCOMPLETE',
          reasons: kycCheck.reasons,
        },
        { status: 403 },
      )
    }

    const isSelfDrive = input.serviceType === 'selfdrive'
    const dailyRate = isSelfDrive ? (car.selfDrivePrice ?? Math.round(car.price * 0.85)) : car.price

    // Price the booking from the CMS, never from the request body.
    const priced = computeQuote({
      pricePerDay: dailyRate,
      startDate: input.startDate,
      endDate: input.endDate,
      addons,
    })

    let couponCode: string | null = null
    let discount = 0

    if (input.couponCode) {
      const coupon = await validateCoupon(payload, {
        code: input.couponCode,
        email: input.customerEmail,
        subtotal: priced.base + priced.addonsTotal,
      })
      if (coupon.valid) {
        couponCode = coupon.code
        discount = coupon.discount
      }
    }

    const quote = computeQuote({
      pricePerDay: dailyRate,
      startDate: input.startDate,
      endDate: input.endDate,
      addons,
      discount,
    })

    const securityDepositAmount = isSelfDrive ? (car.securityDepositAmount ?? 25000) : 0

    const hold = await createBookingHold(payload, {
      carSlug: car.slug,
      carName: car.name,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      days: quote.days,
      totalPrice: quote.total,
      serviceType: input.serviceType || 'chauffeur',
      customerName: input.customerName,
      customerEmail: input.customerEmail.toLowerCase(),
      customerPhone: input.customerPhone,
      pickupLocation: input.pickupLocation ?? null,
      dropoffLocation: input.dropoffLocation ?? null,
      addons: addons.join(',') || null,
      couponCode,
      discountApplied: quote.discount,
      whatsappNumber: input.whatsappNumber ?? input.customerPhone,
      securityDepositAmount,
      securityDepositStatus: isSelfDrive ? 'held' : 'na',
      flightNumber: input.flightNumber ?? null,
      airportTerminal: input.airportTerminal ?? null,
      gstin: input.gstin ?? null,
      companyName: input.companyName ?? null,
    })

    return NextResponse.json({
      success: true,
      bookingId: hold.bookingId,
      holdToken: hold.holdToken,
      holdExpiresAt: hold.holdExpiresAt,
      days: quote.days,
      // Server-computed totals: the UI must display these, not its own estimate.
      totalPrice: quote.total,
      basePrice: quote.base,
      addonsTotal: quote.addonsTotal,
      addonLines: quote.addonLines,
      discount: quote.discount,
      couponCode,
      securityDepositAmount,
      car: {
        id: car.id,
        slug: car.slug,
        name: car.name,
        image: car.src,
        pricePerDay: dailyRate,
        chauffeurPrice: car.price,
        selfDrivePrice: car.selfDrivePrice ?? Math.round(car.price * 0.85),
        securityDepositAmount,
        fuelPolicy: car.fuelPolicy,
        fastTagEquipped: car.fastTagEquipped,
      },
    })
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return NextResponse.json(
        { error: 'This car is currently reserved for those dates. Please choose another vehicle or time.' },
        { status: 409 },
      )
    }
    if (error instanceof BookingInputError || error instanceof QuoteError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('[checkout/init] failed:', error)
    return NextResponse.json(
      { error: 'We could not start your booking. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
