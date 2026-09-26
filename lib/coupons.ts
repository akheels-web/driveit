import type { Payload } from 'payload'

import { discountForCoupon } from '@/lib/pricing'

export type CouponValidation = {
  valid: boolean
  code: string
  couponId?: number | string
  discount: number
  discountType?: string
  discountValue?: number
  message: string
}

const invalid = (code: string, message: string): CouponValidation => ({
  valid: false,
  code,
  discount: 0,
  message,
})

/**
 * Validates a coupon against the CMS.
 *
 * This is the only place a discount is ever calculated — the browser cannot
 * apply a code on its own, and expired / over-used / mis-assigned codes are
 * rejected here rather than being trusted from the client.
 */
export async function validateCoupon(
  payload: Payload,
  args: { code: string; email?: string | null; subtotal: number },
): Promise<CouponValidation> {
  const code = args.code?.trim().toUpperCase()
  if (!code) return invalid('', 'Enter a promo code.')

  const { docs } = await payload.find({
    collection: 'coupons',
    where: { code: { equals: code } },
    limit: 1,
    overrideAccess: true,
  })

  const coupon = docs[0] as Record<string, any> | undefined
  if (!coupon) return invalid(code, `The promo code "${code}" is not recognised or has been removed.`)

  if (!coupon.isActive) return invalid(code, `The promo code "${code}" is no longer active.`)

  if (coupon.validUntil && new Date(coupon.validUntil).getTime() < Date.now()) {
    return invalid(code, `The promo code "${code}" has expired.`)
  }

  const usageLimit = Number(coupon.usageLimit ?? 0)
  const usageCount = Number(coupon.usageCount ?? 0)
  if (usageLimit > 0 && usageCount >= usageLimit) {
    return invalid(code, `The promo code "${code}" has reached its maximum global redemptions.`)
  }

  const customerEmailArg = args.email ? args.email.trim().toLowerCase() : null

  // 1. Customer-Specific Restriction: Exclusive to an assigned customer or email
  let assignedEmail: string | null = null
  if (coupon.customerEmail) {
    assignedEmail = coupon.customerEmail.trim().toLowerCase()
  } else if (coupon.assignedCustomer) {
    if (typeof coupon.assignedCustomer === 'object' && coupon.assignedCustomer?.email) {
      assignedEmail = coupon.assignedCustomer.email.trim().toLowerCase()
    } else {
      try {
        const custDoc = (await payload.findByID({
          collection: 'customers',
          id: coupon.assignedCustomer,
          overrideAccess: true,
        })) as Record<string, any> | null
        if (custDoc?.email) assignedEmail = custDoc.email.trim().toLowerCase()
      } catch {}
    }
  }

  if (assignedEmail) {
    if (!customerEmailArg) {
      return invalid(code, 'Please sign in to verify your eligibility for this exclusive promo code.')
    }
    if (assignedEmail !== customerEmailArg) {
      return invalid(code, 'This exclusive promo code is assigned to a specific VIP customer account.')
    }
  }

  // 2. First-Time Customers Only Restriction (e.g. WELCOME10)
  if (coupon.firstTimeOnly) {
    if (!customerEmailArg) {
      return invalid(code, 'Please sign in to verify first-time customer discount eligibility.')
    }

    // Check if customer profile has completed bookings
    const { docs: customerDocs } = await payload.find({
      collection: 'customers',
      where: { email: { equals: customerEmailArg } },
      limit: 1,
      overrideAccess: true,
    })
    const customer = customerDocs[0] as Record<string, any> | undefined
    if (customer && Number(customer.completedBookings) > 0) {
      return invalid(
        code,
        'This welcome discount is valid only on first-time reservations. As an existing member, please explore your loyalty tier rewards.',
      )
    }

    // Check if any existing confirmed or completed bookings exist in the database
    const { docs: priorBookings } = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: customerEmailArg } },
          { status: { in: ['confirmed', 'completed'] } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (priorBookings.length > 0) {
      return invalid(
        code,
        'This welcome discount is valid only for first-time customers. Our records show an existing reservation for this account.',
      )
    }
  }

  // 3. Prevent Same Customer from Reusing the Code Across Multiple Bookings
  if (coupon.oncePerCustomer !== false && customerEmailArg) {
    const { docs: priorRedemptions } = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: customerEmailArg } },
          { couponCode: { equals: code } },
          { status: { in: ['confirmed', 'completed'] } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (priorRedemptions.length > 0) {
      return invalid(code, `You have already redeemed promo code "${code}" on a previous reservation.`)
    }
  }

  const discount = discountForCoupon(coupon, Math.max(0, args.subtotal))
  if (discount <= 0) return invalid(code, 'That promo code provides no discount for this reservation subtotal.')

  return {
    valid: true,
    code,
    couponId: coupon.id,
    discount,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue) || 0,
    message:
      coupon.discountType === 'fixed'
        ? `Promo ${code} applied: ₹${discount.toLocaleString('en-IN')} off!`
        : `Promo ${code} applied: ${coupon.discountValue}% off!`,
  }
}

/** The subset of Payload's Drizzle adapter used for an atomic update. */
type DrizzleLike = { execute: (query: string) => Promise<unknown> }

function drizzleOf(payload: Payload): DrizzleLike | null {
  const db = (payload.db as unknown as { drizzle?: DrizzleLike }).drizzle
  return db && typeof db.execute === 'function' ? db : null
}

/**
 * Claims one redemption of a coupon, atomically.
 *
 * Returns false when the coupon was already exhausted.
 *
 * **Why this is not a read-then-write.** The obvious implementation — read
 * `usageCount`, add one, save — loses redemptions under concurrency: two
 * confirms that both read `usageCount = 0` against a single-use code will both
 * write `1`, and the code gets used twice. That was a real bug here. The
 * conditional `UPDATE ... WHERE usage_count < usage_limit` is evaluated by
 * Postgres under a row lock, so exactly one of them can win, and `RETURNING`
 * tells us which.
 *
 * Booking confirmation is the caller, and a failure here is not silently
 * ignored — see `app/api/checkout/confirm/route.ts`, which alerts staff rather
 * than letting a discount be applied without being counted.
 */
export async function redeemCoupon(payload: Payload, couponId: number | string): Promise<boolean> {
  const id = Number(couponId)
  if (!Number.isFinite(id)) return false

  const drizzle = drizzleOf(payload)

  if (drizzle) {
    const result = await drizzle.execute(
      `update "coupons"
         set "usage_count" = coalesce("usage_count", 0) + 1,
             "updated_at" = now()
       where "id" = ${id}
         and ("usage_limit" is null or "usage_limit" <= 0 or coalesce("usage_count", 0) < "usage_limit")
       returning "usage_count"`,
    )

    // node-postgres gives `{ rows }`; drizzle may hand back a plain array.
    // One row back = this caller claimed the last redemption.
    const rows = Array.isArray(result) ? result : ((result as { rows?: unknown[] })?.rows ?? [])
    return rows.length > 0
  }

  // Fallback for a non-Drizzle adapter: best effort, and honest about the race.
  const coupon = (await payload.findByID({
    collection: 'coupons',
    id: couponId,
    overrideAccess: true,
  })) as Record<string, any> | null

  if (!coupon) return false

  const usageLimit = Number(coupon.usageLimit ?? 0)
  const usageCount = Number(coupon.usageCount ?? 0)
  if (usageLimit > 0 && usageCount >= usageLimit) return false

  await payload.update({
    collection: 'coupons',
    id: couponId,
    data: { usageCount: usageCount + 1 },
    overrideAccess: true,
  })
  return true
}
