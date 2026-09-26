"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Car, Plane, Anchor, Phone, Crown, User, LogOut, ChevronDown, CalendarDays } from "lucide-react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { useSession, signOut } from "next-auth/react"
import { PromoBanner } from "@/components/promo-banner"

const nav = [
  { href: "/services/airport-taxi", label: "Luxury Chauffeurs", icon: Crown },
  { href: "/services/luxury-car-rental", label: "Luxury Cars", icon: Car },
  { href: "/services/private-jet-services", label: "Private Jets", icon: Plane },
  { href: "/services/yacht-services", label: "Yachts", icon: Anchor },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/pickup-dropoff", label: "Pickup & Drop-off" },
      { href: "/services/luxury-buses", label: "Luxury Buses" },
      { href: "/services/wedding-cars", label: "Wedding Cars" },
      { href: "/services/corporate-car-rental", label: "Corporate Car Rental" },
    ],
  },
  { href: "/contact", label: "Contact" },
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
  const [servicesOpen, setServicesOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState(propLogoSrc || '/logo.png')
  const [siteName, setSiteName] = useState(propSiteName || 'DRIVEIT')
  const headerRef = useRef<HTMLElement>(null)

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
  const headerBg = useTransform(scrollY, [0, 100], [0, 0.95])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 16])
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.15])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Automatically close mobile menu on route change
  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [pathname])

  return (
    <motion.header
      ref={headerRef}
      className="w-full fixed top-0 z-[60] flex flex-col"
      style={{
        backgroundColor: useTransform(headerBg, (v) => `rgba(5, 5, 5, ${v})`),
        backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
        borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(212, 175, 55, ${v})`),
      }}
    >
      <PromoBanner />
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between text-zinc-100 gap-3 xl:gap-6">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src={logoSrc}
            alt={`${siteName} Logo`}
            width={160}
            height={50}
            className="h-8 sm:h-9 lg:h-10 xl:h-11 w-auto object-contain shrink-0"
            priority
            loading="eager"
            unoptimized={logoSrc.startsWith('http')}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3.5 2xl:gap-5 shrink min-w-0">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="relative group shrink-0">
                <div 
                  className={cn(
                    "flex items-center gap-1 text-xs xl:text-sm cursor-pointer py-1.5 px-2 xl:px-2.5 rounded-lg transition-colors duration-300 whitespace-nowrap",
                    item.children.some(c => c.href === pathname)
                      ? "text-[var(--gold-400)] font-medium bg-[var(--gold-400)]/10"
                      : "text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/[0.04]"
                  )}
                >
                  <span>{item.label}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-[#0a0a0a]/98 backdrop-blur-xl border border-[var(--gold-400)]/30 rounded-xl shadow-2xl p-2.5 min-w-[220px]">
                    <ul className="grid gap-1">
                      {item.children.map((c) => {
                        const isChildActive = pathname === c.href
                        return (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={cn(
                                "block px-3.5 py-2 text-xs xl:text-sm rounded-lg transition-all duration-300 whitespace-nowrap",
                                isChildActive 
                                  ? "text-[var(--gold-400)] bg-[var(--gold-400)]/10 font-medium" 
                                  : "text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5"
                              )}
                            >
                              {c.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs xl:text-sm flex items-center gap-1.5 py-1.5 px-2 xl:px-2.5 rounded-lg transition-colors duration-300 whitespace-nowrap shrink-0",
                  pathname === item.href
                    ? "text-[var(--gold-400)] font-medium bg-[var(--gold-400)]/10"
                    : "text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/[0.04]"
                )}
              >
                {item.icon && <item.icon className="hidden xl:inline-block w-3.5 h-3.5 xl:w-4 xl:h-4 opacity-75 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          {session?.user ? (
            <div className="relative group shrink-0">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--gold-400)]/40 bg-[var(--gold-400)]/10 text-[var(--gold-300)] hover:bg-[var(--gold-400)]/20 transition-all shadow-sm shrink-0 whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--gold-400)] text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                  {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="max-w-[75px] xl:max-w-[110px] truncate">{session.user.name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </Link>

              {/* User Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0c0c0e] border border-[var(--gold-400)]/30 rounded-xl shadow-2xl p-2 min-w-[200px] text-xs backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-semibold text-white truncate">{session.user.name || 'VIP Member'}</p>
                    <p className="text-[10px] text-white/50 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    <Crown className="w-3.5 h-3.5 text-[var(--gold-400)] shrink-0" /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    <CalendarDays className="w-3.5 h-3.5 text-[var(--gold-400)] shrink-0" /> My Bookings
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--gold-400)] shrink-0" /> Profile &amp; KYC
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left mt-1 border-t border-white/5 pt-2 cursor-pointer whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs xl:text-sm text-zinc-300 hover:text-[var(--gold-400)] font-medium transition-colors duration-300 px-2 py-1.5 whitespace-nowrap"
            >
              Login
            </Link>
          )}
          <Link
            href="/cars"
            className="flex items-center gap-1.5 xl:gap-2 text-black px-3.5 py-1.5 xl:px-4.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold bg-[var(--gold-400)] hover:bg-[var(--gold-300)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0 whitespace-nowrap"
          >
            <Car className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
            <span>Book Online</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle Menu"
          className="lg:hidden inline-flex items-center justify-center rounded-lg border border-white/10 p-2.5 min-w-[44px] min-h-[44px] text-zinc-300 hover:text-[var(--gold-400)] transition-colors duration-300 shrink-0"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden border-t border-white/5 bg-[var(--luxury-bg)]/98 backdrop-blur-xl text-zinc-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 grid gap-3 max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {nav.map((item) =>
                item.children ? (
                  <div key={item.href}>
                    <button
                      className={cn(
                        "w-full text-left flex items-center justify-between py-2.5 min-h-[44px] transition-colors duration-300",
                        item.children.some(c => c.href === pathname)
                          ? "text-[var(--gold-400)] font-medium"
                          : "text-zinc-300 hover:text-[var(--gold-400)]"
                      )}
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                    >
                      <span>{item.label}</span>
                      <motion.span
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ⌄
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.ul
                          className="mt-2 grid gap-2 pl-4 border-l border-[var(--luxury-border)]"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link 
                                href={c.href} 
                                className={cn(
                                  "block text-sm py-2 min-h-[44px] flex items-center transition-colors duration-300",
                                  pathname === c.href 
                                    ? "text-[var(--gold-400)] font-medium" 
                                    : "text-zinc-300 hover:text-[var(--gold-400)]"
                                )}
                                onClick={() => {
                                  setOpen(false)
                                  setServicesOpen(false)
                                }}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 py-2.5 min-h-[44px] transition-colors duration-300 text-sm",
                      pathname === item.href
                        ? "text-[var(--gold-400)] font-medium"
                        : "text-zinc-300 hover:text-[var(--gold-400)]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                ),
              )}

              {/* Mobile Call to Action */}
              <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                {session?.user ? (
                  <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.03] border border-[var(--gold-400)]/20">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                      <div className="w-8 h-8 rounded-full bg-[var(--gold-400)]/20 text-[var(--gold-400)] flex items-center justify-center font-bold text-xs">
                        {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{session.user.name || 'VIP Member'}</p>
                        <p className="text-[10px] text-white/50 truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 text-zinc-200 hover:text-[var(--gold-400)] transition font-medium"
                      >
                        <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 text-zinc-200 hover:text-[var(--gold-400)] transition font-medium"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-[var(--gold-400)]" /> Bookings
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-zinc-300 hover:text-[var(--gold-400)] py-2.5 min-h-[44px] flex items-center justify-center text-sm font-medium transition-colors duration-300"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/cars"
                  className="flex items-center gap-2 text-black px-4 py-3 min-h-[44px] rounded-full text-sm font-medium bg-[var(--gold-400)] hover:bg-[var(--gold-300)] transition-all duration-300 justify-center"
                  onClick={() => setOpen(false)}
                >
                  <Car className="w-4 h-4" />
                  Book Online
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}