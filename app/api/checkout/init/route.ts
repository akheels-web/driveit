import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { getCarByIdentifier } from '@/lib/cms'
import { BookingConflictError, BookingInputError, createBookingHold } from '@/lib/booking-holds'
import { validateCoupon } from '@/lib/coupons'
import { computeQuote, QuoteError } from '@/lib/pricing'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

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
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: 'Invalid pickup date.' }, { status: 400 })
  }
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

    // Price the booking from the CMS, never from the request body.
    const priced = computeQuote({
      pricePerDay: car.price,
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
      pricePerDay: car.price,
      startDate: input.startDate,
      endDate: input.endDate,
      addons,
      discount,
    })

    const hold = await createBookingHold(payload, {
      carSlug: car.slug,
      carName: car.name,
      startDate: start.toISOString(),
      endDate: new Date(input.endDate).toISOString(),
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
      car: { id: car.id, slug: car.slug, name: car.name, image: car.src, pricePerDay: car.price },
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
