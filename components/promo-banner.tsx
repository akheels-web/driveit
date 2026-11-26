'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Tag } from 'lucide-react'
import { fetchClientSiteSettings, type ClientSiteSettings } from '@/lib/client-site-settings'

const DEFAULT_PROMO_TEXT =
  'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!'

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
  const [fetched, setFetched] = useState<ClientSiteSettings | null>(null)
  const needsClientFetch = propEnabled === undefined && !propText && !propCode

  useEffect(() => {
    let active = true
    if (needsClientFetch) {
      fetchClientSiteSettings().then((data) => {
        if (active && data) setFetched(data)
      })
    }

    const dismissed = sessionStorage.getItem('promo_dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => {
        active = false
        clearTimeout(timer)
      }
    }

    return () => {
      active = false
    }
  }, [needsClientFetch])

  const enabled =
    propEnabled !== undefined
      ? propEnabled
      : fetched?.promoBannerEnabled !== undefined
        ? fetched.promoBannerEnabled
        : true
  const text = propText || fetched?.promoBannerText || DEFAULT_PROMO_TEXT
  const code = propCode || fetched?.promoBannerCode || 'FIRST10'

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('promo_dismissed', 'true')
  }

  if (!enabled) return null

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
                {text}
                {code && !text.includes(code) && (
                  <span className="bg-black text-white px-2 py-0.5 rounded ml-1 font-mono tracking-widest text-[10px] md:text-xs">
                    {code}
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
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
