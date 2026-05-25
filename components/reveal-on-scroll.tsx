"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export function RevealOnScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("revealed")
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    )
    el.querySelectorAll<HTMLElement>(".reveal").forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
