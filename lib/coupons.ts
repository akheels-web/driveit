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
  if (!coupon) return invalid(code, 'That promo code is not recognised.')

  if (!coupon.isActive) return invalid(code, 'That promo code is no longer active.')

  if (coupon.validUntil && new Date(coupon.validUntil).getTime() < Date.now()) {
    return invalid(code, 'That promo code has expired.')
  }

  const usageLimit = Number(coupon.usageLimit ?? 1)
  const usageCount = Number(coupon.usageCount ?? 0)
  if (usageLimit > 0 && usageCount >= usageLimit) {
    return invalid(code, 'That promo code has already been fully redeemed.')
  }

  if (
    coupon.customerEmail &&
    (!args.email || coupon.customerEmail.trim().toLowerCase() !== args.email.trim().toLowerCase())
  ) {
    return invalid(code, 'That promo code is not available for this account.')
  }

  const discount = discountForCoupon(coupon, Math.max(0, args.subtotal))
  if (discount <= 0) return invalid(code, 'That promo code has no value left to apply.')

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
