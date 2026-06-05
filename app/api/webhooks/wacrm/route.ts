import { NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * WaCRM Webhook Bridge
 *
 * This endpoint receives booking events and forwards them to your
 * WaCRM instance to create contacts and start conversations.
 *
 * Configure WACRM_WEBHOOK_URL and WACRM_WEBHOOK_SECRET in .env.local
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, data } = body

    if (!event || !data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const wacrmUrl = process.env.WACRM_WEBHOOK_URL
    const wacrmSecret = process.env.WACRM_WEBHOOK_SECRET

    if (!wacrmUrl) {
      console.warn('WaCRM webhook URL not configured')
      return NextResponse.json({ message: 'WaCRM not configured, skipping' }, { status: 200 })
    }

    // Build WaCRM-compatible payload
    const wacrmPayload = {
      event_type: 'contact.created',
      contact: {
        phone: data.customer_phone?.replace(/[^0-9]/g, ''),
        name: data.customer_name,
        email: data.customer_email || null,
        tags: ['driveit-booking', data.booking_ref],
        custom_fields: {
          booking_ref: data.booking_ref,
          car_name: data.car_name,
          pickup_location: data.pickup_location,
          booking_date: data.booking_date,
          booking_time: data.booking_time,
          total_amount: data.total_amount,
          source: 'driveit-website',
        },
      },
      // Initial message to send
      message: {
        type: 'text',
        text: `🚗 Booking Confirmed!\n\nRef: ${data.booking_ref}\nCar: ${data.car_name}\nDate: ${data.booking_date} at ${data.booking_time}\nPickup: ${data.pickup_location}\nAmount: ₹${data.total_amount?.toLocaleString('en-IN')}\n\nThank you for choosing DRIVEIT! We'll confirm your booking shortly.`,
      },
    }

    // Generate HMAC signature for security
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (wacrmSecret) {
      const signature = crypto
        .createHmac('sha256', wacrmSecret)
        .update(JSON.stringify(wacrmPayload))
        .digest('hex')
      headers['X-Webhook-Signature'] = signature
    }

    const response = await fetch(wacrmUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(wacrmPayload),
    })

    if (!response.ok) {
      console.error('WaCRM webhook failed:', response.status, await response.text())
      return NextResponse.json({ error: 'WaCRM webhook failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: 'Forwarded to WaCRM' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
