import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const ApplySchema = z.object({
  ownerName: z.string().trim().min(2).max(120),
  ownerEmail: z.string().trim().email().max(160),
  ownerPhone: z.string().trim().min(8).max(30),
  city: z.string().trim().min(2).max(100).default('Hyderabad'),
  vehicleName: z.string().trim().min(2).max(150),
  manufacturingYear: z.coerce.number().min(2010).max(2027),
  registrationNumber: z.string().trim().min(4).max(30),
  odometerKm: z.coerce.number().min(0).optional(),
  expectedMonthlyRevenue: z.string().trim().max(100).optional(),
})

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'partner-apply', {
    limit: 10,
    windowMs: 60_000,
    globalLimit: 100,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  try {
    const rawBody = await request.json()
    const parsed = ApplySchema.safeParse(rawBody)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Please check all required vehicle fields.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const created = await payload.create({
      collection: 'partner-applications',
      data: {
        ...parsed.data,
        status: 'pending_inspection',
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Vehicle consignment application received! Our fleet concierge will reach out within 24 hours to schedule an inspection.',
      id: created.id,
    })
  } catch (error) {
    console.error('[partners/apply] error:', error)
    return NextResponse.json({ error: 'Could not submit application. Please try again.' }, { status: 500 })
  }
}
