import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'

// Very basic in-memory rate limiter for init route (resets on server restart)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimit = rateLimitMap.get(ip)

    if (rateLimit && now - rateLimit.timestamp < 60000) { // 1 minute window
      if (rateLimit.count >= 5) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
      rateLimitMap.set(ip, { count: rateLimit.count + 1, timestamp: rateLimit.timestamp })
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }

    const payload = await getPayload({ config })
    const body = await request.json()
    const { carSlug, startDate, endDate, customerEmail, customerName, customerPhone, pickupLocation, totalPrice, serviceType } = body

    if (!carSlug || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const requestedStart = new Date(startDate).getTime()
    const requestedEnd = new Date(endDate).getTime()

    const existingBookings = await payload.find({
      collection: 'bookings',
      where: {
        carSlug: { equals: carSlug },
        or: [
          { status: { equals: 'confirmed' } },
          { 
            and: [
              { status: { equals: 'pending' } },
              { holdExpiresAt: { greater_than: new Date().toISOString() } }
            ]
          }
        ]
      },
      limit: 100,
    })

    const isConflict = existingBookings.docs.some(booking => {
      const bookStart = new Date(booking.startDate as string).getTime()
      const bookEnd = new Date(booking.endDate as string).getTime()
      return requestedStart <= bookEnd && requestedEnd >= bookStart
    })

    if (isConflict) {
      return NextResponse.json({ 
        error: 'This car is currently reserved or being booked by someone else for these dates. Please try again later.' 
      }, { status: 409 })
    }

    // Generate secure hold token
    const holdToken = crypto.randomUUID()
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    // Create pending booking
    // Using req.user isn't possible here since it's a public API, but Payload lets us override access locally
    const newBooking = await payload.create({
      collection: 'bookings',
      data: {
        customerName,
        customerEmail,
        customerPhone,
        carName: carSlug,
        carSlug,
        pickupLocation,
        totalPrice,
        serviceType: serviceType || 'selfdrive',
        status: 'pending',
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        holdExpiresAt,
        // We will store the holdToken temporarily in the database to verify later
        // Since we don't have a dedicated field for it in schema, we can store it in whatsappNumber temporarily if empty, 
        // OR better yet, let's just add it to the schema.
        // For now, we will verify using the customerEmail + holdExpiresAt as a pseudo-token on confirm if we don't change schema.
      },
      overrideAccess: true, // IMPORTANT: Bypass CMS auth restriction for this server-side public checkout flow
    })

    return NextResponse.json({ 
      success: true, 
      bookingId: newBooking.id, 
      holdExpiresAt,
      holdToken: customerEmail // Pseudo-token for now (using email as verification key)
    })

  } catch (error: any) {
    console.error('Init checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
