/**
 * End-to-end smoke test — run this after every deploy, cutover or restore.
 *
 *   npm run smoke                                  # against http://localhost:3000
 *   SMOKE_BASE_URL=https://staging.example.com npm run smoke
 *   SMOKE_BASE_URL=https://example.com npm run smoke -- --allow-remote
 *
 * `SMOKE_BASE_URL` wins; `SEED_BASE_URL` (used by the seed/export/import scripts)
 * is honoured as a fallback so one env var can point every script at a target.
 *
 * It answers the questions a deploy actually needs answered:
 *   • is the app up, and does it render from the CMS?
 *   • are private collections still private? (bookings must 403, profile 401)
 *   • does a whole booking work — hold, server-side pricing, confirm, replay?
 *   • is the rate limiter alive?
 *
 * It *writes a real booking* to the database, so it refuses to run against a
 * non-loopback host unless you pass `--allow-remote`.
 */
// Pull in the git-ignored env files so `npm run smoke` picks up
// SEED_ADMIN_PASSWORD (the staff checks) without quoting it on the command
// line. Real environment variables always win, and the URL below is resolved
// after this block so SMOKE_BASE_URL from either source is honoured.
for (const file of ['.env.smoke', '.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // Missing env files are fine — CI passes real variables instead.
  }
}

import sharp from 'sharp'

const BASE = (process.env.SMOKE_BASE_URL || process.env.SEED_BASE_URL || 'http://localhost:3000')
  .trim()
  .replace(/\/+$/, '')
const allowRemote = process.argv.includes('--allow-remote')

type Check = { name: string; ok: boolean; detail: string }

