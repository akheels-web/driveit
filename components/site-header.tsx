"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Phone,
  Crown,
  User,
  LogOut,
  ChevronDown,
  CalendarDays,
  X,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { useSession, signOut } from "next-auth/react"
import { PromoBanner } from "@/components/promo-banner"
import { fetchClientSiteSettings, type ClientSiteSettings } from "@/lib/client-site-settings"

const HEADER_NAV_LINKS = [
  { href: "/cars", label: "Cars", xlOnly: false },
  { href: "/services/airport-taxi", label: "Chauffeur", xlOnly: false },
  { href: "/services/private-jet-services", label: "Private Jets", xlOnly: false },
  { href: "/services/yacht-services", label: "Yachts", xlOnly: false },
  { href: "/services/wedding-cars", label: "Wedding", xlOnly: true },
]

const DRAWER_SERVICES = [
  { number: "01", label: "Chauffeured Fleet", href: "/services/airport-taxi", desc: "Flagship sedans with discreet, uniformed chauffeurs" },
  { number: "02", label: "Self-Drive Collection", href: "/cars?service=selfdrive", desc: "Pure driving thrills with full insurance & zero friction" },
  { number: "03", label: "All Luxury Cars", href: "/cars", desc: "Browse Rolls-Royce, Mercedes, BMW & Porsche fleet" },
  { number: "04", label: "Airport VIP Transfers", href: "/services/pickup-dropoff", desc: "Meet & greet with 60-min complimentary wait guarantee" },
  { number: "05", label: "Wedding Convoys", href: "/services/wedding-cars", desc: "Bespoke bridal arrivals & luxury flagship motorcades" },
  { number: "06", label: "Corporate Rentals", href: "/services/corporate-car-rental", desc: "Executive transportation for business delegations & CXOs" },
  { number: "07", label: "Luxury Buses & Vans", href: "/services/luxury-buses", desc: "Executive Volvo & Mercedes coaches for entourage groups" },
  { number: "08", label: "Private Jet Aviation", href: "/services/private-jet-services", desc: "On-demand charter flights paired with ramp chauffeur access" },
  { number: "09", label: "Luxury Yacht Charters", href: "/services/yacht-services", desc: "Exclusive marine charters & VIP harbor celebrations" },
]

