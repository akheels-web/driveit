'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Heart toggle for saving a car.
 *
 * Pass `initiallySaved` when the parent already knows the state (server
 * component) to avoid an extra request on mount.
 */
export function WishlistButton({
  carId,
  initiallySaved,
}: {
  carId: string
  initiallySaved?: boolean
}) {
  const [isSaved, setIsSaved] = useState(Boolean(initiallySaved))
  const [isLoading, setIsLoading] = useState(initiallySaved === undefined)
  const router = useRouter()

  useEffect(() => {
    if (initiallySaved !== undefined) return

    fetch('/api/wishlist')
      .then((response) => (response.ok ? response.json() : { wishlists: [] }))
      .then((data: { wishlists?: { carSlug: string }[] }) => {
        setIsSaved(Boolean(data.wishlists?.some((item) => item.carSlug === carId)))
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false))
  }, [carId, initiallySaved])

  const toggleWishlist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId }),
      })

      if (response.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      const data = await response.json()
      if (data.status === 'added') setIsSaved(true)
      if (data.status === 'removed') setIsSaved(false)
    } catch (error) {
      console.error('[wishlist] toggle failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved cars' : 'Save this car'}
      className={`p-3 rounded-full border transition-all ${
        isSaved
          ? 'bg-[var(--gold-400)]/20 border-[var(--gold-400)] text-[var(--gold-400)] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  )
}
