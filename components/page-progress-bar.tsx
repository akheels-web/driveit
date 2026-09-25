'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PageProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  // Listen for clicks on internal navigation links
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Skip external links, hashes, mailto, tel, or modifier keys (Ctrl/Cmd/Shift)
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      // Check if it's the exact current URL
      const currentUrl = window.location.pathname + window.location.search
      if (href === currentUrl) return

      // Trigger immediate instant feedback
      setVisible(true)
      setProgress(25)

      // Advance smoothly while waiting for next page
      const timer1 = setTimeout(() => setProgress(65), 100)
      const timer2 = setTimeout(() => setProgress(85), 350)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }

    document.addEventListener('click', handleAnchorClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
    }
  }, [])

  // When pathname or searchParams change, route transition has completed!
  useEffect(() => {
    if (!visible) return

    setProgress(100)
    const timeout = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 250)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams, visible])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-[2.5px] bg-gradient-to-r from-[var(--gold-600)] via-[var(--gold-400)] to-[var(--gold-200)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '150ms' : '300ms',
          boxShadow: '0 0 12px rgba(212, 175, 55, 0.8), 0 0 6px rgba(212, 175, 55, 0.5)',
        }}
      />
    </div>
  )
}
