'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Tag } from 'lucide-react'

export function PromoBanner({
  enabled: propEnabled,
  text: propText,
  code: propCode,
}: {
  enabled?: boolean
  text?: string
  code?: string
} = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [bannerConfig, setBannerConfig] = useState({
    enabled: propEnabled ?? true,
    text: propText || 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!',
    code: propCode || 'FIRST10',
  })

  useEffect(() => {
    if (propEnabled !== undefined || propText || propCode) {
      setBannerConfig({
        enabled: propEnabled ?? true,
        text: propText || 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!',
        code: propCode || 'FIRST10',
      })
    } else {
      fetch('/api/site-settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setBannerConfig({
              enabled: data.promoBannerEnabled !== false,
              text: data.promoBannerText || 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!',
              code: data.promoBannerCode || 'FIRST10',
            })
          }
        })
        .catch(() => {})
    }

    // Check if user dismissed the banner previously
    const dismissed = sessionStorage.getItem('promo_dismissed')
    if (!dismissed) {
      // Small delay to let the site load first
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [propEnabled, propText, propCode])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('promo_dismissed', 'true')
  }

  if (!bannerConfig.enabled) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--gold-400)] text-black relative z-50 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center relative">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wide">
              <Tag className="w-4 h-4" />
              <span>
                {bannerConfig.text}
                {bannerConfig.code && !bannerConfig.text.includes(bannerConfig.code) && (
                  <span className="bg-black text-white px-2 py-0.5 rounded ml-1 font-mono tracking-widest text-[10px] md:text-xs">
                    {bannerConfig.code}
                  </span>
                )}
              </span>
            </div>
            <button 
              onClick={handleDismiss}
              className="absolute right-4 p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss offer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
