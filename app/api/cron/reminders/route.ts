import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import {
  sendBookingPickupReminderNotification,
  sendVehicleReturnReminderNotification,
} from '@/lib/brevo'

export const dynamic = 'force-dynamic'

/**
 * Scheduled cron endpoint for booking reminders.
 *
 * Dispatches:
 *   1. 24-hour pickup reminders for upcoming reservations.
 *   2. 2-hour return reminders for ongoing rentals.
 *
 * Authenticated via `x-cron-secret` header against CRON_SECRET.
 */
async function processReminders(request: Request) {
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
  const now = new Date()
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)

  let pickupRemindersSent = 0
  let returnRemindersSent = 0

  try {
    // 1. Scan for 24h pickup reminders
    const { docs: upcomingBookings } = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { status: { equals: 'confirmed' } },
          { startDate: { greater_than_equal: now.toISOString() } },
          { startDate: { less_than_equal: in24Hours.toISOString() } },
          { pickupReminderSentAt: { exists: false } },
        ],
      },
      limit: 50,
      overrideAccess: true,
    })

    for (const booking of upcomingBookings) {
      try {
        const sent = await sendBookingPickupReminderNotification(booking)
        if (sent) {
          await payload.update({
            collection: 'bookings',
            id: booking.id,
            data: { pickupReminderSentAt: new Date().toISOString() },
            overrideAccess: true,
          })
          pickupRemindersSent++
        }
      } catch (err) {
        payload.logger.error(`[cron/reminders] Failed pickup reminder for #${booking.id}: ${err}`)
      }
    }

    // 2. Scan for 2h return reminders
    const { docs: returningBookings } = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { status: { equals: 'confirmed' } },
          { endDate: { greater_than_equal: now.toISOString() } },
          { endDate: { less_than_equal: in2Hours.toISOString() } },
          { returnReminderSentAt: { exists: false } },
        ],
      },
      limit: 50,
      overrideAccess: true,
    })

    for (const booking of returningBookings) {
      try {
        const sent = await sendVehicleReturnReminderNotification(booking)
        if (sent) {
          await payload.update({
            collection: 'bookings',
            id: booking.id,
            data: { returnReminderSentAt: new Date().toISOString() },
            overrideAccess: true,
          })
          returnRemindersSent++
        }
      } catch (err) {
        payload.logger.error(`[cron/reminders] Failed return reminder for #${booking.id}: ${err}`)
      }
    }

    payload.logger.info(
      `[cron/reminders] Dispatched ${pickupRemindersSent} pickup reminder(s) and ${returnRemindersSent} return reminder(s).`,
    )

    return NextResponse.json({
      success: true,
      pickupRemindersSent,
      returnRemindersSent,
    })
  } catch (error) {
    payload.logger.error(`[cron/reminders] Error processing reminders: ${error}`)
    return NextResponse.json(
      { error: 'Failed to process reminders.' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return processReminders(request)
}

export async function GET(request: Request) {
  return processReminders(request)
}
