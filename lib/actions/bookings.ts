'use server'

import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { BookingFormData } from '@/lib/types'
import { NotificationService } from '@/lib/services/notifications'

function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'DRV-'
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

export async function createBooking(data: BookingFormData) {
  const session = await auth()
  const bookingRef = generateBookingRef()

  try {
    const payload = await getPayload({ config: configPromise })
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail || session?.user?.email || 'guest@driveitluxury.com',
        customerPhone: data.customerPhone,
        carName: data.carName,
        carSlug: data.carId,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        totalPrice: data.totalAmount,
        serviceType: (data.serviceType as any) || 'chauffeur',
        status: 'confirmed',
      },
    })

    // Send Telegram notification if configured
    try {
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN
      const telegramChatId = process.env.TELEGRAM_CHAT_ID

      if (telegramToken && telegramChatId) {
        const message = `🚗 *New DRIVEIT Booking!*

📋 *Ref:* ${bookingRef}
🚘 *Car:* ${data.carName}
🛠 *Service:* ${data.serviceType === 'chauffeur' ? 'With Driver' : data.serviceType === 'selfdrive' ? 'Self Drive' : 'Airport Transfer'}
📍 *Pickup:* ${data.pickupLocation}
📅 *Date:* ${data.bookingDate} at ${data.bookingTime}
⏱ *Duration:* ${data.durationDays} day(s)
💰 *Amount:* ₹${data.totalAmount.toLocaleString('en-IN')}

👤 *Customer:*
• Name: ${data.customerName}
• Phone: ${data.customerPhone}
${data.customerEmail ? `• Email: ${data.customerEmail}` : ''}
${data.notes ? `• Notes: ${data.notes}` : ''}

💳 *Payment:* ${data.paymentMethod === 'upi' ? 'UPI (Pending)' : 'Pay at Pickup'}
📊 *Status:* Confirmed`

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        })
      }
    } catch (e) {
      console.error('Telegram notification failed:', e)
    }

    // Dispatch Unified Notifications (Email, SMS, WhatsApp Ticket)
    NotificationService.sendBookingConfirmation(bookingRef, data)

    return { success: true, bookingRef, bookingId: booking.id.toString() }
  } catch (error: any) {
    console.error('Booking save error:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserBookings() {
  const session = await auth()
  if (!session?.user?.email) return { bookings: [], error: 'Not authenticated' }

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'bookings',
      where: {
        customerEmail: { equals: session.user.email },
      },
    })

    return { bookings: docs || [], error: null }
  } catch (error: any) {
    return { bookings: [], error: error.message }
  }
}

export async function updatePaymentStatus(bookingId: string, upiTransactionId: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: {
        status: 'confirmed',
      },
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
