import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { auth } from '@/auth'
import config from '@/payload.config'
import { findCustomerByEmail, updateCustomerProfile } from '@/lib/customers'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const PatchSchema = z.object({
  name: z.string().trim().max(160).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  homeAddress: z.string().trim().max(300).optional().nullable(),
  officeAddress: z.string().trim().max(300).optional().nullable(),
  airportAddress: z.string().trim().max(300).optional().nullable(),
  gstin: z.string().trim().max(30).optional().nullable(),
  companyName: z.string().trim().max(160).optional().nullable(),
  drivingLicenseNumber: z.string().trim().max(40).optional().nullable(),
  aadhaarLast4: z.string().trim().max(20).optional().nullable(),
})

const publicProfile = (customer: Record<string, any> | null) =>
  customer
    ? {
        name: customer.name ?? null,
        phone: customer.phone ?? null,
        homeAddress: customer.homeAddress ?? null,
        officeAddress: customer.officeAddress ?? null,
        airportAddress: customer.airportAddress ?? null,
        gstin: customer.gstin ?? null,
        companyName: customer.companyName ?? null,
        kycStatus: customer.kycStatus ?? 'unverified',
        drivingLicenseNumber: customer.drivingLicenseNumber ?? null,
        aadhaarLast4: customer.aadhaarLast4 ?? null,
        loyaltyPoints: customer.loyaltyPoints ?? 0,
        loyaltyTier: customer.loyaltyTier ?? 'silver',
        completedBookings: customer.completedBookings ?? 0,
      }
    : null

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ profile: null }, { status: 401 })

  const payload = await getPayload({ config })
  const customer = await findCustomerByEmail(payload, session.user.email)

  return NextResponse.json({ profile: publicProfile(customer as Record<string, any> | null) })
}

export async function PATCH(request: Request) {
  const verdict = await limitRequest(request, 'profile-update', {
    limit: 20,
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

  const parsed = PatchSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the submitted details.' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  const updated = await updateCustomerProfile(payload, session.user.email, parsed.data)

  return NextResponse.json({ profile: publicProfile(updated as Record<string, any>) })
}
