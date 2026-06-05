'use server'

import { createClient } from '@/lib/supabase/server'
import type { BookingFormData } from '@/lib/types'

function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'DRV-'
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

export async function createBooking(data: BookingFormData) {
  const supabase = await createClient()

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const bookingRef = generateBookingRef()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_ref: bookingRef,
      user_id: user?.id || null,
      car_id: data.carId || null,
      car_name: data.carName,
      service_type: data.serviceType,
      pickup_location: data.pickupLocation,
      dropoff_location: data.dropoffLocation || null,
      booking_date: data.bookingDate,
      booking_time: data.bookingTime,
      duration_days: data.durationDays,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || null,
      notes: data.notes || null,
      total_amount: data.totalAmount,
      payment_method: data.paymentMethod || null,
      payment_status: data.paymentMethod === 'upi' ? 'pending' : 'unpaid',
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Booking error:', error)
    return { success: false, error: error.message }
  }

  // Send Telegram notification
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
📊 *Status:* Pending`

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

  // Send WaCRM webhook
  try {
    const wacrmUrl = process.env.WACRM_WEBHOOK_URL
    const wacrmSecret = process.env.WACRM_WEBHOOK_SECRET

    if (wacrmUrl) {
      await fetch(wacrmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(wacrmSecret ? { 'X-Webhook-Secret': wacrmSecret } : {}),
        },
        body: JSON.stringify({
          event: 'booking.created',
          data: {
            booking_ref: bookingRef,
            car_name: data.carName,
            service_type: data.serviceType,
            customer_name: data.customerName,
            customer_phone: data.customerPhone,
            customer_email: data.customerEmail,
            pickup_location: data.pickupLocation,
            booking_date: data.bookingDate,
            booking_time: data.bookingTime,
            total_amount: data.totalAmount,
          },
        }),
      })
    }
  } catch (e) {
    console.error('WaCRM webhook failed:', e)
  }

  return { success: true, bookingRef, bookingId: booking.id }
}

export async function getUserBookings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { bookings: [], error: 'Not authenticated' }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { bookings: [], error: error.message }
  return { bookings: bookings || [], error: null }
}

export async function updatePaymentStatus(bookingId: string, upiTransactionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'pending',
      upi_transaction_id: upiTransactionId,
    })
    .eq('id', bookingId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
