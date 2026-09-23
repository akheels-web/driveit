'use client'

import React, { useRef, useEffect, useState } from "react"
import { motion, useInView } from "motion/react"
import { StatView, statsSeed } from "@/lib/content-seed"

function useCounter(target: number, isInView: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return count
}

function StatItem({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })
  const count = useCounter(target, isInView)

  return (
    <motion.li
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="block text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold text-gradient-gold tabular-nums">
        {count}{suffix}
      </span>
      <motion.div
        className="mx-auto mt-3 h-px bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
        initial={{ width: 0 }}
        animate={isInView ? { width: 48 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      />
      <div className="mt-3 text-sm text-white/50 tracking-wide uppercase">{label}</div>
    </motion.li>
  )
}

/** Counters are CMS-driven (Site Settings → Homepage Counters) with seed fallbacks. */
export function Stats({ items = statsSeed }: { items?: StatView[] }) {
  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-[var(--luxury-bg)]">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((it, i) => (
            <StatItem
              key={`${it.label}-${i}`}
              target={it.value}
              suffix={it.suffix}
              label={it.label}
              delay={i * 0.15}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}