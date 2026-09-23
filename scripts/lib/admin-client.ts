/**
 * Tiny Payload REST client shared by the seed and the data migration scripts.
 *
 * Two reasons these scripts talk HTTP instead of using Payload's local API:
 *  1. They run on whatever Node the machine has, with no TypeScript/tsx loader
 *     gymnastics around `payload.config.ts`.
 *  2. They exercise the real access-control layer — if a script can write, so
 *     can a signed-in admin.
 */
import { randomBytes } from 'node:crypto'

export const BASE = (
  process.env.SEED_BASE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3000'
)
  .trim()
  .replace(/\/+$/, '')

export const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || 'admin@driveitluxury.com').toLowerCase()
export const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; body: any }

export async function api<T = any>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<ApiResult<T>> {
  const { token, headers, ...rest } = init

  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...(headers as Record<string, string> | undefined),
    },
  })

  const text = await response.text()
  const body = text ? safeJson(text) : null

  if (!response.ok) return { ok: false, status: response.status, body }
  return { ok: true, data: body as T }
}

export function safeJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Human-readable message from a Payload error payload. */
export function errorMessage(body: any, fallback = 'unknown error'): string {
  if (Array.isArray(body?.errors)) {
    return body.errors.map((entry: any) => entry?.message ?? JSON.stringify(entry)).join('; ')
  }
  return body?.error || body?.message || JSON.stringify(body) || fallback
}

export function randomPassword(): string {
  // No lookalike/ambiguous characters — this gets typed or pasted exactly once.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let out = ''
  for (const byte of randomBytes(20)) out += alphabet[byte % alphabet.length]
  return `${out}-${Date.now().toString(36).slice(-4)}`
}

/** Confirms the instance is reachable before the script does anything else. */
export async function assertReachable() {
  const probe = await api('/api/fleet')
  if (!probe.ok) {
    throw new Error(
      `Cannot reach ${BASE} (HTTP ${probe.status}).\n` +
        `Start the app first (npm run dev, or npm start after a build), or point SEED_BASE_URL at it.`,
    )
  }
}

/**
 * Returns a staff JWT: registers the very first admin on a fresh install, or
 * logs in with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 */
export async function authenticate(): Promise<{ token: string; password?: string }> {
  await assertReachable()

  const password = ADMIN_PASSWORD || randomPassword()

  const registered = await api<{ token?: string }>('/api/users/first-register', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password, name: 'DriveIt Admin', role: 'admin' }),
  })
  if (registered.ok && registered.data?.token) {
    return { token: registered.data.token, password: ADMIN_PASSWORD ? undefined : password }
  }

  const login = await api<{ token?: string }>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password }),
  })
  if (login.ok && login.data?.token) return { token: login.data.token }

  throw new Error(
    `Could not authenticate as ${ADMIN_EMAIL}.\n` +
      `Set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD to an existing admin account ` +
      `(or create the first user in /admin on a fresh install), then re-run.`,
  )
}

/** Every document in a collection, following pagination. */
export async function fetchAll<T = any>(
  collection: string,
  token: string,
  { depth = 0, limit = 100 } = {},
): Promise<T[]> {
  const docs: T[] = []
  let page = 1

  for (;;) {
    const result = await api<{ docs: T[]; totalPages?: number }>(
      `/api/${collection}?limit=${limit}&page=${page}&depth=${depth}`,
      { token },
    )

    if (!result.ok) {
      throw new Error(`Exporting ${collection} failed (HTTP ${result.status}): ${errorMessage(result.body)}`)
    }

    docs.push(...(result.data.docs ?? []))

    const totalPages = result.data.totalPages ?? 1
    if (page >= totalPages) break
    page += 1
  }

  return docs
}

export async function fetchGlobal<T = any>(slug: string, token: string): Promise<T> {
  const result = await api<T>(`/api/globals/${slug}?depth=0`, { token })
  if (!result.ok) {
    throw new Error(`Exporting global ${slug} failed (HTTP ${result.status}): ${errorMessage(result.body)}`)
  }
  return result.data
}

/** Escape a single value for use inside a Payload `where` query string. */
function encode(value: unknown): string {
  return encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value))
}

/** Builds `where[and][…]` clauses for an exact-match lookup. */
export function whereQuery(matches: Record<string, unknown>): string {
  const entries = Object.entries(matches).filter(([, value]) => value !== undefined && value !== null)
  if (entries.length === 0) return ''

  const clauses = entries
    .map(([field, value], index) => `where[and][${index}][${field}][equals]=${encode(value)}`)
    .join('&')

  return `&${clauses}`
}

/** Returns the first document matching an exact-match query, or null. */
export async function findFirst<T = any>(
  collection: string,
  matches: Record<string, unknown>,
  token: string,
): Promise<T | null> {
  const result = await api<{ docs: T[] }>(
    `/api/${collection}?limit=1&depth=0${whereQuery(matches)}`,
    { token },
  )
  if (!result.ok) {
    throw new Error(`Lookup failed for ${collection}: HTTP ${result.status}`)
  }
  return result.data?.docs?.[0] ?? null
}

/** True when a document matching the given fields already exists. */
export async function documentExists(
  collection: string,
  matches: Record<string, unknown>,
  token: string,
): Promise<boolean> {
  return (await findFirst(collection, matches, token)) !== null
}

/** Creates a document and returns the stored doc (so callers can verify the id). */
export async function createDocument<T = any>(
  collection: string,
  data: Record<string, unknown>,
  token: string,
): Promise<T> {
  const result = await api<{ doc: T }>(`/api/${collection}`, {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
  if (!result.ok) {
    throw new Error(`Creating ${collection} failed (HTTP ${result.status}): ${errorMessage(result.body)}`)
  }
  return (result.data?.doc ?? result.data) as T
}

export async function updateDocument(
  collection: string,
  id: string | number,
  data: Record<string, unknown>,
  token: string,
): Promise<void> {
  const result = await api(`/api/${collection}/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  })
  if (!result.ok) {
    throw new Error(`Updating ${collection}/${id} failed (HTTP ${result.status}): ${errorMessage(result.body)}`)
  }
}

export const log = (...args: unknown[]) => console.log('[driveit]', ...args)
