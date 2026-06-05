'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function WishlistButton({ carId }: { carId: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        if (data.wishlists?.includes(carId)) {
          setIsSaved(true)
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [carId])

  const toggleWishlist = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId })
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const data = await res.json()
      if (data.status === 'added') setIsSaved(true)
      if (data.status === 'removed') setIsSaved(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-3 rounded-full border transition-all ${
        isSaved 
          ? 'bg-[var(--gold-400)]/20 border-[var(--gold-400)] text-[var(--gold-400)] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
      }`}
      title={isSaved ? "Remove from saved cars" : "Save this car"}
    >
      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  )
}
