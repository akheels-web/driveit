'use client'

import { PropsWithChildren, useRef } from "react"

export default function HScroll({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const GOLD = '#b48811'

  const scrollByAmount = (dir: number) => {
    const el = ref.current
    if (!el) return
    const amt = Math.max(el.clientWidth * 0.8, 300)
    el.scrollBy({ left: dir * amt, behavior: "smooth" })
  }

  return (
    <div className="mt-8 relative">
      <button
        type="button"
        aria-label="Scroll left"
        className="absolute inset-y-0 left-0 w-12 hidden md:flex items-center justify-start z-10"
        onClick={() => scrollByAmount(-1)}
      >
        <span
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          style={{ color: GOLD }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 19.5L8 12l7.5-7.5l1.5 1.5L11 12l6 6z"/></svg>
        </span>
      </button>

      <button
        type="button"
        aria-label="Scroll right"
        className="absolute inset-y-0 right-0 w-12 hidden md:flex items-center justify-end z-10"
        onClick={() => scrollByAmount(1)}
      >
        <span
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          style={{ color: GOLD }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m8.5 4.5L16 12l-7.5 7.5L7 18l6-6l-6-6z"/></svg>
        </span>
      </button>

      <div
        ref={ref}
        className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-6 w-max">
          {children}
        </div>
      </div>
    </div>
  )
}
