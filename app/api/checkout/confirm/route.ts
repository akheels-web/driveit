import { NextResponse, after } from 'next/server'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import config from '@/payload.config'
import { generateInvoicePDFBuffer } from '@/lib/invoice'
import { sendWhatsAppConfirmation } from '@/lib/whatsapp'
import { holdTokenMatches, isHoldExpired } from '@/lib/booking-holds'
import { redeemCoupon, validateCoupon } from '@/lib/coupons'
import { escapeHtml } from '@/lib/html'
import { serverUrl } from '@/lib/env'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'
import { bookingAlertText, couponAlertText, sendTelegramAlert } from '@/lib/telegram'
import { bookingReference } from '@/lib/invoice'
import { AWAITING_VERIFICATION, paymentNeedsReview } from '@/lib/payments'
import { sendBookingConfirmedNotification } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

const ConfirmSchema = z.object({
  bookingId: z.union([z.string().trim().min(1).max(50), z.number()]),
  holdToken: z.string().trim().min(16).max(200),
  upiTransactionId: z.string().trim().max(120).optional().nullable(),
})

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'checkout-confirm', {
    limit: 20,
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

  const parsed = ConfirmSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing booking id or security token.' }, { status: 400 })
  }

  const { bookingId, holdToken, upiTransactionId } = parsed.data
  const payload = await getPayload({ config })

  try {
    const existing = (await payload.findByID({
      collection: 'bookings',
      id: bookingId as string,
      overrideAccess: true,
      depth: 0,
    })) as Record<string, any> | null

    if (!existing) {
      return NextResponse.json({ error: 'That booking could not be found.' }, { status: 404 })
    }

    // The token is a purpose-built random secret (not the customer's email, and
    // never returned by any read endpoint), compared in constant time.
    if (!holdTokenMatches(existing.holdToken, holdToken)) {
      return NextResponse.json({ error: 'This booking session is no longer valid.' }, { status: 403 })
    }

    if (existing.status === 'confirmed') {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        bookingId: existing.id,
        reference: bookingReference(existing.id),
        totalPrice: existing.totalPrice,
        status: existing.status,
        paymentStatus: existing.paymentStatus ?? AWAITING_VERIFICATION,
      })
    }

    if (existing.status !== 'pending') {
      return NextResponse.json({ error: 'This booking can no longer be confirmed.' }, { status: 409 })
    }

    if (isHoldExpired(existing.holdExpiresAt, existing.status)) {
      return NextResponse.json(
        { error: 'Your 10 minute reservation expired. Please start the checkout again.' },
        { status: 410 },
      )
    }

    const updated = (await payload.update({
      collection: 'bookings',
      id: existing.id,
      data: {
        status: 'confirmed',
        // Confirming reserves the car; it does NOT assert that money arrived.
        // The UPI reference below is typed by the customer and nothing verifies
        // it, so the booking starts life awaiting a human check. See
        // lib/payments.ts for why 'paid' does not exist as a state.
        paymentStatus: existing.paymentStatus ?? AWAITING_VERIFICATION,
        ...(upiTransactionId ? { upiTransactionId } : {}),
      },
      overrideAccess: true,
      depth: 0,
    })) as Record<string, any>

    const reference = bookingReference(updated.id)

    // A confirmed booking is money — claim the coupon only after this point.
    // The claim is atomic, so two people confirming at once cannot both use the
    // last redemption of a limited code.
    if (existing.couponCode) {
      const coupon = await validateCoupon(payload, {
        code: existing.couponCode,
        email: existing.customerEmail,
        subtotal: Number(existing.totalPrice) || 0,
      })

      const redeemed = coupon.couponId ? await redeemCoupon(payload, coupon.couponId) : false

      if (!redeemed) {
        console.warn(
          `[checkout/confirm] coupon ${existing.couponCode} was not counted for ${reference}`,
        )
        await sendTelegramAlert(
          couponAlertText({
            reference,
            couponCode: existing.couponCode,
            discount: Number(existing.discountApplied) || 0,
            reason: coupon.valid
              ? 'the redemption limit was reached between checkout and confirmation'
              : coupon.message,
          }),
        )
      }
    }

    // Leverage Next.js after() to dispatch notifications and revalidate cache
    // asynchronously without holding up the customer's checkout response.
    after(async () => {
      try {
        await sendConfirmationEmail(payload, updated)
      } catch (emailErr) {
        console.error('[checkout/confirm] background email error:', emailErr)
      }

      try {
        await sendWhatsAppConfirmation(updated)
      } catch (error) {
        console.error('[checkout/confirm] background WhatsApp error:', error)
      }

      try {
        await sendTelegramAlert(
          bookingAlertText({
            reference,
            carName: updated.carName,
            serviceType: updated.serviceType,
            pickupLocation: updated.pickupLocation,
            startDate: updated.startDate ? new Date(updated.startDate).toLocaleString('en-IN') : null,
            endDate: updated.endDate ? new Date(updated.endDate).toLocaleString('en-IN') : null,
            totalPrice: updated.totalPrice,
            customerName: updated.customerName,
            customerPhone: updated.customerPhone,
            customerEmail: updated.customerEmail,
            paymentReference: updated.upiTransactionId ?? upiTransactionId ?? null,
          }),
        )
      } catch (tgErr) {
        console.error('[checkout/confirm] background Telegram error:', tgErr)
      }

      try {
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/bookings')
      } catch (revalErr) {
        console.warn('[checkout/confirm] revalidatePath warning:', revalErr)
      }
    })

    return NextResponse.json({
      success: true,
      bookingId: updated.id,
      reference,
      totalPrice: updated.totalPrice,
      status: updated.status,
      paymentStatus: updated.paymentStatus ?? AWAITING_VERIFICATION,
    })
  } catch (error) {
    console.error('[checkout/confirm] failed:', error)
    return NextResponse.json(
      { error: 'We could not confirm your payment. Please contact the concierge.' },
      { status: 500 },
    )
  }
}

