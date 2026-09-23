import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { auth } from '@/auth'
import config from '@/payload.config'
import { getCarByIdentifier } from '@/lib/cms'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_WISHLIST_ITEMS = 100

const ToggleSchema = z.object({ carId: z.string().trim().min(1).max(200) })

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ wishlists: [] }, { status: 401 })

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'wishlists',
      where: { userEmail: { equals: session.user.email.toLowerCase() } },
      limit: MAX_WISHLIST_ITEMS,
      overrideAccess: true, // session-verified above; the collection itself is staff-only
    })

    return NextResponse.json({
      wishlists: docs.map((doc: any) => ({ carSlug: doc.carSlug, carName: doc.carName ?? null })),
    })
  } catch (error) {
    console.error('[wishlist] read failed:', error)
    return NextResponse.json({ wishlists: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'wishlist-toggle', {
    limit: 60,
    windowMs: 60_000,
    globalLimit: 3_000,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = ToggleSchema.safeParse(rawBody)
  if (!parsed.success) return NextResponse.json({ error: 'Car id is required.' }, { status: 400 })

  const email = session.user.email.toLowerCase()
  const car = await getCarByIdentifier(parsed.data.carId)
  const carSlug = car?.slug ?? parsed.data.carId

  try {
    const payload = await getPayload({ config })
    const { docs: existing } = await payload.find({
      collection: 'wishlists',
      where: { and: [{ userEmail: { equals: email } }, { carSlug: { equals: carSlug } }] },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.length > 0) {
      await payload.delete({
        collection: 'wishlists',
        id: existing[0].id,
        overrideAccess: true,
      })
      return NextResponse.json({ status: 'removed', carSlug })
    }

    await payload.create({
      collection: 'wishlists',
      data: { userEmail: email, carSlug, carName: car?.name ?? carSlug },
      overrideAccess: true,
    })

    return NextResponse.json({ status: 'added', carSlug })
  } catch (error) {
    console.error('[wishlist] toggle failed:', error)
    return NextResponse.json({ error: 'Could not update your saved cars.' }, { status: 500 })
  }
}
