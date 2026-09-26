import type { Payload, PayloadRequest } from 'payload'
import { sendAccountWelcomeNotification } from '@/lib/brevo'

/**
 * A request to run the query inside, when called from a hook or route handler.
 *
 * Passing it matters on Postgres: without it Payload opens a *new* transaction on
 * another pooled connection, so the write lands outside the caller's transaction
 * (and can block on locks the caller holds). See lib/loyalty.ts.
 */
type RequestContext = Partial<PayloadRequest>

export type CustomerProfileInput = {
  email: string
  name?: string | null
  phone?: string | null
}

export type CustomerProfilePatch = {
  name?: string | null
  phone?: string | null
  homeAddress?: string | null
  officeAddress?: string | null
  airportAddress?: string | null
  gstin?: string | null
  companyName?: string | null
  drivingLicenseNumber?: string | null
  aadhaarLast4?: string | null
}

const normaliseEmail = (email: string) => email.trim().toLowerCase()

export async function findCustomerByEmail(payload: Payload, email: string, req?: RequestContext) {
  const { docs } = await payload.find({
    collection: 'customers',
    where: { email: { equals: normaliseEmail(email) } },
    limit: 1,
    overrideAccess: true,
    ...(req ? { req } : {}),
  })
  return docs[0] ?? null
}

/**
 * Creates the customer record if it does not exist yet and backfills any detail
 * that is still missing. Never overwrites values the customer edited themselves.
 */
export async function upsertCustomer(
  payload: Payload,
  input: CustomerProfileInput,
  req?: RequestContext,
) {
  if (!input.email) return null

  const email = normaliseEmail(input.email)
  const existing = await findCustomerByEmail(payload, email, req)

  if (!existing) {
    const created = await payload.create({
      collection: 'customers',
      data: {
        email,
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      },
      overrideAccess: true,
      ...(req ? { req } : {}),
    })

    // Dispatch welcome notification asynchronously via Brevo
    sendAccountWelcomeNotification(input.name || 'Valued Member', email).catch((err) =>
      payload.logger.error(`[brevo] Welcome email dispatch failed for ${email}: ${err}`),
    )

    return created
  }

  const patch: Record<string, unknown> = {}
  if (input.name && !existing.name) patch.name = input.name
  if (input.phone && !existing.phone) patch.phone = input.phone
  if (Object.keys(patch).length === 0) return existing

  return payload.update({
    collection: 'customers',
    id: existing.id,
    data: patch,
    overrideAccess: true,
    ...(req ? { req } : {}),
  })
}

/** Full profile update coming from the customer's own dashboard. */
export async function updateCustomerProfile(
  payload: Payload,
  email: string,
  patch: CustomerProfilePatch,
) {
  const existing = await findCustomerByEmail(payload, email)

  if (!existing) {
    return payload.create({
      collection: 'customers',
      data: { email: normaliseEmail(email), ...patch },
      overrideAccess: true,
    })
  }

  return payload.update({
    collection: 'customers',
    id: existing.id,
    data: patch,
    overrideAccess: true,
  })
}

export interface KycValidationResult {
  complete: boolean
  reasons: string[]
  isProfileMissing: boolean
  isKycMissing: boolean
  isRejected: boolean
}

/**
 * Validates whether the customer has completed their personal profile and KYC verification.
 * Booking is restricted if profile details or KYC documents are missing or rejected.
 */
export function isProfileAndKycComplete(
  customer: Record<string, any> | null | undefined,
): KycValidationResult {
  if (!customer) {
    return {
      complete: false,
      reasons: ['Customer account not found. Please sign in with your customer account.'],
      isProfileMissing: true,
      isKycMissing: true,
      isRejected: false,
    }
  }

  const reasons: string[] = []
  let isProfileMissing = false
  let isKycMissing = false
  let isRejected = false

  const name = typeof customer.name === 'string' ? customer.name.trim() : ''
  if (!name || name.length < 2) {
    reasons.push('Full name is required in your profile.')
    isProfileMissing = true
  }

  const phoneDigits = typeof customer.phone === 'string' ? customer.phone.replace(/\D/g, '') : ''
  if (!phoneDigits || phoneDigits.length < 10) {
    reasons.push('A valid 10-digit mobile phone number is required.')
    isProfileMissing = true
  }

  const dlNumber =
    typeof customer.drivingLicenseNumber === 'string'
      ? customer.drivingLicenseNumber.trim()
      : ''
  if (!dlNumber || dlNumber.length < 5) {
    reasons.push('Driving license number is required.')
    isKycMissing = true
  }

  const kycStatus = (customer.kycStatus as string) || 'unverified'
  if (kycStatus === 'unverified') {
    reasons.push('KYC documents (Driving License front/back) have not been uploaded.')
    isKycMissing = true
  } else if (kycStatus === 'rejected') {
    reasons.push('Your previous KYC submission was rejected. Please re-upload valid documents.')
    isRejected = true
  }

  return {
    complete: reasons.length === 0,
    reasons,
    isProfileMissing,
    isKycMissing,
    isRejected,
  }
}
