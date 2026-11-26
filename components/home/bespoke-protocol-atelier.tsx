'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  ArrowRight,
  PlaneLanding,
  CheckCircle2,
  Star,
  Car,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import type { BespokeProtocolConfig } from '@/lib/home-config'
import type { StatView, TestimonialView } from '@/lib/content-seed'
import { getLocalDateString } from '@/lib/utils'

interface BespokeProtocolAtelierProps {
  protocols?: BespokeProtocolConfig[]
  eyebrow?: string
  title?: string
  subtitle?: string
  testimonials?: TestimonialView[]
  stats?: StatView[]
  whatsappNumber?: string
}

export function BespokeProtocolAtelier({
  protocols,
  eyebrow = '03 / CURATED PROTOCOLS · HYDERABAD',
  title = 'Signature Mobility Protocols',
  subtitle = 'Whether stepping onto the private tarmac at RGIA or making a grand entrance at Taj Falaknuma, explore white-glove itineraries engineered for absolute distinction.',
  testimonials = [],
  stats = [],
  whatsappNumber = '+91 63000 41186',
}: BespokeProtocolAtelierProps) {
  const router = useRouter()
  const activeProtocols = protocols && protocols.length > 0 ? protocols : []
  const [selectedId, setSelectedId] = useState<string>(activeProtocols[0]?.id || 'airside-protocol')
  const [flightCode, setFlightCode] = useState('EK-526')

  const active = activeProtocols.find((p) => p.id === selectedId) || activeProtocols[0]
  const cleanWa = whatsappNumber.replace(/[^\d]/g, '')

  const handleReserve = () => {
    if (!active) return
    const today = getLocalDateString()
    const params = new URLSearchParams({
      carId: active.flagshipSlug,
      service: active.serviceMode,
      pickup: active.pickupHub,
      pickupDate: today,
      returnDate: today,
    })
    if (active.flightSyncSupported && flightCode.trim()) {
      params.set('flight', flightCode.trim().toUpperCase())
    }
    router.push(`/checkout?${params.toString()}`)
  }

  const topReviews = testimonials.slice(0, 3)

  return (
    <section
      className="bg-[#040405] py-20 md:py-28 px-4 md:px-[4vw] border-t border-white/8 relative overflow-hidden"
      aria-label="DRIVEIT Bespoke Occasions & White-Glove Protocols"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block mb-2">
              {eyebrow}
            </span>
            <h2 className="font-luxury text-[clamp(2.2rem,4.5vw,3.8rem)] font-extralight uppercase leading-[0.95] tracking-[0.02em] text-[#f4efe6]">
              {title}
            </h2>
            <p className="mt-3 text-xs md:text-sm text-white/55 font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c9a96e] shrink-0 self-start md:self-end">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Discreet Concierge Handover</span>
          </div>
        </div>

        {/* Interactive Split Protocol Atelier */}
        {active && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
            {/* Left: 4 Protocol Selector Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              {activeProtocols.map((protocol) => {
                const isSelected = protocol.id === active.id
                return (
                  <button
                    key={protocol.id}
                    type="button"
                    onClick={() => setSelectedId(protocol.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#111116] border-[#c9a96e] shadow-[0_0_30px_rgba(201,169,110,0.14)]'
                        : 'bg-[#09090d] border-white/8 hover:border-white/25 hover:bg-[#0c0c10]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono uppercase tracking-[0.26em] text-[#c9a96e]">
                        {protocol.tag}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-white/90">
                        {protocol.tariffFormatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-luxury text-base sm:text-lg font-light text-[#f4efe6] tracking-wide">
                          {protocol.title}
                        </h3>
                        <p className="text-[11px] text-white/45 font-light line-clamp-1 mt-0.5">
                          {protocol.subtitle}
                        </p>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#c9a96e] text-black'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right: Full-Bleed Photographic Protocol Stage (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-[#09090d] border border-white/10 overflow-hidden flex flex-col justify-between shadow-2xl relative min-h-[460px] md:min-h-[520px]">
              {/* Full-Bleed Photographic Canvas */}
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.bannerImage}
                      alt={active.bannerImageAlt}
                      fill
                      priority
                      quality={88}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/65 to-black/35" />
              </div>

              {/* Top Glass Badge */}
              <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-3 pointer-events-none select-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                  <Car className="w-3.5 h-3.5" />
                  <span>Flagship: {active.flagshipName}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#c9a96e]/40 text-[9px] font-mono uppercase tracking-[0.2em] text-[#c9a96e]">
                  {active.serviceMode === 'chauffeur' ? 'Uniformed Chauffeur' : 'Verified Self-Drive'}
                </span>
              </div>

              {/* Bottom Frosted Dossier */}
              <div className="relative z-10 p-5 sm:p-7 bg-[#09090d]/88 backdrop-blur-xl border-t border-white/10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block mb-1">
                      {active.tag}
                    </span>
                    <h3 className="font-luxury text-xl sm:text-2xl font-light text-[#f4efe6] tracking-wide">
                      {active.title}
                    </h3>
                  </div>
                  <div className="text-right sm:self-end">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 block">
                      Starting Privilege
                    </span>
                    <span className="text-base sm:text-lg font-mono font-bold text-[#c9a96e]">
                      {active.tariffFormatted}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/65 leading-relaxed font-light">
                  {active.description}
                </p>

                {/* Highlights Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {active.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/8 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a96e] shrink-0 mt-0.5" />
                      <span className="text-[10px] text-white/70 leading-snug font-light">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Flight Standby Input (Clean inline tag, only for airside protocol) */}
                {active.flightSyncSupported && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#c9a96e]/35">
                      <PlaneLanding className="w-3.5 h-3.5 text-[#c9a96e]" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
                        Flight Standby:
                      </span>
                      <input
                        type="text"
                        value={flightCode}
                        maxLength={10}
                        onChange={(e) => setFlightCode(e.target.value.toUpperCase())}
                        aria-label="Flight Number for Standby"
                        placeholder="EK-526"
                        className="w-20 bg-transparent text-xs font-mono font-bold text-[#c9a96e] focus:outline-none uppercase"
                      />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/45">
                      60-min touchdown buffer included automatically
                    </span>
                  </div>
                )}

                {/* Action CTA Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReserve}
                    className="flex-1 min-h-[46px] rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[11px] font-mono uppercase tracking-[0.22em] transition inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(201,169,110,0.25)] cursor-pointer"
                  >
                    <span>Reserve This Protocol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                      `Hello DRIVEIT Concierge, I would like to inquire about ${active.title} (${active.tag}).`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] px-5 rounded-xl border border-white/20 bg-black/50 hover:border-[#c9a96e] text-[10px] font-mono uppercase tracking-[0.2em] text-white inline-flex items-center justify-center gap-2 transition"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verified Client Chronicles & Operational Benchmarks (Wires CMS Testimonials & Stats) */}
        <div className="mt-14 pt-12 border-t border-white/8 space-y-10">
          {/* Top Row: Benchmark Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/8 text-center"
                >
                  <p className="font-luxury text-2xl sm:text-3xl font-light text-[#c9a96e] tracking-tight">
                    {stat.value.toLocaleString('en-IN')}
                    {stat.suffix}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/50 block mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Row: Verified Reviews from Payload CMS */}
          {topReviews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e]">
                  VERIFIED CLIENT CHRONICLES
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  Direct From Our Guests
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {topReviews.map((review, i) => (
                  <div
                    key={i}
                    className="p-5 sm:p-6 rounded-2xl bg-[#09090d] border border-white/8 flex flex-col justify-between gap-4 hover:border-[#c9a96e]/30 transition"
                  >
                    <div>
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-[#c9a96e] mb-3">
                        {Array.from({ length: review.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#c9a96e]" />
                        ))}
                      </div>
                      <p className="text-xs text-white/70 font-light leading-relaxed italic">
                        "{review.quote}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wide">
                          {review.name}
                        </h4>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">
                          {review.role}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#c9a96e] px-2 py-0.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
