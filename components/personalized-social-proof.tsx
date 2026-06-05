'use client'

import { useState, useEffect } from 'react'

export function PersonalizedSocialProof({ carId, globalBookings }: { carId: string, globalBookings: string }) {
  const [personalCount, setPersonalCount] = useState(0)

  useEffect(() => {
    // Fetch personalized count
    fetch(`/api/bookings/count?carId=${carId}`)
      .then(res => res.json())
      .then(data => {
        if (data.count > 0) setPersonalCount(data.count)
      })
      .catch(() => {})
  }, [carId])

  if (personalCount > 0) {
    return (
      <div className="text-[var(--gold-400)] font-medium bg-[var(--gold-400)]/10 px-2 py-0.5 rounded text-xs border border-[var(--gold-400)]/20 animate-pulse">
        You've booked this car {personalCount} time{personalCount > 1 ? 's' : ''}
      </div>
    )
  }

  return <div className="text-white/60">Booked {globalBookings}+ times globally</div>
}
