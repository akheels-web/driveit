import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { auth } from '@/auth'
import config from '@/payload.config'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * How many times the signed-in customer has booked a specific car.
 * (Previously this accepted `carId` and then ignored it, returning the count for
 * every car the customer had ever booked.)
 */
export async function GET(request: Request) {
  const verdict = await limitRequest(request, 'bookings-count', {
    limit: 60,
    windowMs: 60_000,
    globalLimit: 3_000,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ count: 0 }, { status: 401 })

  const carId = new URL(request.url).searchParams.get('carId')?.trim()
  if (!carId) return NextResponse.json({ count: 0 })

  try {
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection: 'bookings',
      where: {
        and: [
          { customerEmail: { equals: session.user.email.toLowerCase() } },
          { status: { in: ['confirmed', 'completed'] } },
          {
            or: [{ carSlug: { equals: carId } }, { carName: { equals: carId } }],
          },
        ],
      },
      overrideAccess: true,
    })

    return NextResponse.json({ count: totalDocs || 0 })
  } catch (error) {
    console.error('[bookings/count] failed:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
