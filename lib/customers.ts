import type { Payload } from 'payload'

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
}

const normaliseEmail = (email: string) => email.trim().toLowerCase()

export async function findCustomerByEmail(payload: Payload, email: string) {
  const { docs } = await payload.find({
    collection: 'customers',
    where: { email: { equals: normaliseEmail(email) } },
    limit: 1,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

/**
 * Creates the customer record if it does not exist yet and backfills any detail
 * that is still missing. Never overwrites values the customer edited themselves.
 */
export async function upsertCustomer(payload: Payload, input: CustomerProfileInput) {
  if (!input.email) return null

  const email = normaliseEmail(input.email)
  const existing = await findCustomerByEmail(payload, email)

  if (!existing) {
    return payload.create({
      collection: 'customers',
      data: {
        email,
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      },
      overrideAccess: true,
    })
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
