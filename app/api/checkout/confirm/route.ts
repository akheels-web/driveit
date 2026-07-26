import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateInvoicePDFBuffer } from '@/lib/invoice'
import { sendWhatsAppConfirmation } from '@/lib/whatsapp'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    // Update the booking status to confirmed
    const updatedBooking = await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: {
        status: 'confirmed',
      },
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
            <p><strong>Dates:</strong> ${new Date(updatedBooking.startDate).toLocaleDateString()} - ${new Date(updatedBooking.endDate).toLocaleDateString()}</p>
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
