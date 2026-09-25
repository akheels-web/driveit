'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Car,
  Plane,
  Crown,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Lock,
  ChevronRight,
  Compass,
  Award,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export interface SiteFooterProps {
  logoSrc?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  whatsappNumber?: string
  instagramUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

export function SiteFooter({
  logoSrc: propLogoSrc,
  description: propDescription,
  phone: propPhone,
  email: propEmail,
  address: propAddress,
  whatsappNumber: propWhatsappNumber,
  instagramUrl: propInstagramUrl,
  facebookUrl: propFacebookUrl,
  youtubeUrl: propYoutubeUrl,
  linkedinUrl: propLinkedinUrl,
  twitterUrl: propTwitterUrl,
}: SiteFooterProps = {}) {
  const [logoSrc, setLogoSrc] = useState(propLogoSrc || '/logo.png')
  const [description, setDescription] = useState(
    propDescription ||
      'Hyderabad’s premier luxury mobility atelier. Providing executive chauffeur-driven vehicles, exotic self-drive rentals, royal wedding convoys, VIP airport tarmac transfers, and private aviation charters across Telangana and Andhra Pradesh.',
  )
  const [phone, setPhone] = useState(propPhone || '+91 63000 41186')
  const [email, setEmail] = useState(propEmail || 'concierge@driveitluxury.com')
  const [address, setAddress] = useState(propAddress || 'Road No. 36, Jubilee Hills & Banjara Hills, Hyderabad, Telangana 500034')
  const [whatsappNumber, setWhatsappNumber] = useState(propWhatsappNumber || '+916300041186')
  const [instagramUrl, setInstagramUrl] = useState(propInstagramUrl || 'https://instagram.com/driveitluxury')
  const [facebookUrl, setFacebookUrl] = useState(propFacebookUrl || 'https://facebook.com/driveitluxury')
  const [youtubeUrl, setYoutubeUrl] = useState(propYoutubeUrl || 'https://youtube.com/@driveitluxury')
  const [linkedinUrl, setLinkedinUrl] = useState(propLinkedinUrl || 'https://linkedin.com/company/driveitluxury')
  const [twitterUrl, setTwitterUrl] = useState(propTwitterUrl || 'https://twitter.com/driveitluxury')

  useEffect(() => {
    if (propLogoSrc) setLogoSrc(propLogoSrc)
    if (propDescription) setDescription(propDescription)
    if (propPhone) setPhone(propPhone)
    if (propEmail) setEmail(propEmail)
    if (propAddress) setAddress(propAddress)
    if (propWhatsappNumber) setWhatsappNumber(propWhatsappNumber)
    if (propInstagramUrl) setInstagramUrl(propInstagramUrl)
    if (propFacebookUrl) setFacebookUrl(propFacebookUrl)
    if (propYoutubeUrl) setYoutubeUrl(propYoutubeUrl)
    if (propLinkedinUrl) setLinkedinUrl(propLinkedinUrl)
    if (propTwitterUrl) setTwitterUrl(propTwitterUrl)

    if (!propLogoSrc || !propDescription || !propPhone) {
      fetch('/api/site-settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (!propLogoSrc && data.footerLogo) setLogoSrc(data.footerLogo)
            if (!propDescription && data.footerDescription) setDescription(data.footerDescription)
            if (!propPhone && data.contactPhone) setPhone(data.contactPhone)
            if (!propEmail && data.contactEmail) setEmail(data.contactEmail)
            if (!propAddress && data.address) setAddress(data.address)
            if (!propWhatsappNumber && data.whatsappNumber) setWhatsappNumber(data.whatsappNumber)
            if (!propInstagramUrl && data.instagramUrl) setInstagramUrl(data.instagramUrl)
            if (!propFacebookUrl && data.facebookUrl) setFacebookUrl(data.facebookUrl)
            if (!propYoutubeUrl && data.youtubeUrl) setYoutubeUrl(data.youtubeUrl)
            if (!propLinkedinUrl && data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
            if (!propTwitterUrl && data.twitterUrl) setTwitterUrl(data.twitterUrl)
          }
        })
        .catch(() => {})
    }
  }, [
    propLogoSrc,
    propDescription,
    propPhone,
    propEmail,
    propAddress,
    propWhatsappNumber,
    propInstagramUrl,
    propFacebookUrl,
    propYoutubeUrl,
    propLinkedinUrl,
    propTwitterUrl,
  ])

  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' })

  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '')

  return (
    <footer
      ref={ref}
      aria-label="DRIVEIT Luxury Fleet Mobility Footer"
      className="relative mt-0 border-t border-[var(--gold-400)]/20 bg-[#050505] text-zinc-100 overflow-hidden"
    >
      {/* Subtle ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          1. PRE-FOOTER VIP CONCIERGE & TRUST HOTLINE STRIP
          ───────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/[0.08] bg-gradient-to-r from-zinc-950 via-[#0a0a0c] to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: 24/7 Concierge Hotline Info */}
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/25 text-[11px] font-mono text-[var(--gold-300)] uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                24/7 VIP Concierge Online • Immediate Dispatch
              </div>
              <h3 className="text-xl sm:text-2xl font-[family-name:var(--font-playfair)] font-bold text-white tracking-tight">
                Need Bespoke Itinerary or Immediate Airport Dispatch?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Connect directly with our Hyderabad luxury fleet controllers. Guaranteed response in under 5 minutes with real-time availability and transparent quotes.
              </p>
            </div>

            {/* Right: Instant Contact Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                <Phone className="w-4 h-4 text-[var(--gold-400)]" />
                <span>Call {phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20DRIVEIT%20Concierge,%20I%20would%20like%20to%20reserve%20a%20luxury%20vehicle%20in%20Hyderabad.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--gold-500)] via-[var(--gold-400)] to-[var(--gold-300)] hover:brightness-110 text-black text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-[1.02] shadow-[0_0_25px_rgba(212,175,55,0.25)]"
              >
                <FaWhatsapp className="w-4.5 h-4.5 text-black" />
                <span>WhatsApp VIP Concierge</span>
              </a>
            </div>
          </div>

          {/* 4 Brand Pillars Assurance Strip */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[var(--gold-400)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">100% Verified Fleet</p>
                <p className="text-[11px] text-zinc-500">Commercial insurance & background verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[var(--gold-400)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">10-Min Hold Protection</p>
                <p className="text-[11px] text-zinc-500">Zero double-booking guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[var(--gold-400)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Full-to-Full Fuel & FASTag</p>
                <p className="text-[11px] text-zinc-500">Zero hidden markups on fuel or tolls</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 flex items-center justify-center shrink-0">
                <Plane className="w-4 h-4 text-[var(--gold-400)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">60-Min Airport Courtesy</p>
                <p className="text-[11px] text-zinc-500">Complimentary wait from flight touchdown</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PRIMARY 5-COLUMN NAVIGATION MATRIX (HIGH-IMPACT SEO LINKS)
          ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8">
          
          {/* Column 1: Brand Atelier Dossier & Direct Showroom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
            className="sm:col-span-2 md:col-span-4 lg:col-span-4 flex flex-col gap-5"
          >
            <Link href="/" className="inline-block focus:outline-none" aria-label="DRIVEIT Luxury Home">
              <Image
                src={logoSrc}
                alt="DRIVEIT Luxury Transportation Hyderabad"
                width={200}
                height={75}
                className="h-11 w-auto sm:h-12 object-contain"
                loading="lazy"
                unoptimized={logoSrc.startsWith('http')}
              />
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {description}
            </p>

            {/* Direct Contact Dossier */}
            <address className="not-italic space-y-2.5 text-xs text-zinc-400 border-t border-white/[0.08] pt-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--gold-400)] shrink-0 mt-0.5" />
                <span className="leading-snug">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-[var(--gold-400)] transition-colors">
                  {phone} (24/7 Hotline)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[var(--gold-400)] transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">Open 24 Hours / 7 Days a Week</span>
              </div>
            </address>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hyderabad Dispatch Center Active
              </span>
            </div>
          </motion.div>

          {/* Column 2: Flagship Fleet (SEO Models) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sm:col-span-1 md:col-span-1 lg:col-span-2"
          >
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5 border-b border-[var(--gold-400)]/30 pb-2.5 flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              EXOTIC FLEET
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/cars?search=Rolls-Royce" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Rolls-Royce Phantom
                </Link>
              </li>
              <li>
                <Link href="/cars?search=Maybach" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Mercedes-Maybach S-Class
                </Link>
              </li>
              <li>
                <Link href="/cars?search=Range%20Rover" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Range Rover Vogue & Auto
                </Link>
              </li>
              <li>
                <Link href="/cars?search=Lamborghini" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Lamborghini Gallardo
                </Link>
              </li>
              <li>
                <Link href="/cars?search=Defender" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Land Rover Defender 110
                </Link>
              </li>
              <li>
                <Link href="/cars?search=S-Class" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Mercedes-Benz S-Class
                </Link>
              </li>
              <li>
                <Link href="/cars?search=Vellfire" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Toyota Vellfire VIP Lounge
                </Link>
              </li>
              <li>
                <Link href="/cars?search=BMW" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> BMW 7 Series & 5 Series
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-400)] hover:text-white transition-colors"
                >
                  <span>Explore Full Fleet (50+)</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Luxury Services (SEO Core Services) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sm:col-span-1 md:col-span-1 lg:col-span-2"
          >
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5 border-b border-[var(--gold-400)]/30 pb-2.5 flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              BESPOKE SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/services/luxury-car-rental" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Chauffeur Driven Luxury
                </Link>
              </li>
              <li>
                <Link href="/cars?service=selfdrive" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Self-Drive Supercars & SUVs
                </Link>
              </li>
              <li>
                <Link href="/services/wedding-cars" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Royal Wedding Car Convoys
                </Link>
              </li>
              <li>
                <Link href="/services/corporate-car-rental" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Corporate & Diplomatic Fleet
                </Link>
              </li>
              <li>
                <Link href="/services/airport-taxi" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> RGIA VIP Airport Transfers
                </Link>
              </li>
              <li>
                <Link href="/services/private-jet-services" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Private Jet & Heli Charters
                </Link>
              </li>
              <li>
                <Link href="/services/yacht-services" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Luxury Yacht Charters
                </Link>
              </li>
              <li>
                <Link href="/services/luxury-buses" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Luxury Volvo & Benz Coaches
                </Link>
              </li>
              <li>
                <Link href="/services/intercity-cabs" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Outstation Luxury Travel
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Hyderabad VIP Service Hubs (Hyperlocal SEO) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sm:col-span-1 md:col-span-1 lg:col-span-2"
          >
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5 border-b border-[var(--gold-400)]/30 pb-2.5 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              HYDERABAD VIP HUBS
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/cars?location=Jubilee%20Hills" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Jubilee Hills (Road 36 & 45)
                </Link>
              </li>
              <li>
                <Link href="/cars?location=Banjara%20Hills" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Banjara Hills (Road 1 & 12)
                </Link>
              </li>
              <li>
                <Link href="/cars?location=HITEC%20City" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> HITEC City & Cyberabad
                </Link>
              </li>
              <li>
                <Link href="/cars?location=Gachibowli" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Gachibowli & Financial Dist
                </Link>
              </li>
              <li>
                <Link href="/cars?location=Kokapet" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Kokapet & Gandipet Estates
                </Link>
              </li>
              <li>
                <Link href="/cars?location=Madhapur" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Madhapur & Kondapur
                </Link>
              </li>
              <li>
                <Link href="/services/airport-taxi" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> RGIA Shamshabad Airport
                </Link>
              </li>
              <li>
                <Link href="/cars?location=Secunderabad" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Secunderabad & Begumpet
                </Link>
              </li>
              <li>
                <Link href="/services/intercity-cabs" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Vijayawada & Warangal Routes
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 5: Client Atelier & Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="sm:col-span-1 md:col-span-1 lg:col-span-2"
          >
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5 border-b border-[var(--gold-400)]/30 pb-2.5 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              CLIENT ATELIER
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/login" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Customer Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bookings" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Live Booking Tracking
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wishlist" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Saved Fleet Wishlist
                </Link>
              </li>
              <li>
                <Link href="/partner/list-fleet" className="hover:text-[var(--gold-400)] text-[var(--gold-300)] font-semibold transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">★</span> List Your Fleet (Consignment)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> About DRIVEIT Luxury
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Journal & Editorial Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Contact & Showroom Visit
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Rental Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[var(--gold-400)] transition-colors duration-200 flex items-center">
                  <span className="text-[var(--gold-400)] mr-2 font-mono text-[10px]">›</span> Deposit Refund Policy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. PAYMENT SECURITY & OFFICIAL LOGO STRIP (SINGLE LINE)
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4 w-full flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar py-1">
          {/* Official Payment Partner Logos */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mr-1 shrink-0">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Secure Payment Options:
            </span>

            {/* Visa Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="Visa">
              <svg className="h-3 w-auto" viewBox="0 0 100 32" fill="none">
                <path d="M37.9 1.7L24.8 30.3H16.2L9.8 6.9C9.4 5.3 9.1 4.7 7.9 4C5.9 2.9 2.8 1.9 0 1.3L0.2 0.3H13.8C15.6 0.3 17.1 1.5 17.5 3.5L20.8 21.2L29.1 0.3H37.9V1.7ZM71.2 20.7C71.3 12.8 60.1 12.4 60.2 8.9C60.2 7.8 61.2 6.7 63.5 6.4C64.6 6.2 67.8 6.1 71.3 7.7L72.7 1.3C70.8 0.6 68.3 0 65.2 0C57.3 0 51.8 4.2 51.7 10.2C51.6 14.6 55.6 17.1 58.6 18.6C61.7 20.1 62.7 21.1 62.7 22.4C62.6 24.5 60.2 25.4 57.9 25.4C53.9 25.4 51.5 24.8 48.7 23.5L47.2 30.2C49.2 31.1 53 31.9 56.9 32C65.3 32 71.1 27.8 71.2 20.7ZM92.1 30.3H99.7L93.1 0.3H86C84.4 0.3 83.1 1.2 82.5 2.7L70.5 30.3H78.9L80.6 25.6H90.9L92.1 30.3ZM83 19.1L87.2 7.4L89.6 19.1H83ZM49.1 0.3L42.5 30.3H34.5L41.1 0.3H49.1Z" fill="#1434CB"/>
              </svg>
            </div>

            {/* Mastercard Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="Mastercard">
              <svg className="h-3.5 w-auto" viewBox="0 0 38 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#EB001B"/>
                <circle cx="26" cy="12" r="12" fill="#F79E1B"/>
                <path d="M19 3.9C21.4 6.1 23 9.3 23 12.9C23 16.5 21.4 19.7 19 21.9C16.6 19.7 15 16.5 15 12.9C15 9.3 16.6 6.1 19 3.9Z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* RuPay Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="RuPay">
              <svg className="h-3 w-auto" viewBox="0 0 80 20" fill="none">
                <text x="0" y="16" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="17" fill="#1C3F94">Ru</text>
                <text x="25" y="16" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="17" fill="#E36324">Pay</text>
                <polygon points="62,2 72,10 68,18 58,10" fill="#E36324"/>
                <polygon points="68,2 78,10 74,18 64,10" fill="#00A3E0"/>
              </svg>
            </div>

            {/* UPI Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="UPI - Unified Payments Interface">
              <svg className="h-3 w-auto" viewBox="0 0 65 20" fill="none">
                <polygon points="6,2 14,10 6,18 2,18 8,10 2,2" fill="#097939"/>
                <polygon points="12,2 20,10 12,18 8,18 14,10 8,2" fill="#F37021"/>
                <text x="24" y="16" fontFamily="system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="15" fill="#000000">UPI</text>
              </svg>
            </div>

            {/* Google Pay Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="Google Pay">
              <svg className="h-3.5 w-auto" viewBox="0 0 65 24" fill="none">
                <path d="M12.3 9.8V14.1H18.5C17.9 16 16.2 17.3 12.3 17.3C8.6 17.3 5.6 14.3 5.6 10.6C5.6 6.9 8.6 3.9 12.3 3.9C14.1 3.9 15.6 4.6 16.7 5.7L19.8 2.6C17.8 0.8 15.3 0 12.3 0C5.5 0 0 5.5 0 12.3C0 19.1 5.5 24.6 12.3 24.6C19.4 24.6 24.1 19.6 24.1 12.5C24.1 11.6 24 10.7 23.8 9.8H12.3Z" fill="#4285F4"/>
                <text x="26" y="16.5" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" fill="#5F6368">Pay</text>
              </svg>
            </div>

            {/* PhonePe Official Badge */}
            <div className="h-[26px] px-2 rounded bg-[#5f259f] flex items-center justify-center shadow-sm shrink-0" title="PhonePe">
              <span className="font-bold text-white text-[11px] font-sans tracking-tight flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#5f259f] flex items-center justify-center font-black text-[9px]">पे</span>
                PhonePe
              </span>
            </div>

            {/* Paytm Official Badge */}
            <div className="h-[26px] px-2 rounded bg-white flex items-center justify-center shadow-sm shrink-0" title="Paytm">
              <span className="font-black text-[11px] italic tracking-tighter">
                <span className="text-[#002e6e]">Pay</span>
                <span className="text-[#00b9f5]">tm</span>
              </span>
            </div>

            {/* NetBanking Official Badge */}
            <div className="h-[26px] px-2 rounded bg-zinc-900 border border-white/15 flex items-center justify-center shadow-sm text-zinc-300 gap-1.5 shrink-0" title="NetBanking - All Major Indian Banks">
              <svg className="w-3 h-3 text-[var(--gold-400)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z"/>
              </svg>
              <span className="font-mono text-[9.5px] font-semibold text-zinc-200">NetBanking</span>
            </div>
          </div>

          {/* Right: Security & Certification Trust Pillars */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap text-[10.5px] text-zinc-300 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> 256-Bit SSL Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)] shrink-0" /> GST Invoicing
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)] shrink-0" /> Commercial Insurance
            </span>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM COPYRIGHT, SOCIAL ICONS & LEGAL POLICIES (SINGLE LINE)
          ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.08] bg-black/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4 w-full flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar py-1">
            
            {/* Brand Copyright */}
            <div className="text-xs text-zinc-500 shrink-0 whitespace-nowrap">
              © {new Date().getFullYear()} <strong className="text-zinc-300 font-medium">DRIVEIT Luxury Fleet Mobility Pvt. Ltd.</strong> All rights reserved.
            </div>

            {/* Social Channels with Official Brand Logos */}
            <div className="flex items-center gap-2.5 shrink-0 flex-nowrap" aria-label="Official Social Media Channels">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DRIVEIT on Instagram"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-[0_0_15px_rgba(225,48,108,0.5)] transition-all duration-300 shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DRIVEIT on Facebook"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] transition-all duration-300 shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.69 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                  </svg>
                </a>
              )}

              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DRIVEIT on YouTube"
                  className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-300 shrink-0"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DRIVEIT on LinkedIn"
                  className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-[0_0_15px_rgba(10,102,194,0.5)] transition-all duration-300 shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              )}

              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DRIVEIT on X"
                  className="w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white shadow-md hover:scale-110 hover:border-white/50 transition-all duration-300 shrink-0"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              <a
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20DRIVEIT%20Concierge,%20I%20would%20like%20to%20reserve%20a%20luxury%20vehicle%20in%20Hyderabad.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with DRIVEIT VIP Concierge on WhatsApp"
                className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shadow-md hover:scale-110 hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] transition-all duration-300 shrink-0"
              >
                <FaWhatsapp className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Legal & Sitemap Navigation */}
            <div className="flex items-center gap-3 shrink-0 flex-nowrap text-xs text-zinc-500">
              <Link href="/privacy-policy" className="hover:text-[var(--gold-400)] transition-colors shrink-0">
                Privacy
              </Link>
              <span className="text-zinc-700 shrink-0">•</span>
              <Link href="/terms-conditions" className="hover:text-[var(--gold-400)] transition-colors shrink-0">
                Terms
              </Link>
              <span className="text-zinc-700 shrink-0">•</span>
              <Link href="/refund-policy" className="hover:text-[var(--gold-400)] transition-colors shrink-0">
                Refunds
              </Link>
              <span className="text-zinc-700 shrink-0">•</span>
              <Link href="/cookies-policy" className="hover:text-[var(--gold-400)] transition-colors shrink-0">
                Cookies
              </Link>
              <span className="text-zinc-700 shrink-0">•</span>
              <Link href="/sitemap.xml" className="hover:text-[var(--gold-400)] transition-colors flex items-center gap-1 shrink-0">
                <span>Sitemap</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}