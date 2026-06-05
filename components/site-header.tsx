"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Car, Plane, Anchor, Phone, Crown } from "lucide-react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
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

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

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
      <div className="mx-auto max-w-6xl w-full px-4 py-3 flex items-center justify-between text-zinc-100">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="DRIVEIT Logo"
            width={200}
            height={80}
            className="h-12 w-auto md:h-14"
            priority
            loading="eager"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="relative group">
                <div className="flex items-center gap-1 text-sm text-zinc-300 hover:text-[var(--gold-400)] cursor-pointer py-2 transition-colors duration-300">
                  <span>{item.label}</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-[#0a0a0a]/98 backdrop-blur-xl border border-[var(--gold-400)]/30 rounded-xl shadow-2xl p-3 min-w-[220px]">
                    <ul className="grid gap-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-[var(--gold-400)] hover:bg-white/5 rounded-lg transition-all duration-300"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-300 hover:text-[var(--gold-400)] flex items-center gap-1.5 py-2 transition-colors duration-300"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-zinc-300 hover:text-[var(--gold-400)] font-medium transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-black px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--gold-400)] hover:bg-[var(--gold-300)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Car className="w-4 h-4" />
            Book Online
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-zinc-300 hover:text-[var(--gold-400)] transition-colors duration-300"
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
            className="md:hidden border-t border-white/5 bg-[var(--luxury-bg)]/98 backdrop-blur-xl text-zinc-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mx-auto max-w-6xl px-4 py-4 grid gap-3">
              {nav.map((item) =>
                item.children ? (
                  <div key={item.href}>
                    <button
                      className="w-full text-left text-zinc-300 hover:text-[var(--gold-400)] flex items-center justify-between py-2 transition-colors duration-300"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                    >
                      {item.label}
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
                              <Link href={c.href} className="block text-sm text-zinc-300 hover:text-[var(--gold-400)] py-1 transition-colors duration-300">
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
                    className="text-zinc-300 hover:text-[var(--gold-400)] flex items-center gap-2 py-2 transition-colors duration-300"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                ),
              )}

              {/* Mobile Call to Action */}
              <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-zinc-300 hover:text-[var(--gold-400)] py-2 text-center text-sm font-medium transition-colors duration-300"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/cars"
                  className="flex items-center gap-2 text-black px-4 py-2.5 rounded-full text-sm font-medium bg-[var(--gold-400)] hover:bg-[var(--gold-300)] transition-all duration-300 justify-center"
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