import React from "react"
import Image from "next/image"
import { Calendar, CheckCircle, Star, Crown, ArrowRight } from "lucide-react"

const steps = [
  { 
    t: "Book", 
    d: "Select your vehicle and dates.",
    icon: Calendar
  },
  { 
    t: "Confirm", 
    d: "We finalize your itinerary.",
    icon: CheckCircle
  },
  { 
    t: "Enjoy", 
    d: "Experience luxury comfort.",
    icon: Star
  },
  { 
    t: "Luxury", 
    d: "Every detail perfected.",
    icon: Crown
  },
]

export function ProcessTimeline() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-16 md:py-20">
      {/* Ambient background (subtle) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <div className="absolute -top-32 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-36 -right-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto flex max-w-md items-center justify-center gap-3 text-white/70">
              <span className="h-px w-10 bg-white/20" />
              <span className="text-[12px] font-semibold tracking-[0.18em] uppercase">Work Process</span>
              <span className="h-px w-10 bg-white/20" />
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Our Process
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/70">
              Experience excellence from booking to luxury delivery.
            </p>
          </div>
        </FadeIn>

        {/* Mobile layout */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 md:hidden">
          <StepCard idx={1} title={steps[0].t} desc={steps[0].d} Icon={steps[0].icon} />
          <StepCard idx={2} title={steps[1].t} desc={steps[1].d} Icon={steps[1].icon} />
          <StepCard idx={3} title={steps[2].t} desc={steps[2].d} Icon={steps[2].icon} />
          <StepCard idx={4} title={steps[3].t} desc={steps[3].d} Icon={steps[3].icon} />
        </div>

        {/* Desktop layout with directional connectors (1 → 2 → 3 → 4) */}
        <div className="relative mx-auto mt-14 hidden max-w-6xl grid-cols-2 gap-8 md:grid lg:gap-10">
          {/* Center node */}
          <div className="col-span-2 mb-2 flex items-center justify-center">
            <div className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center shadow-md backdrop-blur-lg ring-1 ring-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">DRIVEIT</div>
              <div className="text-base font-semibold tracking-tight">PROCESS</div>
            </div>
          </div>

          {/* SVG connectors + arrows */}
          <svg
            className="pointer-events-none absolute inset-0 hidden md:block"
            viewBox="0 0 1200 560"
            aria-hidden="true"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            <g stroke="currentColor" className="text-white/20" strokeWidth="2" fill="none">
              <path d="M600 120 C 600 170, 330 170, 330 220" />
              <path d="M600 120 C 600 170, 870 170, 870 220" />
              <path d="M330 240 C 330 300, 420 300, 420 360" markerEnd="url(#arrow)" />
              <path d="M420 400 C 600 460, 600 460, 780 400" markerEnd="url(#arrow)" />
              <path d="M780 360 C 780 300, 870 300, 870 240" markerEnd="url(#arrow)" />
            </g>
          </svg>

          {/* Cards placed to match arrow sequence */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <StepCard idx={1} title={steps[0].t} desc={steps[0].d} Icon={steps[0].icon} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <StepCard idx={4} title={steps[3].t} desc={steps[3].d} Icon={steps[3].icon} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <StepCard idx={2} title={steps[1].t} desc={steps[1].d} Icon={steps[1].icon} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <StepCard idx={3} title={steps[2].t} desc={steps[2].d} Icon={steps[2].icon} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Simple local FadeIn replacement
function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="opacity-100 translate-y-0 transition-all duration-700 will-change-transform">
      {children}
    </div>
  )
}

// Process step card (reusable)
function StepCard({
  idx,
  title,
  desc,
  Icon,
}: {
  idx: number
  title: string
  desc: string
  Icon: any
}) {
  return (
    <FadeIn>
      <div className="group relative">
        {/* Step badge */}
        <div className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/20 shadow-sm">
          <span className="text-white/80">{String(idx).padStart(2, "0")}</span>
          <span className="text-white/60">Step</span>
        </div>

        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-white/20">
          {/* Left accent bar */}
          <span className="pointer-events-none absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-white/60 to-white/20 opacity-90 transition-all duration-300 group-hover:w-[6px]" aria-hidden="true" />
          {/* Icon badge */}
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/20 text-white ring-1 ring-white/40 shadow-sm">
            {Icon ? <Icon className="h-4 w-4" /> : null}
          </span>

          <h4 className="text-lg font-semibold leading-snug tracking-tight text-white">{title}</h4>
          <p className="mt-2 text-sm text-white/80 md:text-[15px] leading-relaxed">{desc}</p>

          {/* Bottom accent stripe + inner ring */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" aria-hidden="true" />
        </div>
      </div>
    </FadeIn>
  )
}
