import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { validateCoupon } from '@/lib/coupons'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  code: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(200).optional().nullable(),
  subtotal: z.number().nonnegative().max(100_000_000).optional(),
})

export async function POST(request: Request) {
  // Coupon codes are brute-forceable, so keep this tight.
  const verdict = await limitRequest(request, 'coupon-validate', {
    limit: 12,
    windowMs: 60_000,
    globalLimit: 1_200,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ valid: false, discount: 0, message: 'Invalid request.' }, { status: 400 })
  }

  const parsed = Schema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json({ valid: false, discount: 0, message: 'Enter a promo code.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const result = await validateCoupon(payload, {
    code: parsed.data.code,
    email: parsed.data.email,
    subtotal: parsed.data.subtotal ?? 0,
  })

  // Only pricing-relevant fields are ever returned.
  return NextResponse.json({
    valid: result.valid,
    code: result.code,
    discount: result.discount,
    discountType: result.discountType ?? null,
    discountValue: result.discountValue ?? null,
    message: result.message,
  })
}
