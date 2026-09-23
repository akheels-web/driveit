/**
 * Rate limiting with a pluggable store.
 *
 * Drivers:
 *  • `redis`  — used automatically when `REDIS_URL` is set. Required for any
 *               deployment with more than one app instance (Docker replicas,
 *               PM2 cluster, serverless), because in-process counters are
 *               per-instance and each instance would allow the full quota.
 *  • `memory` — per-process fallback for local development and for staying
 *               available when Redis is briefly unreachable.
 *
 * The Redis driver runs the increment and the TTL set in a single Lua script, so
 * the counter and its expiry can never drift apart (a plain INCR + EXPIRE can
 * strand a key with no TTL and lock a user out forever).
 *
 * Availability: if Redis errors, the request falls back to the in-process
 * limiter and logs loudly. For abuse protection, staying up while throttling
 * imperfectly beats failing every checkout.
 */

type Hit = { count: number; resetAt: number }

export type RateLimitVerdict =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number; remaining: 0 }

const MAX_TRACKED_KEYS = 10_000

const memoryBuckets = new Map<string, Hit>()

let warnedAboutMemory = false

/** Which store the current process is using. Useful in health checks and logs. */
export function rateLimitDriver(): 'redis' | 'memory' {
  return process.env.REDIS_URL?.trim() ? 'redis' : 'memory'
}

function memoryHit(key: string, windowMs: number): Hit {
  const now = Date.now()

  if (memoryBuckets.size > MAX_TRACKED_KEYS) {
    // Opportunistic sweep of expired buckets, then a hard reset if still huge.
    for (const [bucketKey, bucket] of memoryBuckets) {
      if (bucket.resetAt <= now) memoryBuckets.delete(bucketKey)
    }
    if (memoryBuckets.size > MAX_TRACKED_KEYS) memoryBuckets.clear()
  }

  const existing = memoryBuckets.get(key)

  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs }
    memoryBuckets.set(key, fresh)
    return fresh
  }

  existing.count += 1
  return existing
}

type RedisLike = {
  eval: (script: string, numKeys: number, ...args: (string | number)[]) => Promise<unknown>
  on: (event: string, listener: (error: Error) => void) => void
}

let redisClient: Promise<RedisLike> | null = null

/** Lazily creates the shared Redis client (dynamic import keeps it server-only). */
async function getRedis(): Promise<RedisLike> {
  if (!redisClient) {
    redisClient = import('ioredis')
      .then(({ default: Redis }) => {
        const client = new (Redis as any)(process.env.REDIS_URL, {
          // Fail fast instead of queueing commands while Redis is unreachable.
          enableOfflineQueue: false,
          maxRetriesPerRequest: 2,
          connectTimeout: 2_000,
        }) as RedisLike

        client.on('error', (error) => {
          console.error('[rate-limit] redis error:', error.message)
        })

        return client
      })
      .catch((error) => {
        redisClient = null
        throw error
      })
  }

  return redisClient
}

/**
 * INCR + (first-hit only) PEXPIRE + PTTL, atomically.
 * Returns [count, ttlMs].
 */
const HIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('PTTL', KEYS[1])
return { count, ttl }
`

async function redisHit(key: string, windowMs: number): Promise<Hit> {
  const client = await getRedis()
  const raw = (await client.eval(HIT_SCRIPT, 1, key, String(windowMs))) as [number, number]
  const count = Number(raw?.[0]) || 1
  const ttl = Number(raw?.[1])
  const resetAt = ttl > 0 ? Date.now() + ttl : Date.now() + windowMs
  return { count, resetAt }
}

function verdictFrom(hit: Hit, limit: number): RateLimitVerdict {
  const remaining = Math.max(0, limit - hit.count)

  if (hit.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((hit.resetAt - Date.now()) / 1000)),
    }
  }

  return { ok: true, remaining }
}

/** Counts one hit against `key` and reports whether the caller is still within quota. */
export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitVerdict> {
  if (rateLimitDriver() === 'redis') {
    try {
      return verdictFrom(await redisHit(key, windowMs), limit)
    } catch (error) {
      console.error(
        '[rate-limit] redis unavailable, falling back to the in-process limiter:',
        error instanceof Error ? error.message : error,
      )
    }
  } else if (process.env.NODE_ENV === 'production' && !warnedAboutMemory) {
    warnedAboutMemory = true
    console.warn(
      '[rate-limit] REDIS_URL is not set — using per-process counters. ' +
        'With more than one instance every replica allows the full quota; set REDIS_URL.',
    )
  }

  return verdictFrom(memoryHit(key, windowMs), limit)
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` is a client-controlled header: a request can arrive with
 * whatever chain it likes, and each proxy appends the address it saw. So the
 * *right-most* entry is the one our own proxy appended, and the left-most entry
 * (the one a naive implementation trusts) is the spoofable one.
 *
 * Priority:
 *  1. `cf-connecting-ip` — set by Cloudflare, not forgeable if the origin only
 *     accepts traffic from Cloudflare.
 *  2. `x-real-ip` — set by nginx (`proxy_set_header X-Real-IP $remote_addr`).
 *  3. the Nth-from-right `x-forwarded-for` hop, where N = TRUSTED_PROXY_HOPS
 *     (default 1: exactly one proxy in front of the app).
 *
 * If none are present the caller shares the "unknown" bucket, which is
 * deliberately conservative: behind a misconfigured proxy the limiter throttles
 * harder, never less.
 */
export function getClientIp(request: Request): string {
  const cloudflare = request.headers.get('cf-connecting-ip')?.trim()
  if (cloudflare) return cloudflare

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const chain = (request.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (chain.length > 0) {
    const hops = Math.max(1, Math.min(Number(process.env.TRUSTED_PROXY_HOPS) || 1, chain.length))
    return chain[chain.length - hops] ?? 'unknown'
  }

  return 'unknown'
}

/**
 * Convenience wrapper used by route handlers.
 *
 * `globalLimit` adds a second, IP-independent cap for the whole scope. Per-IP
 * keys are only trustworthy behind a proxy that sets the forwarding headers, so
 * this is what bounds the damage if the app port is ever exposed directly and
 * somebody rotates a forged `x-forwarded-for` to get a fresh bucket per request.
 * Set it well above real traffic for the scope: it is an abuse ceiling, not a
 * quota.
 */
export async function limitRequest(
  request: Request,
  scope: string,
  { limit, windowMs, globalLimit }: { limit: number; windowMs: number; globalLimit?: number },
): Promise<RateLimitVerdict> {
  const verdict = await rateLimit(`${scope}:${getClientIp(request)}`, { limit, windowMs })

  if (verdict.ok && globalLimit) {
    const globalVerdict = await rateLimit(`${scope}:__global`, { limit: globalLimit, windowMs })
    if (!globalVerdict.ok) {
      console.warn(`[rate-limit] global ceiling reached for scope "${scope}"`)
      return globalVerdict
    }
  }

  return verdict
}

export function tooManyRequests(retryAfterSeconds: number): Response {
  return Response.json(
    { error: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
  )
}
