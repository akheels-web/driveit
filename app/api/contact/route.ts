import { after, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { isPostgresReachable } from '@/lib/db'
import { upsertCustomer } from '@/lib/customers'
import { escapeHtml, sanitizeText } from '@/lib/html'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'
import { sendTelegramAlert, telegramConfigured } from '@/lib/telegram'

export const dynamic = 'force-dynamic'

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(180).optional().nullable().or(z.literal('')),
  service: z.string().trim().max(120).optional().nullable(),
  date: z.string().trim().max(60).optional().nullable(),
  guests: z.string().trim().max(40).optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(3).max(2000),
  // Hidden field: bots fill it in, humans never see it.
  company: z.string().max(0).optional().nullable(),
})

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'contact', {
    limit: 8,
    windowMs: 10 * 60_000,
    globalLimit: 150,
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

  const { name, phone, email, service, date, guests, location, message } = parsed.data
  const reference = `COM-${Date.now().toString(36).toUpperCase()}`

  const safeField = (val: unknown, maxLen = 300) => escapeHtml(sanitizeText(val, maxLen))
  const alertLines = [
    '📩 <b>DRIVEIT Privé &amp; Concierge Desk</b>',
    `Ref: <code>${safeField(reference)}</code>`,
    '',
    `Name: ${safeField(name)}`,
    `Phone: ${safeField(phone)}`,
    email ? `Email: ${safeField(email)}` : '',
    service ? `Commission / Service: ${safeField(service)}` : '',
    date ? `Preferred Date: ${safeField(date)}` : '',
    guests ? `Party Size: ${safeField(guests)}` : '',
    location ? `Departure / Hub: ${safeField(location)}` : '',
    `Brief: ${safeField(message, 1500)}`,
  ].filter(Boolean)

  // Dispatch CRM persistence and concierge notifications asynchronously after returning JSON
  after(async () => {
    if (email && email.includes('@') && (await isPostgresReachable())) {
      try {
        const payload = await getPayload({ config })
        await upsertCustomer(payload, {
          email,
          name,
          phone,
        })
      } catch (leadErr) {
        console.warn('[contact] Could not upsert customer lead:', leadErr)
      }
    }

    if (telegramConfigured()) {
      try {
        await sendTelegramAlert(alertLines.join('\n'))
      } catch (tgErr) {
        console.warn('[contact] Telegram delivery warning:', tgErr)
      }
    } else {
      console.info('[contact] Concierge Commission Logged:', {
        reference,
        name: sanitizeText(name),
        phone: sanitizeText(phone),
        service: service || 'General Concierge',
        date: date || null,
      })
    }
  })

  return NextResponse.json({
    success: true,
    reference,
  })
}
