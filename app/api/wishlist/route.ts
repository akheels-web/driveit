import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { carId } = await request.json()
    if (!carId) return NextResponse.json({ error: 'Car ID is required' }, { status: 400 })

    const payload = await getPayload({ config: configPromise })
    const { docs: existing } = await payload.find({
      collection: 'wishlists',
      where: {
        and: [
          { userEmail: { equals: session.user.email } },
          { carSlug: { equals: carId } },
        ],
      },
    })

    if (existing && existing.length > 0) {
      await payload.delete({
        collection: 'wishlists',
        id: existing[0].id,
      })
      return NextResponse.json({ status: 'removed' })
    } else {
      await payload.create({
        collection: 'wishlists',
        data: {
          userEmail: session.user.email,
          carSlug: carId,
          carName: carId,
        },
      })
      return NextResponse.json({ status: 'added' })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ wishlists: [] })

    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'wishlists',
      where: {
        userEmail: { equals: session.user.email },
      },
    })

    return NextResponse.json({ wishlists: docs.map((d: any) => d.carSlug) })
  } catch (error: any) {
    return NextResponse.json({ wishlists: [] })
  }
}