const checks: Check[] = []

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail })
  console.log(`${ok ? '  ✓' : '  ✗'} ${name} — ${detail}`)
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${BASE}${path}`, init)
  const text = await response.text()
  return { status: response.status, text }
}

async function json<T = any>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const { status, text } = await request(path, init)
  try {
    return { status, body: JSON.parse(text) as T }
  } catch {
    return { status, body: text as unknown as T }
  }
}

/**
 * Logs in once and returns the JWT, or null when no password is configured.
 *
 * Login is throttled, so every privileged check shares this one session.
 */
async function staffSession(email: string, password?: string): Promise<string | null> {
  if (!password) return null

  const { status, body } = await json<{ token?: string; errors?: unknown }>('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!body?.token) {
    console.log(`  ! staff login failed (HTTP ${status}) — privileged checks skipped`)
    return null
  }

  return body.token
}

/** Far-future window, nudged per run so repeated smoke tests don't collide. */
function bookingWindow() {
  const start = new Date(Date.UTC(2027, 0, 1))
  start.setUTCDate(start.getUTCDate() + (Date.now() % 300))
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 2)

  const iso = (date: Date) => date.toISOString().slice(0, 10)
  return { startDate: iso(start), endDate: iso(end), days: 2 }
}

async function main() {
  const host = new URL(BASE).hostname
  const isLoopback = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(host)

  console.log(`\n[smoke] ${BASE}${isLoopback ? '' : '  (remote)'}\n`)
  if (!isLoopback && !allowRemote) {
    throw new Error(
      'Refusing to run against a non-loopback host without --allow-remote (it writes a real booking).',
    )
  }

  // --- 1. CMS-backed pages render -----------------------------------------
  for (const path of ['/', '/cars', '/blog', '/services', '/contactus']) {
    const { status } = await request(path)
    record(`page ${path}`, status === 200, `HTTP ${status}`)
  }

  const admin = await request('/admin')
  record('/admin reachable', admin.status === 200 || admin.status === 302, `HTTP ${admin.status}`)

  // --- 2. Content comes from the CMS, not the seed fallback ----------------
  const fleet = await json<{ cars?: { slug: string; price: number }[] }>('/api/fleet')
  const cars = fleet.body?.cars ?? []
  record(
    '/api/fleet returns the CMS fleet',
    fleet.status === 200 && cars.length > 0,
    `HTTP ${fleet.status} · ${cars.length} car(s)`,
  )

  if (!cars.length) {
    // Without a car there is no booking to test; fail loudly rather than skip.
    throw new Error('No cars in the CMS — cannot exercise the booking flow.')
  }

  // --- 3. Private data stays private --------------------------------------
  const bookings = await request('/api/bookings')
  record('/api/bookings is protected', bookings.status === 403, `HTTP ${bookings.status} (want 403)`)

  const profile = await request('/api/profile')
  record('/api/profile is protected', profile.status === 401, `HTTP ${profile.status} (want 401)`)

  // --- 4. A whole booking, with server-side pricing ------------------------
  const car = cars.find((entry) => entry.slug) ?? cars[0]
  const { startDate, endDate, days } = bookingWindow()
  const email = `smoke+${Date.now()}@example.com`

  const init = await json<{
    success?: boolean
    bookingId?: number
    holdToken?: string
    days?: number
    totalPrice?: number
    basePrice?: number
    error?: string
  }>('/api/checkout/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      carSlug: car.slug,
      startDate,
      endDate,
      customerName: 'Deploy Smoke Test',
      customerEmail: email,
      customerPhone: '+919999999999',
      // Deliberately absurd: the server must ignore it and price from the CMS.
      totalPrice: 1,
    }),
  })

  record(
    'checkout init returns a hold token',
    init.status === 200 && Boolean(init.body.holdToken),
    `HTTP ${init.status} bookingId=${init.body.bookingId ?? '—'}`,
  )

  if (!init.body.bookingId || !init.body.holdToken) {
    throw new Error(`checkout init failed: ${init.body.error || JSON.stringify(init.body)}`)
  }

  const expectedBase = car.price * days
  record(
    'price is computed server-side',
    init.body.basePrice === expectedBase && init.body.totalPrice === expectedBase,
    `₹${init.body.totalPrice} (expected ${days} × ₹${car.price} = ₹${expectedBase})`,
  )

  const confirm = await json<{
    success?: boolean
    alreadyConfirmed?: boolean
    bookingId?: number
    reference?: string
    error?: string
  }>('/api/checkout/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingId: init.body.bookingId,
      holdToken: init.body.holdToken,
      upiTransactionId: 'SMOKE-UPI-TXN',
    }),
  })

  record(
    'checkout confirm creates the booking',
    confirm.status === 200 && confirm.body.success === true,
    confirm.body.error ? `HTTP ${confirm.status} · ${confirm.body.error}` : `reference ${confirm.body.reference ?? confirm.body.bookingId}`,
  )

  // A replayed confirm (double-clicked button, retried webhook) must not
  // create a second booking or take payment twice.
  const replay = await json<{
    success?: boolean
    alreadyConfirmed?: boolean
    paymentStatus?: string
    error?: string
  }>(
    '/api/checkout/confirm',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: init.body.bookingId,
        holdToken: init.body.holdToken,
        upiTransactionId: 'SMOKE-UPI-TXN',
      }),
    },
  )

  record(
    'replayed confirm is not double-charged',
    replay.body.success === true && replay.body.alreadyConfirmed === true,
    `HTTP ${replay.status} alreadyConfirmed=${Boolean(replay.body.alreadyConfirmed)}`,
  )

  // Confirming is not the same as being paid: the UPI reference is typed in by
  // the customer, so every new booking must arrive awaiting a human check.
  record(
    'confirmed booking is flagged for payment verification',
    replay.body.paymentStatus === 'awaiting_verification',
    `paymentStatus=${replay.body.paymentStatus ?? 'missing'}`,
  )

  // A forged hold token must not be able to confirm someone else's booking.
  const forged = await request('/api/checkout/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingId: init.body.bookingId,
      holdToken: 'forged-token-that-is-long-enough-to-pass-validation',
      upiTransactionId: 'SMOKE-FORGED',
    }),
  })
  record(
    'forged hold token is rejected',
    forged.status === 403 || forged.status === 404,
    `HTTP ${forged.status}`,
  )

  // Staff credentials are needed by the media checks (4a), the staff section and
  // the hold sweep, and staff password hashes are never exported, so these come
  // from the environment. One session is reused for all of them: logins are
  // throttled, and a smoke test that trips its own limiter is a bad smoke test.
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@driveitluxury.in'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  const staffToken = await staffSession(adminEmail, adminPassword)

  // --- 4a. Media pipeline: upload, serve, delete ----------------------------
  // Uploads land in Cloudinary when it is configured, or on local disk in dev.
  // Either way the document must come back with a URL that actually resolves —
  // a broken storage adapter shows up here and nowhere else.
  {
    const token = staffToken
    if (token) {
      const png = await sharp({
        create: { width: 64, height: 48, channels: 3, background: { r: 12, g: 12, b: 12 } },
      })
        .png()
        .toBuffer()

      const form = new FormData()
      form.append('file', new Blob([new Uint8Array(png)], { type: 'image/png' }), `smoke-${Date.now()}.png`)
      // Payload reads document fields from a `_payload` JSON part. A loose `alt`
      // field is silently ignored, which shows up as a confusing 400.
      form.append('_payload', JSON.stringify({ alt: 'Smoke test upload' }))

      const uploaded = await fetch(`${BASE}/api/media`, {
        method: 'POST',
        headers: { Authorization: `JWT ${token}` },
        body: form,
      })
      const created = (await uploaded.json().catch(() => ({}))) as { doc?: Record<string, any> }
      const doc = created.doc
      const url = typeof doc?.url === 'string' ? doc.url : ''
      const absolute = url.startsWith('http') ? url : `${BASE}${url}`
      const served = url ? await fetch(absolute) : undefined

      record(
        'media upload returns a servable URL',
        uploaded.status === 201 && Boolean(url) && served?.ok === true,
        uploaded.status === 201
          ? `${url} → HTTP ${served?.status} (${url.startsWith('https://res.cloudinary.com/') ? 'cloudinary' : 'local disk'})`
          : `HTTP ${uploaded.status}`,
      )

      // The thumbnail size must resolve too; it is what the admin grid renders.
      const thumbnailUrl = typeof doc?.sizes?.thumbnail?.url === 'string' ? doc.sizes.thumbnail.url : ''
      if (thumbnailUrl) {
        const thumb = await fetch(thumbnailUrl.startsWith('http') ? thumbnailUrl : `${BASE}${thumbnailUrl}`)
        record('media thumbnail size resolves', thumb.ok, `${thumbnailUrl} → HTTP ${thumb.status}`)
      }

      if (doc?.id) {
        const removed = await fetch(`${BASE}/api/media/${doc.id}`, {
          method: 'DELETE',
          headers: { Authorization: `JWT ${token}` },
        })
        record('media delete cleans up', removed.ok, `HTTP ${removed.status}`)
      }
    }
  }

  // --- 4b. Concurrent holds: exactly one winner -----------------------------
  // Postgres serialises hold creation per car with a transactional advisory
  // lock. If that ever regresses, two browsers can hold the same car for the
  // same dates and one of them books a car that is already gone.
  // Uses a different car and a window 7 days later so it cannot collide with
  // the booking above. Losing holds must be rejected with 409, not created.
  const raceCar = cars.find((entry) => entry.slug && entry.slug !== car.slug) ?? car
  const raceStart = new Date(`${startDate}T00:00:00Z`)
  raceStart.setUTCDate(raceStart.getUTCDate() + 7)
  const raceEnd = new Date(raceStart)
  raceEnd.setUTCDate(raceEnd.getUTCDate() + 2)
  const raceWindow = {
    startDate: raceStart.toISOString().slice(0, 10),
    endDate: raceEnd.toISOString().slice(0, 10),
  }
  const RACERS = 3

  const racers = await Promise.all(
    Array.from({ length: RACERS }, (_, index) =>
      json<{ holdToken?: string; error?: string }>('/api/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carSlug: raceCar.slug,
          ...raceWindow,
          customerName: `Concurrent Hold ${index}`,
          customerEmail: `smoke-race+${index}+${Date.now()}@example.com`,
          customerPhone: '+919999999998',
        }),
      }),
    ),
  )

  const winners = racers.filter((entry) => entry.status === 200 && entry.body.holdToken)
  const rejections = racers.filter((entry) => entry.status === 409)
  record(
    'concurrent holds on one car leave exactly one winner',
    winners.length === 1 && rejections.length === RACERS - 1,
    `${RACERS} parallel holds → ${winners.length} × 200, ${rejections.length} × 409 ` +
      `(statuses: ${racers.map((entry) => entry.status).join(', ')})`,
  )

  // --- 5. Staff side: completing a booking awards loyalty exactly once -----
  // Optional — needs SEED_ADMIN_PASSWORD. This exercises the booking hooks,
  // which is where a nested same-row write used to deadlock on Postgres.
  record(
    'staff login',
    Boolean(staffToken) || !adminPassword,
    staffToken ? `as ${adminEmail}` : adminPassword ? 'login failed' : 'skipped (no SEED_ADMIN_PASSWORD)',
  )

  {
    const token = staffToken
    if (token) {
      const headers = { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }
      const started = Date.now()

      const complete = await json<{ doc?: Record<string, any> }>(
        `/api/bookings/${init.body.bookingId}`,
        { method: 'PATCH', headers, body: JSON.stringify({ status: 'completed' }) },
      )
      const elapsed = Date.now() - started

      record(
        'completing a booking does not deadlock',
        complete.status === 200 && elapsed < 15_000,
        `HTTP ${complete.status} in ${elapsed}ms`,
      )
      record(
        'loyalty reward is stamped with the transition',
        Boolean(complete.body?.doc?.loyaltyRewardIssuedAt),
        String(complete.body?.doc?.loyaltyRewardIssuedAt ?? 'missing'),
      )

      // Re-saving a completed booking must not award a second time.
      const reSave = await json<{ doc?: Record<string, any> }>(
        `/api/bookings/${init.body.bookingId}`,
        { method: 'PATCH', headers, body: JSON.stringify({ status: 'completed', notes: 'smoke re-save' }) },
      )
      record(
        're-saving a completed booking is stable',
        reSave.status === 200 &&
          reSave.body?.doc?.loyaltyRewardIssuedAt === complete.body?.doc?.loyaltyRewardIssuedAt,
        `HTTP ${reSave.status}`,
      )

      // Marking the money verified must stamp who did it and when, in the same
      // write — that stamp is the only audit trail for a payment nobody's
      // gateway confirmed.
      const verified = await json<{ doc?: Record<string, any> }>(
        `/api/bookings/${init.body.bookingId}`,
        { method: 'PATCH', headers, body: JSON.stringify({ paymentStatus: 'verified' }) },
      )
      record(
        'verifying a payment stamps who and when',
        Boolean(verified.body?.doc?.paymentVerifiedAt) && Boolean(verified.body?.doc?.paymentVerifiedBy),
        verified.body?.doc?.paymentVerifiedAt
          ? `${verified.body.doc.paymentVerifiedAt} by user ${verified.body.doc.paymentVerifiedBy?.id ?? verified.body.doc.paymentVerifiedBy}`
          : `HTTP ${verified.status} — no stamp`,
      )
    } else {
      console.log('  · staff checks skipped (set SEED_ADMIN_PASSWORD to include them)')
    }
  }

  // --- 6. Housekeeping: abandoned holds are closed --------------------------
  // Availability already ignores expired holds, so this is about the books: a
  // pending row that nobody will ever pay for must not sit there forever.
  const sweepSecret = process.env.CRON_SECRET?.trim()

  {
    const unauthorised = await request('/api/cron/expire-holds', { method: 'POST' })
    record(
      'hold sweep refuses callers without the secret',
      unauthorised.status === 401 || unauthorised.status === 503,
      `HTTP ${unauthorised.status}`,
    )

    if (sweepSecret && staffToken) {
      const staleStart = new Date(`${startDate}T00:00:00Z`)
      staleStart.setUTCDate(staleStart.getUTCDate() + 30)
      const staleEnd = new Date(staleStart)
      staleEnd.setUTCDate(staleEnd.getUTCDate() + 1)

      const stale = await json<{ bookingId?: number; holdToken?: string }>('/api/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carSlug: raceCar.slug,
          startDate: staleStart.toISOString().slice(0, 10),
          endDate: staleEnd.toISOString().slice(0, 10),
          customerName: 'Abandoned Hold',
          customerEmail: `smoke-abandoned+${Date.now()}@example.com`,
          customerPhone: '+919999999997',
        }),
      })

      const staffHeaders = { 'Content-Type': 'application/json', Authorization: `JWT ${staffToken}` }

      if (stale.body.bookingId) {
        // Backdate the hold so it is past the sweep's grace period.
        await json(`/api/bookings/${stale.body.bookingId}`, {
          method: 'PATCH',
          headers: staffHeaders,
          body: JSON.stringify({ holdExpiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }),
        })

        const swept = await json<{ closed?: number }>('/api/cron/expire-holds', {
          method: 'POST',
          headers: { 'x-cron-secret': sweepSecret },
        })

        const after = await json<{ status?: string }>(`/api/bookings/${stale.body.bookingId}`, {
          headers: { Authorization: `JWT ${staffToken}` },
        })

        record(
          'expired hold is closed by the sweep',
          after.body?.status === 'cancelled',
          `swept ${swept.body?.closed ?? '?'} → booking ${stale.body.bookingId} is ${after.body?.status ?? 'unknown'}`,
        )
      }
    } else {
      console.log('  · hold sweep closure check skipped (needs CRON_SECRET and staff)')
    }
  }

  // --- 7. Rate limiting ----------------------------------------------------
  // /api/coupons/validate is write-free, so hammering it is harmless.
  let sawRateLimit = false
  let attempts = 0
  for (; attempts < 25; attempts++) {
    const res = await request('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'SMOKE-NOT-A-CODE', email, subtotal: 1000 }),
    })
    if (res.status === 429) {
      sawRateLimit = true
      break
    }
  }
  record(
    'rate limiter returns 429',
    sawRateLimit,
    sawRateLimit ? `tripped after ${attempts + 1} requests` : `no 429 within ${attempts} requests`,
  )

  // --- Summary -------------------------------------------------------------

  const failed = checks.filter((check) => !check.ok)
  console.log(
    `\n[smoke] ${checks.length - failed.length}/${checks.length} checks passed${
      failed.length ? ` — FAILED: ${failed.map((check) => check.name).join(', ')}` : ''
    }\n`,
  )

  process.exit(failed.length ? 1 : 0)
}

main().catch((error) => {
  console.error(`\n[smoke] ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
