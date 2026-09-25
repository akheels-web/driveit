import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

function safeTokenMatches(expected: string, provided: string | null | undefined): boolean {
  if (!provided) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(provided)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Fleet Telematics Summary Endpoint (Staff & Dispatch Only)
 * Returns live GPS status for all vehicles
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verify Staff or Authorized Service Token (prevents public tracking of VIP vehicles)
    const { user } = await payload.auth({ headers: req.headers })
    const isStaff = Boolean(user)

    const configuredSecret = process.env.TELEMATICS_SECRET || process.env.CRON_SECRET
    const authHeader = req.headers.get('x-telematics-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
    const hasValidSecret = configuredSecret ? safeTokenMatches(configuredSecret, authHeader) : false

    if (!isStaff && !hasValidSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Fleet telematics access requires staff credentials or authorized token.' },
        { status: 401 }
      )
    }

    const carsRes = await payload.find({
      collection: 'cars',
      limit: 100,
      depth: 1,
    })

    const fleet = carsRes.docs.map((car: any) => ({
      id: car.id,
      name: car.name,
      slug: car.slug,
      brand: car.brand,
      category: car.category,
      gpsDeviceId: car.gpsDeviceId || null,
      currentOdometerKm: car.currentOdometerKm || 0,
      extraKmRate: car.extraKmRate || 75,
      telemetry: car.currentTelemetry || {
        latitude: 17.4325,
        longitude: 78.3985,
        speedKmH: 0,
        ignition: false,
        batteryVoltage: 12.6,
        lastPingAt: null,
        geofenceStatus: 'inside_hyderabad',
        lastAlert: null,
      },
    }))

    return NextResponse.json({
      success: true,
      totalVehicles: fleet.length,
      trackedVehicles: fleet.filter((c: any) => c.gpsDeviceId).length,
      fleet,
    })
  } catch (err: any) {
    console.error('[telematics/fleet] Error:', err)
    return NextResponse.json({ error: 'Failed to retrieve fleet telematics.' }, { status: 500 })
  }
}
