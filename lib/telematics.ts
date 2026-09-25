/**
 * DriveIt Luxury GPS Telematics & Fleet Monitoring Core Engine
 * 
 * Supports:
 * - Direct HTTP/HTTPS pings from Indian SIM GPS trackers (Concox, Teltonika, Coban, Sinotrack, Onelap, AIS-140)
 * - Fleet aggregator webhooks (LocoNav, TrackSolid, Traccar, Fleetx)
 * - Automatic Odometer tracking, extra-km calculation, and security deposit reconciliation
 * - Real-time Overspeed (>120 km/h) and Hyderabad Outer Ring Road (ORR) geofence breach detection
 */

// Hyderabad Geographic Center (Secretariat / Hussain Sagar)
export const HYDERABAD_CENTER = {
  latitude: 17.4065,
  longitude: 78.4772,
  radiusKm: 65, // Encompasses Outer Ring Road (ORR), Shamshabad RGIA, Sangareddy & Medchal
}

export const SPEED_LIMIT_KMH = 120

export interface GpsPingData {
  imei: string
  latitude: number
  longitude: number
  speedKmH: number
  odometerKm?: number
  ignition?: boolean
  batteryVoltage?: number
  timestamp?: string
}

/**
 * Calculates distance between two GPS coordinates using the Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(2))
}

/**
 * Checks if the vehicle coordinates are inside the Hyderabad Greater Metropolitan & ORR boundary
 */
export function checkHyderabadGeofence(latitude: number, longitude: number): {
  isInside: boolean
  distanceFromCenterKm: number
} {
  const dist = calculateHaversineDistanceKm(
    latitude,
    longitude,
    HYDERABAD_CENTER.latitude,
    HYDERABAD_CENTER.longitude
  )
  return {
    isInside: dist <= HYDERABAD_CENTER.radiusKm,
    distanceFromCenterKm: dist,
  }
}

/**
 * Calculates trip distance, excess km, and extra charges
 */
export function calculateTripKilometers(params: {
  startOdometerKm: number
  endOdometerKm: number
  days: number
  dailyKmAllowance?: number
  extraKmRate?: number
}) {
  const { startOdometerKm, endOdometerKm, days, dailyKmAllowance = 100, extraKmRate = 75 } = params

  const totalKmDriven = Math.max(0, Math.round(endOdometerKm - startOdometerKm))
  const allowedKm = Math.max(1, days) * dailyKmAllowance
  const extraKmDriven = Math.max(0, totalKmDriven - allowedKm)
  const extraKmCharge = extraKmDriven * extraKmRate

  return {
    totalKmDriven,
    allowedKm,
    extraKmDriven,
    extraKmRate,
    extraKmCharge,
  }
}

/**
 * Normalizes input from diverse GPS tracker SIM formats (both JSON POST body & HTTP GET query)
 */
export function parseGpsPayload(data: Record<string, any>): GpsPingData | null {
  const imei = String(data.imei || data.device_id || data.deviceId || data.id || data.trackerId || '').trim()
  if (!imei) return null

  const latitude = Number(data.lat || data.latitude || data.y || 0)
  const longitude = Number(data.lng || data.lon || data.longitude || data.x || 0)
  const speedKmH = Math.max(0, Number(data.speed || data.speedKmH || data.spd || 0))

  // Odometer may arrive in km or meters depending on device protocol
  let odometerKm: number | undefined
  if (data.odometer !== undefined || data.odometerKm !== undefined || data.distance !== undefined) {
    const rawOdo = Number(data.odometerKm ?? data.odometer ?? data.distance ?? 0)
    // If greater than 500,000, it's likely sent in meters (Teltonika/Coban standard)
    odometerKm = rawOdo > 500000 ? Math.round(rawOdo / 1000) : Math.round(rawOdo)
  }

  // Ignition parsing (1, '1', true, 'true', 'on', 'ACC ON')
  let ignition: boolean | undefined
  if (data.ignition !== undefined || data.acc !== undefined || data.engine !== undefined) {
    const rawIgnition = data.ignition ?? data.acc ?? data.engine
    ignition = rawIgnition === 1 || rawIgnition === '1' || rawIgnition === true || String(rawIgnition).toLowerCase().includes('on')
  }

  const batteryVoltage = data.battery || data.voltage || data.batteryVoltage ? Number(data.battery || data.voltage || data.batteryVoltage) : undefined

  return {
    imei,
    latitude,
    longitude,
    speedKmH,
    odometerKm,
    ignition,
    batteryVoltage,
    timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
  }
}
