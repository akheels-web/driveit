import type { Payload, PayloadRequest } from 'payload'

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
    return payload.create({
      collection: 'customers',
      data: {
        email,
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      },
      overrideAccess: true,
      ...(req ? { req } : {}),
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
