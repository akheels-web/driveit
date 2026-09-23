import { NextResponse } from 'next/server'
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
import { bookingAlertText, sendTelegramAlert } from '@/lib/telegram'

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
      return NextResponse.json({ success: true, alreadyConfirmed: true, bookingId: existing.id })
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
        ...(upiTransactionId ? { upiTransactionId } : {}),
      },
      overrideAccess: true,
      depth: 0,
    })) as Record<string, any>

    // A confirmed booking is money — claim the coupon only after this point.
    if (existing.couponCode) {
      const coupon = await validateCoupon(payload, {
        code: existing.couponCode,
        email: existing.customerEmail,
        subtotal: Number(existing.totalPrice) || 0,
      })
      if (coupon.couponId) await redeemCoupon(payload, coupon.couponId)
    }

    await sendConfirmationEmail(payload, updated)
    await sendWhatsAppConfirmation(updated).catch((error) =>
      console.error('[checkout/confirm] WhatsApp failed:', error?.message ?? error),
    )

    await sendTelegramAlert(
      bookingAlertText({
        reference: `DRV-${String(updated.id).padStart(5, '0')}`,
        carName: updated.carName,
        serviceType: updated.serviceType,
        pickupLocation: updated.pickupLocation,
        startDate: updated.startDate ? new Date(updated.startDate).toLocaleString('en-IN') : null,
        endDate: updated.endDate ? new Date(updated.endDate).toLocaleString('en-IN') : null,
        totalPrice: updated.totalPrice,
        customerName: updated.customerName,
        customerPhone: updated.customerPhone,
        customerEmail: updated.customerEmail,
      }),
    )

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/bookings')

    return NextResponse.json({
      success: true,
      bookingId: updated.id,
      reference: `DRV-${String(updated.id).padStart(5, '0')}`,
      totalPrice: updated.totalPrice,
      status: updated.status,
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

  const reference = `DRV-${String(booking.id).padStart(5, '0')}`
  const invoiceUrl = `${serverUrl()}/dashboard/invoices/${booking.id}`

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