async function sendConfirmationEmail(payload: Awaited<ReturnType<typeof getPayload>>, booking: Record<string, any>) {
  let pdfBuffer: Buffer | undefined

  try {
    pdfBuffer = await generateInvoicePDFBuffer(booking)
  } catch (error) {
    console.error('[checkout/confirm] invoice PDF failed:', error)
  }

  const reference = bookingReference(booking.id)
  const invoiceUrl = `${serverUrl()}/dashboard/invoices/${booking.id}`

  // 1. Attempt Brevo delivery first (luxury branded HTML template + attached PDF invoice)
  try {
    const sentViaBrevo = await sendBookingConfirmedNotification(booking, pdfBuffer)
    if (sentViaBrevo) {
      payload.logger.info(`[checkout/confirm] Sent booking confirmed email via Brevo to ${booking.customerEmail}`)
      return
    }
  } catch (brevoError) {
    console.warn('[checkout/confirm] Brevo attempt failed, falling back to payload.sendEmail:', brevoError)
  }

  // 2. Fallback to Payload sendEmail (Resend/local)
  const paymentNotice = paymentNeedsReview(booking)
    ? `<p style="padding:12px 16px;background:#fff8e1;border-left:3px solid #d4af37;">
         <strong>Payment under review.</strong> We have your UPI reference
         (<code>${escapeHtml(booking.upiTransactionId || 'not provided')}</code>) and will verify it against
         our account within one business day. Your reservation is held meanwhile.
       </p>`
    : `<p><strong>Payment:</strong> verified — thank you.</p>`

  try {
    await payload.sendEmail({
      to: booking.customerEmail,
      subject: `Booking Confirmed — ${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #d4af37;">Booking Confirmed!</h2>
          <p>Dear ${escapeHtml(booking.customerName)},</p>
          <p>Your luxury reservation for the <strong>${escapeHtml(booking.carName)}</strong> is fully confirmed.</p>
          <p><strong>Reference:</strong> ${escapeHtml(reference)}</p>
          <p><strong>Dates:</strong> ${escapeHtml(
            booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—',
          )} – ${escapeHtml(
            booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : '—',
          )}</p>
          <p><strong>Pickup:</strong> ${escapeHtml(booking.pickupLocation || '—')}</p>
          <p><strong>Total:</strong> ₹${Number(booking.totalPrice || 0).toLocaleString('en-IN')}</p>
          ${paymentNotice}
          <p><a href="${escapeHtml(invoiceUrl)}" style="color:#b48811;">View your invoice online</a></p>
          <p>Please find your official invoice attached to this email.</p>
          <p>Warm regards,<br><strong>DriveIt Concierge Team</strong></p>
        </div>
      `,
      attachments: pdfBuffer
        ? [
            {
              filename: `Invoice-${reference}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ]
        : undefined,
    })
  } catch (error) {
    console.error('[checkout/confirm] confirmation email failed:', error)
  }
}
