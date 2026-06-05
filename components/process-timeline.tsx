'use client'

import React, { useRef } from "react"
import { Calendar, CheckCircle, Crown, Car, UserCheck } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "motion/react"

const steps = [
  {
    t: "Choose Your Vehicle",
    d: "Browse our premium fleet of sedans, SUVs, and exotic cars to find the perfect match.",
    icon: Car,
  },
  {
    t: "Select Service",
    d: "Decide between our professional chauffeur-driven service or self-drive options.",
    icon: UserCheck,
  },
  {
    t: "Book Online",
    d: "Instantly confirm your reservation through our secure platform or via WhatsApp.",
    icon: Calendar,
  },
  {
    t: "Enjoy the Ride",
    d: "Experience unparalleled luxury. Your pristine vehicle awaits at your location.",
    icon: Crown,
  },
]

function StepCard({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0]
  index: number
  isInView: boolean
}) {
  const Icon = step.icon

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Step number */}
      <div className="absolute -top-3 left-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-[var(--luxury-bg)] px-3 py-1 text-xs font-semibold border border-[var(--luxury-border)]">
        <span className="text-[var(--gold-400)]">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-white/40">Step</span>
      </div>

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-glow-gold p-6 bg-[var(--luxury-surface)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
        {/* Left accent bar */}
        <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[var(--gold-400)] to-[var(--gold-700)] opacity-60 transition-all duration-300 group-hover:w-[4px] group-hover:opacity-100" />

        {/* Icon badge */}
        <motion.div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl glass-gold"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="h-5 w-5 text-[var(--gold-400)]" />
        </motion.div>

        <h4 className="text-lg font-[family-name:var(--font-playfair)] font-semibold text-white">
          {step.t}
        </h4>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{step.d}</p>

        {/* Bottom gold line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--gold-400)]/30 to-transparent" />
      </div>
    </motion.div>
  )
}

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -80px 0px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.5"],
  })

  // Progress line grows as user scrolls through section
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--luxury-bg)] text-white py-16 md:py-24">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="absolute -top-32 -left-40 h-80 w-80 rounded-full bg-[var(--gold-400)] blur-[120px]" />
        <div className="absolute -bottom-36 -right-40 h-96 w-96 rounded-full bg-[var(--gold-400)] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">Work Process</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold">
            Our <span className="text-gradient-gold">Process</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50">
            Experience excellence from booking to luxury delivery.
          </p>
        </motion.div>

        {/* Scroll-linked progress bar */}
        <div className="relative h-px bg-white/5 mb-12 hidden md:block">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-200)]"
            style={{ width: lineWidth }}
          />
          {/* Glow dot at the end */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gold-400)] shadow-[0_0_10px_var(--gold-400)]"
            style={{ left: lineWidth }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StepCard key={step.t} step={step} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
