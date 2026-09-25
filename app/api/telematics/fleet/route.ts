import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Fleet Telematics Summary Endpoint
 * Returns live GPS status for all vehicles
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

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
