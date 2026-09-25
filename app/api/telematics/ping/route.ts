import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { parseGpsPayload, checkHyderabadGeofence, SPEED_LIMIT_KMH } from '@/lib/telematics'

export const dynamic = 'force-dynamic'

function safeTokenMatches(expected: string, provided: string | null | undefined): boolean {
  if (!provided) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(provided)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Universal Telematics & GPS Ping Receiver
 * 
 * Supports:
 * - HTTP GET (Direct SIM tracker pings with query parameters)
 * - HTTP POST (JSON webhooks from LocoNav, Tracksolid, Traccar, or IoT SIM gateways)
 */

async function processGpsTelemetry(rawParams: Record<string, any>, req: NextRequest) {
  // 1. Verify Secret Token (Fail-Closed: unauthenticated pings are rejected)
  const configuredSecret = process.env.TELEMATICS_SECRET || process.env.CRON_SECRET
  if (configuredSecret) {
    const authHeader = req.headers.get('x-telematics-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
    const querySecret = rawParams.secret || rawParams.token || rawParams.key
    if (!safeTokenMatches(configuredSecret, authHeader) && !safeTokenMatches(configuredSecret, querySecret)) {
      return NextResponse.json({ error: 'Unauthorized telematics ping.' }, { status: 401 })
    }
  } else {
    // If no secret configured, require staff auth to prevent unauthorized GPS tampering
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json(
        { error: 'TELEMATICS_SECRET is not configured. Direct unauthenticated telemetry pings are disabled for security.' },
        { status: 401 }
      )
    }
  }

  // 2. Parse Normalized GPS Data
  const gpsData = parseGpsPayload(rawParams)
  if (!gpsData) {
    return NextResponse.json(
      { error: 'Missing tracker identifier. Provide "imei" or "device_id".' },
      { status: 400 }
    )
  }

  const payload = await getPayload({ config })

  // 3. Find the matching Vehicle in Cars collection
  const carQuery = await payload.find({
    collection: 'cars',
    where: {
      or: [
        { gpsDeviceId: { equals: gpsData.imei } },
        { slug: { equals: gpsData.imei } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  const car = carQuery.docs[0]
  if (!car) {
    return NextResponse.json(
      {
        error: `No vehicle mapped to GPS Device IMEI: ${gpsData.imei}. Please register this IMEI under the vehicle profile in /admin.`,
      },
      { status: 404 }
    )
  }

  // 4. Safety & Geofence Checks
  const geofence = checkHyderabadGeofence(gpsData.latitude, gpsData.longitude)
  const isOverspeed = gpsData.speedKmH > SPEED_LIMIT_KMH

  let alertMessage = ''
  if (isOverspeed) {
    alertMessage = `⚠️ High Speed Alert: ${gpsData.speedKmH} km/h (Limit: ${SPEED_LIMIT_KMH} km/h)`
  } else if (!geofence.isInside) {
    alertMessage = `🚨 Geofence Notice: Vehicle is ${geofence.distanceFromCenterKm} km from city center (Outside ORR)`
  }

  const newOdometer = gpsData.odometerKm !== undefined && gpsData.odometerKm > 0
    ? Math.max(Number(car.currentOdometerKm || 0), gpsData.odometerKm)
    : Number(car.currentOdometerKm || 0)

  // 5. Update Vehicle Telematics in CMS
  await payload.update({
    collection: 'cars',
    id: car.id,
    data: {
      currentOdometerKm: newOdometer,
      currentTelemetry: {
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
        speedKmH: gpsData.speedKmH,
        ignition: gpsData.ignition ?? false,
        batteryVoltage: gpsData.batteryVoltage ?? 12.6,
        lastPingAt: gpsData.timestamp,
        geofenceStatus: geofence.isInside ? 'inside_hyderabad' : 'outstation_zone',
        lastAlert: alertMessage || undefined,
      },
    },
  })

  // 6. Check if vehicle is on an active trip (status == 'confirmed')
  const activeBookingRes = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { carSlug: { equals: car.slug } },
        { status: { equals: 'confirmed' } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  const activeBooking = activeBookingRes.docs[0]
  if (activeBooking) {
    const existingTelematics = (activeBooking.telematics as Record<string, any>) || {}
    const existingAlerts = existingTelematics.telemetryAlerts || []

    const updatedAlerts = alertMessage
      ? [...existingAlerts, { alert: `${alertMessage} at ${new Date().toLocaleTimeString('en-IN')}` }]
      : existingAlerts

    await payload.update({
      collection: 'bookings',
      id: activeBooking.id,
      data: {
        telematics: {
          ...existingTelematics,
          currentLatitude: gpsData.latitude,
          currentLongitude: gpsData.longitude,
          currentSpeed: gpsData.speedKmH,
          currentIgnition: gpsData.ignition ?? existingTelematics.currentIgnition ?? true,
          lastPingAt: gpsData.timestamp,
          telemetryAlerts: updatedAlerts,
        },
      },
    })
  }

  return NextResponse.json({
    success: true,
    car: car.name,
    imei: gpsData.imei,
    currentOdometerKm: newOdometer,
    speedKmH: gpsData.speedKmH,
    isInsideHyderabad: geofence.isInside,
    activeTripBookingId: activeBooking?.id || null,
    alert: alertMessage || null,
  })
}

// POST endpoint for JSON webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    return await processGpsTelemetry(body, req)
  } catch (err: any) {
    console.error('[telematics/ping] POST error:', err)
    return NextResponse.json({ error: err.message || 'Internal telematics error.' }, { status: 500 })
  }
}

// GET endpoint for direct SIM tracker HTTP query strings
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const queryObj: Record<string, any> = {}
    searchParams.forEach((val, key) => {
      queryObj[key] = val
    })
    return await processGpsTelemetry(queryObj, req)
  } catch (err: any) {
    console.error('[telematics/ping] GET error:', err)
    return NextResponse.json({ error: err.message || 'Internal telematics error.' }, { status: 500 })
  }
}
