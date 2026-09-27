"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Car,
  Plane,
  Anchor,
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

const TOP_NAV_LINKS = [
  { href: "/services/airport-taxi", label: "CHAUFFEUR" },
  { href: "/cars", label: "CARS" },
  { href: "/services/pickup-dropoff", label: "AIRPORT VIP" },
  { href: "/services/wedding-cars", label: "WEDDING" },
  { href: "/services/private-jet-services", label: "PRIVATE JETS" },
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
  siteName: propSiteName,
}: {
  logoSrc?: string
  siteName?: string
} = {}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState(propLogoSrc || '/logo.png')
  const [siteName, setSiteName] = useState(propSiteName || 'DRIVEIT')
  const [signingOut, setSigningOut] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const handleQuickSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut({ redirect: false })
    } catch {}
    window.location.href = '/'
  }

  useEffect(() => {
    if (propLogoSrc) setLogoSrc(propLogoSrc)
    if (propSiteName) setSiteName(propSiteName)
    if (!propLogoSrc || !propSiteName) {
      fetch('/api/site-settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (!propLogoSrc && data.headerLogo) setLogoSrc(data.headerLogo)
            if (!propSiteName && data.siteName) setSiteName(data.siteName)
          }
        })
        .catch(() => {})
    }
  }, [propLogoSrc, propSiteName])

  const { scrollY } = useScroll()
  const headerBg = useTransform(scrollY, [0, 80], [0, 0.95])
  const headerBlur = useTransform(scrollY, [0, 80], [0, 16])
  const borderOpacity = useTransform(scrollY, [0, 80], [0.04, 0.12])

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

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        ref={headerRef}
        className="w-full fixed top-0 z-[60] flex flex-col"
        style={{
          backgroundColor: useTransform(headerBg, (v) => `rgba(5, 5, 8, ${v})`),
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(255, 255, 255, ${v})`),
        }}
      >
        <PromoBanner />

        {/* Minimal Hype-Style Navigation Bar with 3-Column Grid (Zero Overlap Guaranteed) */}
        <div className="mx-auto max-w-[1500px] w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center text-zinc-100 gap-2 sm:gap-4">
          {/* Left: Minimal 2-Line Hamburger Menu */}
          <div className="flex items-center justify-start gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open Navigation Drawer"
              className="group flex flex-col justify-center items-start gap-[5px] w-9 h-9 p-1.5 text-zinc-300 hover:text-[var(--gold-400)] transition-colors cursor-pointer rounded-lg hover:bg-white/[0.04] focus:outline-none"
            >
              <span className="w-5 h-[1.5px] bg-current transition-all duration-300 group-hover:w-6" />
              <span className="w-3.5 h-[1.5px] bg-current transition-all duration-300 group-hover:w-6" />
            </button>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-light select-none">
              Menu
            </span>
          </div>

          {/* Center: Brand Crest / Logo (Strictly centered in its own grid column, never overlaps) */}
          <div className="flex items-center justify-center px-2 sm:px-4 shrink-0">
            <Link href="/" className="flex items-center justify-center shrink-0">
              <Image
                src={logoSrc}
                alt={`${siteName} Logo`}
                width={140}
                height={42}
                className="h-7 sm:h-8 w-auto object-contain shrink-0 transition-opacity hover:opacity-90"
                priority
                loading="eager"
                unoptimized={logoSrc.startsWith('http')}
              />
            </Link>
          </div>

          {/* Right: Spaced Uppercase Sans Links + Account / CTA */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 xl:gap-6 min-w-0">
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 tracking-[0.16em] text-[11px] xl:text-xs uppercase font-medium text-zinc-300 shrink-0">
              <Link
                href="/services/airport-taxi"
                className={cn(
                  "hover:text-[var(--gold-400)] transition-colors whitespace-nowrap",
                  pathname === '/services/airport-taxi' ? "text-[var(--gold-400)] font-semibold" : "text-zinc-300"
                )}
              >
                CHAUFFEUR
              </Link>
              <Link
                href="/cars"
                className={cn(
                  "hover:text-[var(--gold-400)] transition-colors whitespace-nowrap",
                  pathname === '/cars' ? "text-[var(--gold-400)] font-semibold" : "text-zinc-300"
                )}
              >
                CARS
              </Link>
              <Link
                href="/services/pickup-dropoff"
                className={cn(
                  "hover:text-[var(--gold-400)] transition-colors whitespace-nowrap",
                  pathname === '/services/pickup-dropoff' ? "text-[var(--gold-400)] font-semibold" : "text-zinc-300"
                )}
              >
                AIRPORT VIP
              </Link>
              <Link
                href="/services/wedding-cars"
                className={cn(
                  "hidden 2xl:inline-block hover:text-[var(--gold-400)] transition-colors whitespace-nowrap",
                  pathname === '/services/wedding-cars' ? "text-[var(--gold-400)] font-semibold" : "text-zinc-300"
                )}
              >
                WEDDING
              </Link>
            </nav>

            {/* User Session or Minimal CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {session?.user ? (
                <div className="relative group shrink-0">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-[var(--gold-400)]/40 hover:text-[var(--gold-400)] transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--gold-400)] text-black flex items-center justify-center font-bold text-[10px]">
                      {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[80px] truncate">
                      {session.user.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[200px] text-xs backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="font-semibold text-white truncate">{session.user.name || 'VIP Member'}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-[var(--gold-400)]" /> My Bookings
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Profile &amp; KYC
                      </Link>
                      <button
                        type="button"
                        onClick={handleQuickSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left mt-1 border-t border-white/5 pt-2 cursor-pointer disabled:opacity-50"
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
                  className="hidden xl:inline-block text-[11px] uppercase tracking-[0.16em] text-zinc-300 hover:text-[var(--gold-400)] font-medium transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/cars"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-zinc-950 font-semibold bg-[var(--gold-400)] hover:bg-[var(--gold-300)] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Luxury Obsidian Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-[#050508]/98 backdrop-blur-2xl text-zinc-100 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drawer Top Navigation Bar */}
            <div className="mx-auto max-w-[1500px] w-full px-4 sm:px-6 lg:px-10 h-16 sm:h-[68px] flex items-center justify-between border-b border-white/[0.08]">
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
                  alt={`${siteName} Logo`}
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
                      <span>Luxury Journal &amp; Guides</span>
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