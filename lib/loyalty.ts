import crypto from 'crypto'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, Payload } from 'payload'

import { findCustomerByEmail, upsertCustomer } from '@/lib/customers'
import { escapeHtml } from '@/lib/html'

export const POINTS_PER_SPEND_BLOCK = 100 // points per ₹10,000
export const SPEND_BLOCK = 10_000
export const GOLD_THRESHOLD = 1_000
export const PLATINUM_THRESHOLD = 5_000
export const LOYALTY_COUPON_EVERY = 5 // issue a reward every 5 completed bookings
export const LOYALTY_COUPON_PERCENT = 20

export function tierForPoints(points: number): 'silver' | 'gold' | 'platinum' {
  if (points >= PLATINUM_THRESHOLD) return 'platinum'
  if (points >= GOLD_THRESHOLD) return 'gold'
  return 'silver'
}

export function pointsForSpend(totalPrice: number): number {
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) return 0
  return Math.floor(totalPrice / SPEND_BLOCK) * POINTS_PER_SPEND_BLOCK
}

function loyaltyCouponCode(): string {
  return `VIP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

/**
 * Data-only hook: adjusts the document **being written**, no database calls.
 *
 * A completed booking gets its `loyaltyRewardIssuedAt` stamp here, in the same
 * statement that sets `status: 'completed'`.
 *
 * This used to be a nested `req.payload.update` on the *same* row from the
 * afterChange hook, which deadlocks on Postgres: the outer update already holds
 * the row lock inside its transaction, and the nested call opens a second pooled
 * connection whose UPDATE waits for that lock forever. The request never
 * returns, the booking never changes, and every later confirm queues up behind
 * it. (SQLite hid this because everything shares one connection.)
 *
 * Stamping here is also strictly safer than before: the guard is persisted with
 * the transition it guards, so a crash or retry can never award the reward twice.
 */
export const stampBookingTransitions: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const doc = data as Record<string, any>
  // `originalDoc` is the stored document before this change (undefined on create).
  const before = originalDoc as Record<string, any> | undefined

  if (
    doc.status === 'completed' &&
    before?.status !== 'completed' &&
    !doc.loyaltyRewardIssuedAt
  ) {
    doc.loyaltyRewardIssuedAt = new Date().toISOString()
  }

  return doc
}

/**
 * Side effects of a booking changing state.
 *
 * - `confirmed` → make sure the customer record exists (dashboard/profile/checkout
 *   all read from it).
 * - `completed` → award loyalty points once, refresh tier + lifetime value and
 *   issue a VIP coupon every {LOYALTY_COUPON_EVERY} completed bookings.
 *
 * Two rules this hook has to respect:
 *
 *  1. **Never write to the document being saved.** That is what `stampBookingTransitions`
 *     is for; a nested update to the same row self-deadlocks (see above).
 *  2. **Pass `req` into every local API call.** Without it each call starts its own
 *     transaction on another connection, which means extra pool pressure, writes
 *     that commit separately from the booking, and reads that cannot see the row
 *     being saved — the completed-booking count came out one short.
 *
 * The completion branch is guarded by `loyaltyRewardIssuedAt`, so retries or
 * duplicate admin saves can never double-issue rewards.
 */
export const onBookingStatusChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const booking = doc as Record<string, any>
  const previous = previousDoc as Record<string, any> | undefined

  try {
    const becameConfirmed = booking.status === 'confirmed' && previous?.status !== 'confirmed'
    const becameCompleted = booking.status === 'completed' && previous?.status !== 'completed'

    if (becameConfirmed && booking.customerEmail) {
      await upsertCustomer(
        req.payload,
        {
          email: booking.customerEmail,
          name: booking.customerName,
          phone: booking.customerPhone,
        },
        req,
      )
    }

    if (!becameCompleted || !booking.customerEmail) return doc

    // Already rewarded on a previous save — the stamp survives re-saves.
    if (previous?.loyaltyRewardIssuedAt) return doc

    const { totalDocs: completedBookings } = await req.payload.count({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: booking.customerEmail } },
          { status: { equals: 'completed' } },
        ],
      },
      overrideAccess: true,
      req,
    })

    const earnedPoints = pointsForSpend(Number(booking.totalPrice) || 0)
    const customer = await findCustomerByEmail(req.payload, booking.customerEmail, req)

    const currentPoints = Number(customer?.loyaltyPoints) || 0
    const lifetimeValue = (Number(customer?.totalSpent) || 0) + (Number(booking.totalPrice) || 0)

    // Which completion number this is (counting the booking being saved now).
    const completionNumber = Math.max(1, completedBookings)
    const shouldIssueCoupon = completionNumber % LOYALTY_COUPON_EVERY === 0
    const couponCode = shouldIssueCoupon ? loyaltyCouponCode() : null

    if (customer) {
      const nextPoints = currentPoints + earnedPoints
      await req.payload.update({
        collection: 'customers',
        id: customer.id,
        data: {
          loyaltyPoints: nextPoints,
          loyaltyTier: tierForPoints(nextPoints),
          completedBookings: completionNumber,
          totalSpent: lifetimeValue,
        },
        overrideAccess: true,
        req,
      })
    } else {
      await upsertCustomer(
        req.payload,
        {
          email: booking.customerEmail,
          name: booking.customerName,
          phone: booking.customerPhone,
        },
        req,
      )
    }

    if (couponCode) {
      await req.payload.create({
        collection: 'coupons',
        data: {
          code: couponCode,
          discountType: 'percentage',
          discountValue: LOYALTY_COUPON_PERCENT,
          usageLimit: 1,
          isActive: true,
          customerEmail: booking.customerEmail,
        },
        overrideAccess: true,
        req,
      })

      await sendLoyaltyEmail(req.payload, {
        to: booking.customerEmail,
        customerName: booking.customerName,
        couponCode,
        completionNumber,
      })
    }

    if (!shouldIssueCoupon) {
      req.payload.logger.info(
        `Loyalty: awarded ${earnedPoints} points to ${booking.customerEmail} (booking #${completionNumber})`,
      )
      return doc
    }

    req.payload.logger.info(`Loyalty: coupon ${couponCode} issued to ${booking.customerEmail}`)
  } catch (error) {
    req.payload.logger.error(
      `Loyalty hook failed for booking ${booking?.id ?? 'unknown'}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  return doc
}

async function sendLoyaltyEmail(
  payload: Payload,
  args: { to: string; customerName?: string; couponCode: string; completionNumber: number },
) {
  try {
    await payload.sendEmail({
      to: args.to,
      subject: 'Your Exclusive DriveIt Concierge Reward! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #c99339;">Thank you for your loyalty!</h2>
          <p>Dear ${escapeHtml(args.customerName || 'Valued Guest')},</p>
          <p>You have just completed booking number ${args.completionNumber} with DriveIt Luxury Concierge.
          As a token of our appreciation, here is ${LOYALTY_COUPON_PERCENT}% off your next reservation.</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; margin-bottom: 5px;">Your VIP Promo Code:</p>
            <h1 style="margin: 0; color: #000; letter-spacing: 2px;">${args.couponCode}</h1>
          </div>
          <p>We look forward to serving you again soon.</p>
          <p>Best regards,<br><strong>DriveIt Luxury Concierge Team</strong></p>
        </div>
      `,
    })
  } catch (error) {
    payload.logger.error(
      `Loyalty email failed for ${args.to}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
