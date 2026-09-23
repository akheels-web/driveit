import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sanitizeText } from '@/lib/html'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'
import { sendTelegramAlert, telegramConfigured } from '@/lib/telegram'

export const dynamic = 'force-dynamic'

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  service: z.string().trim().max(80).optional().nullable(),
  message: z.string().trim().min(5).max(2000),
  // Hidden field: bots fill it in, humans never see it.
  company: z.string().max(0).optional().nullable(),
})

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'contact', {
    limit: 5,
    windowMs: 10 * 60_000,
    globalLimit: 120,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' },
      { status: 400 },
    )
  }

  const { name, phone, service, message } = parsed.data

  if (!telegramConfigured()) {
    console.warn('[contact] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID are not configured — enquiry not delivered.')
    return NextResponse.json(
      { success: false, error: 'Our contact channel is being configured. Please call us in the meantime.' },
      { status: 503 },
    )
  }

  const delivered = await sendTelegramAlert(
    [
      '📩 <b>DRIVEIT Contact Form</b>',
      '',
      `Name: ${sanitizeText(name)}`,
      `Phone: ${sanitizeText(phone)}`,
      service ? `Service: ${sanitizeText(service)}` : '',
      `Message: ${sanitizeText(message, 1500)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  )

  if (!delivered) {
    return NextResponse.json(
      { success: false, error: 'We could not deliver your message. Please call or WhatsApp us.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}
