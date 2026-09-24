import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { expireStaleHolds, HOLD_SWEEP_GRACE_MINUTES } from '@/lib/booking-holds'

export const dynamic = 'force-dynamic'

/**
 * Closes abandoned checkout holds.
 *
 * A hold is a `pending` booking that reserves a car for 10 minutes. Availability
 * already ignores expired ones, but without this sweep they stay `pending`
 * forever — the admin list fills with ghosts and "pending approval" stops meaning
 * anything.
 *
 * Called by the `scheduler` service in docker-compose.yml every 15 minutes:
 *
 *   curl -fsS -X POST -H "x-cron-secret: $CRON_SECRET" \
 *     http://127.0.0.1:3000/api/cron/expire-holds
 *
 * Security: the endpoint mutates data, so it is closed by default. It requires
 * CRON_SECRET to be set (a deployment without it gets a 503, never an open
 * endpoint) and compares the header in constant time. It is idempotent and safe
 * to call concurrently — closing an already-closed booking is a no-op because
 * the query only selects `pending` rows past their grace period.
 */
async function sweep(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured on this deployment.' },
      { status: 503 },
    )
  }

  const provided = request.headers.get('x-cron-secret')?.trim() ?? ''
  const expected = Buffer.from(secret)
  const actual = Buffer.from(provided)

  const authorised =
    expected.length === actual.length && crypto.timingSafeEqual(expected, actual)

  if (!authorised) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  try {
    const result = await expireStaleHolds(payload)
    payload.logger.info(
      `[holds] swept ${result.closed} expired hold(s)` +
        (result.failed ? `, ${result.failed} failed` : ''),
    )

    return NextResponse.json({
      success: true,
      closed: result.closed,
      failed: result.failed,
      graceMinutes: HOLD_SWEEP_GRACE_MINUTES,
    })
  } catch (error) {
    console.error('[cron/expire-holds] failed:', error)
    return NextResponse.json({ error: 'Sweep failed.' }, { status: 500 })
  }
}

// POST from cron; GET allowed so a monitoring check can assert it is reachable
// (and get the 401 that proves the secret is being enforced).
export const POST = sweep
export const GET = sweep