export function SiteHeader({
  logoSrc: propLogoSrc,
  logoAlt: propLogoAlt,
  siteName: propSiteName,
  promoEnabled: propPromoEnabled,
  promoText: propPromoText,
  promoCode: propPromoCode,
}: {
  logoSrc?: string
  logoAlt?: string
  siteName?: string
  promoEnabled?: boolean
  promoText?: string
  promoCode?: string
} = {}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [fetched, setFetched] = useState<ClientSiteSettings | null>(null)
  const [signingOut, setSigningOut] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const handleQuickSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut({ redirect: false })
    } catch { }
    window.location.href = '/'
  }

  const needsClientFetch =
    !propLogoSrc || !propLogoAlt || !propSiteName || propPromoEnabled === undefined

  useEffect(() => {
    if (!needsClientFetch) return
    let active = true
    fetchClientSiteSettings().then((data) => {
      if (active && data) setFetched(data)
    })
    return () => {
      active = false
    }
  }, [needsClientFetch])

  const logoSrc = propLogoSrc || fetched?.headerLogo || '/logo.png'
  const logoAlt =
    propLogoAlt || fetched?.headerLogoAlt || 'DRIVEIT Luxury Chauffeur & Supercar Rental Logo'
  const siteName = propSiteName || fetched?.siteName || 'DRIVEIT'
  const resolvedPromoEnabled =
    propPromoEnabled !== undefined ? propPromoEnabled : fetched?.promoBannerEnabled
  const resolvedPromoText = propPromoText || fetched?.promoBannerText
  const resolvedPromoCode = propPromoCode || fetched?.promoBannerCode

  const { scrollY } = useScroll()
  const headerBg = useTransform(scrollY, [0, 80], [0.82, 0.96])
  const headerBlur = useTransform(scrollY, [0, 80], [14, 22])
  const borderOpacity = useTransform(scrollY, [0, 80], [0.08, 0.14])

  // Lock body scroll and register escape key when drawer is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // Close drawer & account popover on route change or outside pointer tap
  useEffect(() => {
    const id = setTimeout(() => {
      setOpen(false)
      setAccountMenuOpen(false)
    }, 0)
    return () => clearTimeout(id)
  }, [pathname])

  useEffect(() => {
    if (!accountMenuOpen) return
    const handleOutside = (e: PointerEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [accountMenuOpen])

  return (
    <>
      <motion.header
        ref={headerRef}
        className="w-full fixed top-0 z-[60] flex flex-col pt-[env(safe-area-inset-top)] shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
        style={{
          backgroundColor: useTransform(headerBg, (v) => `rgba(5, 5, 8, ${v})`),
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(255, 255, 255, ${v})`),
        }}
      >
        <PromoBanner
          enabled={resolvedPromoEnabled}
          text={resolvedPromoText}
          code={resolvedPromoCode}
        />

        {/* Balanced Luxury Navigation Bar: Logo Left · Pill Nav Center · Actions & Drawer Right */}
        <div className="mx-auto max-w-[1520px] w-full px-4 sm:px-6 lg:px-10 h-16 sm:h-[72px] flex items-center justify-between gap-3 sm:gap-5 text-zinc-100">
          {/* Left: High-Contrast Brand Crest / Logo */}
          <Link
            href="/"
            aria-label={`${siteName} Home`}
            className="group inline-flex items-center rounded-xl px-2 py-1.5 -ml-2 transition-all duration-300 hover:bg-white/[0.04] shrink-0"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={160}
              height={44}
              className="h-7 sm:h-9 w-auto object-contain shrink-0 drop-shadow-[0_2px_12px_rgba(212,175,55,0.28)] transition-all duration-300 group-hover:brightness-110"
              priority
              loading="eager"
              unoptimized={logoSrc.startsWith('http')}
            />
          </Link>

          {/* Center: Spacious Frosted Pill Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/10 px-2 py-1.5 backdrop-blur-md shrink-0"
          >
            {HEADER_NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3.5 xl:px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-all duration-200 border",
                    item.xlOnly ? "hidden xl:inline-flex items-center" : "inline-flex items-center",
                    isActive
                      ? "bg-[var(--gold-400)]/15 text-[var(--gold-400)] border-[var(--gold-400)]/30 font-semibold"
                      : "text-zinc-200 border-transparent hover:text-white hover:bg-white/[0.06] font-medium"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Member Account, Primary CTA & Concierge Drawer Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {session?.user ? (
              <div ref={accountMenuRef} className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Member account menu"
                  className="flex items-center gap-1.5 sm:gap-2 min-h-[40px] px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium border border-white/12 bg-white/[0.04] text-zinc-200 hover:border-[var(--gold-400)]/45 hover:text-[var(--gold-400)] transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[var(--gold-400)] text-black flex items-center justify-center font-bold text-[10px]">
                    {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[80px] truncate">
                    {session.user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 opacity-60 transition-transform duration-200 lg:group-hover:rotate-180",
                      accountMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown */}
                <div
                  role="menu"
                  className={cn(
                    "absolute right-0 top-full pt-2 transition-all duration-200 z-50",
                    accountMenuOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible"
                  )}
                >
                  <div className="bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[210px] text-xs backdrop-blur-xl">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold text-white truncate">{session.user.name || 'VIP Member'}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 min-h-[38px] px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 min-h-[38px] px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-[var(--gold-400)]" /> My Bookings
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 min-h-[38px] px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Profile &amp; KYC
                    </Link>
                    <button
                      type="button"
                      onClick={handleQuickSignOut}
                      disabled={signingOut}
                      className="w-full flex items-center gap-2 min-h-[38px] px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left mt-1 border-t border-white/5 pt-2 cursor-pointer disabled:opacity-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center min-h-[40px] px-3.5 py-2 rounded-full border border-white/12 bg-white/[0.04] hover:border-[var(--gold-400)]/45 hover:bg-white/[0.08] text-[11px] uppercase tracking-[0.16em] text-zinc-200 hover:text-[var(--gold-400)] font-medium transition-all whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/cars"
              className="inline-flex items-center justify-center min-h-[40px] text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-zinc-950 font-semibold bg-[var(--gold-400)] hover:bg-[var(--gold-300)] px-3 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.28)] hover:scale-[1.03] shrink-0 whitespace-nowrap"
            >
              <span>Book Now</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open Navigation Drawer"
              className="group inline-flex items-center justify-center gap-2.5 min-h-[40px] min-w-[40px] px-2.5 sm:px-3.5 py-2 rounded-full border border-white/12 bg-white/[0.04] hover:border-[var(--gold-400)]/45 hover:bg-white/[0.08] text-zinc-200 hover:text-[var(--gold-400)] transition-all duration-300 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-400)]"
            >
              <span className="flex flex-col justify-center items-end gap-[4px] w-4">
                <span className="w-4 h-[1.5px] bg-current transition-all duration-300 group-hover:w-3" />
                <span className="w-2.5 h-[1.5px] bg-current transition-all duration-300 group-hover:w-4" />
              </span>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.18em] font-medium select-none">
                Menu
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Luxury Obsidian Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-[#050508]/98 backdrop-blur-2xl text-zinc-100 overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drawer Top Navigation Bar */}
            <div className="mx-auto max-w-[1500px] w-full px-4 sm:px-6 lg:px-10 h-16 sm:h-[68px] shrink-0 flex items-center justify-between border-b border-white/[0.08]">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Navigation"
                className="group flex items-center gap-2.5 text-zinc-300 hover:text-[var(--gold-400)] transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-white/[0.04]"
              >
                <X className="w-5 h-5 text-[var(--gold-400)] transition-transform duration-300 group-hover:rotate-90" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium">Close</span>
              </button>

              {/* Logo in Drawer */}
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={140}
                  height={42}
                  className="h-7 sm:h-8 w-auto object-contain"
                  unoptimized={logoSrc.startsWith('http')}
                />
              </Link>

              {/* Concierge Hotline Quick Dial */}
              <a
                href="tel:+916300041186"
                className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[var(--gold-400)] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                <span>+91 63000 41186</span>
              </a>
            </div>

            {/* Drawer Content */}
            <div className="mx-auto max-w-[1500px] w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Left Column: Comprehensive Luxury Services Index */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold-400)] font-semibold block mb-6">
                    Fleet &amp; Exclusive Experiences
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {DRAWER_SERVICES.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/[0.06]"
                      >
                        <span className="font-mono text-xs text-[var(--gold-400)]/70 group-hover:text-[var(--gold-400)] transition-colors pt-0.5 shrink-0">
                          {item.number}
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[var(--gold-400)] transition-colors flex items-center gap-1.5">
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--gold-400)]" />
                          </h3>
                          <p className="text-xs text-zinc-400 font-light mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom Fleet Fast Filter Badges */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-400 mr-2">Quick Browse:</span>
                  <Link
                    href="/cars?category=sedan"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-full text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-[var(--gold-400)] transition-colors border border-white/[0.06]"
                  >
                    Luxury Sedans
                  </Link>
                  <Link
                    href="/cars?category=suv"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-full text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-[var(--gold-400)] transition-colors border border-white/[0.06]"
                  >
                    Elite SUVs
                  </Link>
                  <Link
                    href="/cars?category=convertible"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-full text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-[var(--gold-400)] transition-colors border border-white/[0.06]"
                  >
                    Convertibles
                  </Link>
                  <Link
                    href="/partner/list-fleet"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-full text-xs bg-[var(--gold-400)]/10 text-[var(--gold-400)] hover:bg-[var(--gold-400)]/20 transition-colors border border-[var(--gold-400)]/30"
                  >
                    Partner Consignment Program
                  </Link>
                </div>
              </div>

              {/* Right Column: Direct VIP Concierge & Quick Portal Access */}
              <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-8 lg:pt-0 lg:pl-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold-400)] font-semibold block mb-5">
                    VIP Concierge Desk
                  </span>

                  {/* 24/7 Concierge Card */}
                  <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] mb-6">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span>Concierge Online • 24/7 Hyderabad</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 font-light">
                      Instant bespoke quotes, tailored itineraries, and immediate airport dispatch.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                      <a
                        href="tel:+916300041186"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--gold-400)] text-black font-semibold text-xs transition hover:bg-[var(--gold-300)]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call +91 63000 41186</span>
                      </a>
                      <a
                        href="https://wa.me/916300041186"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/10 font-medium text-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp VIP Desk</span>
                      </a>
                    </div>
                  </div>

                  {/* Portal Links */}
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold block mb-3">
                    Client Access
                  </span>
                  {session?.user ? (
                    <div className="flex items-center justify-between gap-3 p-3 mb-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{session.user.name || 'VIP Member'}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{session.user.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickSignOut}
                        disabled={signingOut}
                        className="shrink-0 min-h-[36px] px-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 hover:bg-rose-500/20 text-[11px] font-medium cursor-pointer disabled:opacity-50"
                      >
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between min-h-[44px] px-3.5 py-2.5 mb-2.5 rounded-xl bg-[var(--gold-400)]/12 border border-[var(--gold-400)]/35 text-[var(--gold-400)] hover:bg-[var(--gold-400)]/20 transition-colors text-xs font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        Sign In / Member Portal
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <div className="grid gap-1.5 text-xs">
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        Executive Dashboard
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-40" />
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        Booking Itineraries &amp; Live UTR
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-40" />
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        Self-Drive KYC Document Vault
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-40" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <span>Contact &amp; Banjara Hills Office</span>
                      <ArrowRight className="w-3 h-3 opacity-40" />
                    </Link>
                    <Link
                      href="/blog"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <span>Luxury Blog &amp; Guides</span>
                      <ArrowRight className="w-3 h-3 opacity-40" />
                    </Link>
                  </div>
                </div>

                {/* Footer Credentials */}
                <div className="pt-6 border-t border-white/[0.06] mt-6 text-[11px] text-zinc-400 font-light flex items-center justify-between">
                  <span>© {new Date().getFullYear()} DRIVEIT Luxury</span>
                  <span>Banjara Hills, Hyderabad</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}