import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateInvoicePDFBuffer } from '@/lib/invoice'
import { sendWhatsAppConfirmation } from '@/lib/whatsapp'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { bookingId, holdToken } = body

    if (!bookingId || !holdToken) {
      return NextResponse.json({ error: 'Missing booking ID or security token' }, { status: 400 })
    }

    // 1. Fetch the booking first to verify IDOR protection
    const existingBooking = await payload.findByID({
      collection: 'bookings',
      id: bookingId,
    })

    if (!existingBooking || existingBooking.status !== 'pending') {
      return NextResponse.json({ error: 'Invalid booking or booking has expired.' }, { status: 400 })
    }

    // 2. IDOR check: Verify the holdToken matches the customerEmail (our pseudo-token)
    if (existingBooking.customerEmail !== holdToken) {
      return NextResponse.json({ error: 'Unauthorized booking confirmation attempt.' }, { status: 403 })
    }

    // Update the booking status to confirmed
    const updatedBooking = await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: {
        status: 'confirmed',
      },
      overrideAccess: true, // Bypass CMS auth
    })

    // Generate Invoice PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoicePDFBuffer(updatedBooking)
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      // Continue even if PDF fails
    }

    // Send Confirmation Email
    try {
      await payload.sendEmail({
        to: updatedBooking.customerEmail,
        subject: 'DriveIt Luxury Concierge - Booking Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #d4af37;">Booking Confirmed!</h2>
            <p>Dear ${updatedBooking.customerName},</p>
            <p>Your luxury reservation for the <strong>${updatedBooking.carName}</strong> is fully confirmed.</p>
            <p><strong>Dates:</strong> ${new Date(updatedBooking.startDate as string).toLocaleDateString()} - ${new Date(updatedBooking.endDate as string).toLocaleDateString()}</p>
            <p><strong>Pickup:</strong> ${updatedBooking.pickupLocation}</p>
            <p>Please find your official invoice attached to this email.</p>
            <p>Warm regards,<br><strong>DriveIt Concierge Team</strong></p>
          </div>
        `,
        attachments: pdfBuffer ? [
          {
            filename: `Invoice-${updatedBooking.id.substring(0, 8).toUpperCase()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          }
        ] : undefined
      })
    } catch (err) {
      console.error('Failed to send confirmation email:', err)
    }

    // Send WhatsApp Message
    try {
      await sendWhatsAppConfirmation(updatedBooking)
    } catch (err) {
      console.error('Failed to send WhatsApp:', err)
    }

    return NextResponse.json({ success: true, booking: updatedBooking })

  } catch (error: any) {
    console.error('Confirm checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
