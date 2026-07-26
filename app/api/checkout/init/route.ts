import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { carSlug, startDate, endDate, customerEmail, customerName, customerPhone, pickupLocation, totalPrice, serviceType } = body

    if (!carSlug || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const requestedStart = new Date(startDate).getTime()
    const requestedEnd = new Date(endDate).getTime()

    // Check for existing holds or confirmed bookings for this car
    // A car is unavailable if there's a Confirmed booking OR a Pending booking whose hold hasn't expired
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

    // Check for date overlaps
    const isConflict = existingBookings.docs.some(booking => {
      const bookStart = new Date(booking.startDate).getTime()
      const bookEnd = new Date(booking.endDate).getTime()
      // Overlap logic: Start of new is before end of existing AND end of new is after start of existing
      return requestedStart <= bookEnd && requestedEnd >= bookStart
    })

    if (isConflict) {
      return NextResponse.json({ 
        error: 'This car is currently reserved or being booked by someone else for these dates. Please try again later or choose different dates.' 
      }, { status: 409 })
    }

    // No conflict, create a Pending hold for 10 minutes
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    const newBooking = await payload.create({
      collection: 'bookings',
      data: {
        customerName,
        customerEmail,
        customerPhone,
        carName: carSlug, // Could look up actual name, but slug works for logic
        carSlug,
        pickupLocation,
        totalPrice,
        serviceType: serviceType || 'selfdrive',
        status: 'pending',
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        holdExpiresAt,
      },
    })

    return NextResponse.json({ 
      success: true, 
      bookingId: newBooking.id, 
      holdExpiresAt 
    })

  } catch (error: any) {
    console.error('Init checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
