import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * WaCRM bridge.
 *
 * This used to be an open relay: anyone could POST an arbitrary payload and the
 * server would forward it to WaCRM. Callers must now prove they hold
 * WACRM_WEBHOOK_SECRET by signing the raw body with HMAC-SHA256.
 */

const PayloadSchema = z.object({
  event: z.string().trim().min(1).max(80),
  data: z.record(z.any()),
})

const sign = (body: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(body).digest('hex')

function signaturesMatch(expected: string, provided: string): boolean {
  const a = Buffer.from(expected)
  const b = Buffer.from(provided)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'wacrm-inbound', {
    limit: 60,
    windowMs: 60_000,
    globalLimit: 3_000,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  const secret = process.env.WACRM_WEBHOOK_SECRET
  const target = process.env.WACRM_WEBHOOK_URL

  if (!secret || !target) {
    return NextResponse.json({ error: 'WaCRM bridge is not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('x-webhook-signature')
  const rawBody = await request.text()

  if (!signature || !signaturesMatch(sign(rawBody, secret), signature)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const parsed = PayloadSchema.safeParse(parsedBody)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const forwardBody = JSON.stringify(parsed.data)

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': sign(forwardBody, secret),
      },
      body: forwardBody,
    })

    if (!response.ok) {
      console.error('[wacrm-bridge] upstream responded with', response.status)
      return NextResponse.json({ error: 'WaCRM rejected the event.' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[wacrm-bridge] forwarding failed:', error)
    return NextResponse.json({ error: 'Could not reach WaCRM.' }, { status: 502 })
  }
}
