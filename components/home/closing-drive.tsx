'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { ArrowRight, Crown, ShieldCheck, Sparkles, Lock } from 'lucide-react'
import type { HomeSectionsConfig } from '@/lib/home-config'
import type { CommissionAsset } from './quick-book-drawer'

export function ClosingDrive({
  whatsappNumber,
  sections,
  onRequestCommission,
}: {
  whatsappNumber: string
  phone?: string
  sections?: HomeSectionsConfig
  onRequestCommission?: (asset: CommissionAsset) => void
}) {
  const wa = whatsappNumber.replace(/[^\d]/g, '')
  const passRef = useRef<HTMLDivElement>(null)

  const handleCardMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = passRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])

  const handleCardLeave = useCallback(() => {
    const el = passRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-[#040405] py-24 md:py-32 px-4 md:px-[4vw] border-t border-white/8"
      aria-label="DriveIt Privé Membership & 24/7 Dispatch"
    >
      {/* Full-Bleed Studio Visual Backdrop */}
      <div className="absolute inset-0">
        <Image
          src={sections?.closingBannerImage || '/luxury-flagship-cars-in-black-studio.webp'}
          alt={
            sections?.closingBannerImageAlt ||
            'DRIVEIT Luxury flagship chauffeur and supercar studio fleet in Hyderabad'
          }
          fill
          quality={90}
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/80 to-[#040405]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Dispatch Headline & Direct Actions */}
        <div className="lg:col-span-7">
          <span className="text-[10px] font-mono uppercase tracking-[0.38em] text-[#c9a96e] block mb-4">
            {sections?.closingEyebrow || '04 / DRIVEIT PRIVÉ · HYDERABAD 24/7 DISPATCH'}
          </span>

          <h2 className="font-luxury text-[clamp(2.4rem,5.5vw,5rem)] font-extralight uppercase leading-[0.94] tracking-[0.02em] text-[#f4efe6]">
            {sections?.closingTitle || 'Arrive Without Compromise.'}
          </h2>
          {sections?.closingDescription && (
            <p className="mt-4 text-sm text-white/60 max-w-xl leading-relaxed font-light">
              {sections.closingDescription}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]" />
              Zero Deposit Chauffeur Option
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a96e]" />
              45-Min Doorstep Delivery
            </span>
          </div>

          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/cars"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] px-8 text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-black transition"
            >
              <span>{sections?.closingCtaLabel || 'Explore Full Fleet'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(
                "Hello DRIVEIT Concierge, I'd like to reserve a luxury vehicle.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full border border-white/20 bg-black/60 px-8 text-[11px] font-mono uppercase tracking-[0.24em] text-[#f4efe6] transition hover:border-[#c9a96e] hover:text-[#c9a96e]"
            >
              <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
              <span>24/7 WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* Right: Interactive 3D-Tilting DRIVEIT PRIVÉ Black Titanium Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            ref={passRef}
            onPointerMove={handleCardMove}
            onPointerLeave={handleCardLeave}
            style={{
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="w-full max-w-md rounded-[26px] p-7 sm:p-8 bg-gradient-to-br from-[#17171d] via-[#0c0c10] to-[#060608] border border-[#c9a96e]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden select-none cursor-pointer will-change-transform"
            onClick={() => {
              if (onRequestCommission) {
                onRequestCommission({
                  title: 'DriveIt Privé Membership',
                  subtitle: 'Standing Fleet Access · Jets · Yachts · Zero Deposit',
                  src: '/rolls-royce-phantom-night.webp',
                  serviceName: 'DriveIt Privé Membership Invitation',
                })
              }
            }}
          >
            {/* Subtle Gold Radial Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[#c9a96e]/15 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#c9a96e]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e]">
                  DRIVEIT PRIVÉ
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                CHARTER DESK
              </span>
            </div>

            <div className="my-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-white/40">
                {sections?.closingPassLabel || 'BLACK TITANIUM · INVITATION TIER'}
              </p>
              <h3 className="mt-1 font-luxury text-2xl sm:text-3xl font-light uppercase tracking-[0.08em] text-[#f4efe6]">
                {sections?.closingPassTitle || 'PRIVÉ CHARTER PASS'}
              </h3>
              <p className="mt-2 text-xs text-white/55 leading-relaxed">
                {sections?.closingPassBenefits?.length
                  ? sections.closingPassBenefits.join(' · ')
                  : 'Priority allocation on Rolls-Royce, Aston Martin & Ferrari flagships, tarmac jet transfers, and waived security deposit privileges.'}
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-white/35 block">
                  CHAPTER
                </span>
                <span className="text-xs font-mono text-[#f4efe6] tracking-[0.2em]">
                  HYDERABAD · IN
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c9a96e] text-black font-bold text-[10px] font-mono uppercase tracking-[0.2em]">
                <Lock className="w-3 h-3" />
                <span>Request Invitation</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
