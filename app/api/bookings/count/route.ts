import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ count: 0 })

    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('carId')
    if (!carId) return NextResponse.json({ count: 0 })

    const payload = await getPayload({ config: configPromise })
    const { totalDocs } = await payload.find({
      collection: 'bookings',
      where: {
        customerEmail: {
          equals: session.user.email,
        },
      },
    })

    return NextResponse.json({ count: totalDocs || 0 })
  } catch (error: any) {
    return NextResponse.json({ count: 0 })
  }
}
