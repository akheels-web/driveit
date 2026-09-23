import crypto from 'crypto'
import type { CollectionAfterChangeHook, Payload } from 'payload'

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
 * Runs whenever a booking is created or updated.
 *
 * - `confirmed` → make sure the customer record exists (dashboard/profile/checkout
 *   all read from it).
 * - `completed` → award loyalty points exactly once, refresh tier + lifetime value
 *   and issue a VIP coupon every {LOYALTY_COUPON_EVERY} completed bookings.
 *
 * The completion branch is guarded by `loyaltyRewardIssuedAt`, so retries or
 * duplicate admin saves can never double-issue rewards (the previous version
 * generated a new coupon on every re-save).
 */
export const onBookingStatusChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const booking = doc as Record<string, any>
  const previous = previousDoc as Record<string, any> | undefined

  try {
    const becameConfirmed = booking.status === 'confirmed' && previous?.status !== 'confirmed'
    const becameCompleted = booking.status === 'completed' && previous?.status !== 'completed'

    if (becameConfirmed && booking.customerEmail) {
      await upsertCustomer(req.payload, {
        email: booking.customerEmail,
        name: booking.customerName,
        phone: booking.customerPhone,
      })
      // The hold token has served its purpose once the booking is confirmed.
      if (booking.id && booking.holdToken) {
        await req.payload.update({
          collection: 'bookings',
          id: booking.id,
          data: { holdToken: null },
          overrideAccess: true,
          depth: 0,
        })
      }
    }

    if (!becameCompleted || !booking.customerEmail) return doc

    if (booking.loyaltyRewardIssuedAt) return doc // already rewarded

    const { totalDocs: completedBookings } = await req.payload.count({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: booking.customerEmail } },
          { status: { equals: 'completed' } },
        ],
      },
      overrideAccess: true,
    })

    const earnedPoints = pointsForSpend(Number(booking.totalPrice) || 0)
    const customer = await findCustomerByEmail(req.payload, booking.customerEmail)

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
      })
    } else {
      await upsertCustomer(req.payload, {
        email: booking.customerEmail,
        name: booking.customerName,
        phone: booking.customerPhone,
      })
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
      })

      await sendLoyaltyEmail(req.payload, {
        to: booking.customerEmail,
        customerName: booking.customerName,
        couponCode,
        completionNumber,
      })
    }

    // Mark the booking so this can never run twice.
    await req.payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { loyaltyRewardIssuedAt: new Date().toISOString() },
      overrideAccess: true,
      depth: 0,
    })

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
