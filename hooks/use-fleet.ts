'use client'

import { useEffect, useState } from 'react'

import { carsData, type CarDetails } from '@/lib/cars'
import type { SavedProfile } from '@/lib/types'

let fleetPromise: Promise<CarDetails[]> | null = null
let cachedFleet: CarDetails[] = carsData

/**
 * Live fleet data with instant 0ms initial render from seed catalogue,
 * seamlessly hydrated by the CMS `/api/fleet` feed in the background.
 */
export function useFleet() {
  const [cars, setCars] = useState<CarDetails[]>(cachedFleet)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    fleetPromise ??= fetch('/api/fleet')
      .then((response) => (response.ok ? response.json() : { cars: cachedFleet }))
      .then((data: { cars?: CarDetails[] }) => {
        if (data.cars && data.cars.length > 0) {
          cachedFleet = data.cars
          return data.cars
        }
        return cachedFleet
      })
      .catch(() => cachedFleet)

    fleetPromise.then((result) => {
      if (active && result.length > 0) {
        setCars(result)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return { cars, loading }
}

/** Saved addresses + loyalty of the signed-in customer (null when signed out). */
export function useSavedProfile() {
  const [profile, setProfile] = useState<SavedProfile | null>(null)

  useEffect(() => {
    let active = true

    fetch('/api/profile')
      .then((response) => (response.ok ? response.json() : { profile: null }))
      .then((data: { profile?: SavedProfile | null }) => {
        if (active && data.profile) setProfile(data.profile)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  return profile
}

/**
 * Counts down to the moment a 10 minute booking hold expires.
 */
export function useCountdown(expiresAt?: string | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt) return

    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  if (!expiresAt) return null

  const remainingMs = new Date(expiresAt).getTime() - now
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))

  return {
    expired: remainingMs <= 0,
    label: `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`,
  }
}
