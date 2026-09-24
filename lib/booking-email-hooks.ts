import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import {
  sendPaymentVerifiedNotification,
  sendPaymentFailedNotification,
  sendBookingCancelledNotification,
  sendTripCompletedReviewNotification,
} from '@/lib/brevo'
import { pointsForSpend } from '@/lib/loyalty'

/**
 * Data-only beforeChange hook to stamp transition guards in the same database statement,
 * avoiding recursive nested updates on PostgreSQL.
 */
export const stampBookingEmailGuards: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const doc = data as Record<string, any>
  const before = originalDoc as Record<string, any> | undefined

  if (
    doc.paymentStatus === 'verified' &&
    before?.paymentStatus !== 'verified' &&
    !doc.paymentReceiptSentAt
  ) {
    doc.paymentReceiptSentAt = new Date().toISOString()
  }

  if (
    doc.status === 'cancelled' &&
    before?.status !== 'cancelled' &&
    !doc.cancellationNotifiedAt
  ) {
    doc.cancellationNotifiedAt = new Date().toISOString()
  }

  if (
    doc.status === 'completed' &&
    before?.status !== 'completed' &&
    !doc.reviewRequestedAt
  ) {
    doc.reviewRequestedAt = new Date().toISOString()
  }

  return doc
}

/**
 * Dispatches relevant Brevo notifications asynchronously after a booking is updated.
 */
export const onBookingEmailNotifications: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const booking = doc as Record<string, any>
  const previous = previousDoc as Record<string, any> | undefined

  if (!booking?.customerEmail) return doc

  // 1. Payment Verified Notification
  const becameVerified =
    booking.paymentStatus === 'verified' && previous?.paymentStatus !== 'verified'
  if (becameVerified) {
    sendPaymentVerifiedNotification(booking).catch((err) =>
      req.payload.logger.error(`[brevo] Payment verified notification failed: ${err}`),
    )
  }

  // 2. Payment Failed Notification
  const becamePaymentFailed =
    booking.paymentStatus === 'failed' && previous?.paymentStatus !== 'failed'
  if (becamePaymentFailed) {
    sendPaymentFailedNotification(booking).catch((err) =>
      req.payload.logger.error(`[brevo] Payment failed notification failed: ${err}`),
    )
  }

  // 3. Booking Cancelled Notification
  const becameCancelled =
    booking.status === 'cancelled' && previous?.status !== 'cancelled'
  if (becameCancelled) {
    sendBookingCancelledNotification(booking, booking.notes || null).catch((err) =>
      req.payload.logger.error(`[brevo] Booking cancelled notification failed: ${err}`),
    )
  }

  // 4. Trip Completed & Review Notification
  const becameCompleted =
    booking.status === 'completed' && previous?.status !== 'completed'
  if (becameCompleted) {
    const points = pointsForSpend(Number(booking.totalPrice) || 0)
    sendTripCompletedReviewNotification(booking, points).catch((err) =>
      req.payload.logger.error(`[brevo] Trip completed notification failed: ${err}`),
    )
  }

  return doc
}
