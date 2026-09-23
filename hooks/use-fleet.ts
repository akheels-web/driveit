'use client'

import { useEffect, useState } from 'react'

import type { CarDetails } from '@/lib/cars'
import type { SavedProfile } from '@/lib/types'

let fleetPromise: Promise<CarDetails[]> | null = null

/**
 * Live fleet data from the CMS (via the cached /api/fleet route).
 *
 * Client components use this instead of importing `lib/cars.ts`, which shipped
 * the entire static catalogue to every visitor and ignored the CMS entirely.
 */
export function useFleet() {
  const [cars, setCars] = useState<CarDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fleetPromise ??= fetch('/api/fleet')
      .then((response) => (response.ok ? response.json() : { cars: [] }))
      .then((data: { cars?: CarDetails[] }) => data.cars ?? [])
      .catch(() => [] as CarDetails[])

    fleetPromise
      .then((result) => {
        if (active) setCars(result)
      })
      .finally(() => {
        if (active) setLoading(false)
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
 *
 * Only the clock is stored in state; the remaining time is derived during
 * render, so the effect never has to set state synchronously on mount.
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
