'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FaLinkedinIn, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa'

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
  const [instagramUrl, setInstagramUrl] = useState(propInstagramUrl || 'https://instagram.com/driveitluxury')
  const [youtubeUrl, setYoutubeUrl] = useState(propYoutubeUrl || 'https://youtube.com/@driveitluxury')
  const [linkedinUrl, setLinkedinUrl] = useState(propLinkedinUrl || 'https://linkedin.com/company/driveitluxury')
  const [twitterUrl, setTwitterUrl] = useState(propTwitterUrl || 'https://twitter.com/driveitluxury')

  useEffect(() => {
    if (propLogoSrc) setLogoSrc(propLogoSrc)
    if (propInstagramUrl) setInstagramUrl(propInstagramUrl)
    if (propYoutubeUrl) setYoutubeUrl(propYoutubeUrl)
    if (propLinkedinUrl) setLinkedinUrl(propLinkedinUrl)
    if (propTwitterUrl) setTwitterUrl(propTwitterUrl)

    if (!propLogoSrc) {
      fetch('/api/site-settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (!propLogoSrc && data.footerLogo) setLogoSrc(data.footerLogo)
            if (!propInstagramUrl && data.instagramUrl) setInstagramUrl(data.instagramUrl)
            if (!propYoutubeUrl && data.youtubeUrl) setYoutubeUrl(data.youtubeUrl)
            if (!propLinkedinUrl && data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
            if (!propTwitterUrl && data.twitterUrl) setTwitterUrl(data.twitterUrl)
          }
        })
        .catch(() => {})
    }
  }, [propLogoSrc, propInstagramUrl, propYoutubeUrl, propLinkedinUrl, propTwitterUrl])

  return (
    <footer className="bg-[#030614] text-white border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        
        {/* Tier 1: Primary Navigation & Social Links (Matching Screenshot 4) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-white/[0.08]">
          <div className="flex flex-col items-center lg:items-start gap-4">
            
            {/* Primary Nav Links with Subtle Center Dot Separators */}
            <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Story', href: '/about#story' },
                { label: 'Experiences', href: '/services' },
                { label: 'Fleet', href: '/cars' },
                { label: 'Concierge', href: '/contact' },
                { label: 'Partner', href: '/partner/list-fleet' },
                { label: 'Journal', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((item, index, arr) => (
                <li key={item.label} className="flex items-center gap-3 sm:gap-4 font-luxury">
                  <Link
                    href={item.href}
                    className="uppercase tracking-[0.25em] text-xs sm:text-[13px] text-white/90 hover:text-white transition duration-300"
                  >
                    {item.label}
                  </Link>
                  {index < arr.length - 1 && (
                    <span className="text-white/25 select-none" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Sub-row: Legal & Policy Links */}
            <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 sm:gap-x-4 gap-y-1 text-white/45">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy-policy' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Sitemap', href: '/sitemap.xml' },
              ].map((item, index, arr) => (
                <li key={item.label} className="flex items-center gap-3 sm:gap-4 font-sans">
                  <Link
                    href={item.href}
                    className="uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:text-white/80 transition"
                  >
                    {item.label}
                  </Link>
                  {index < arr.length - 1 && (
                    <span className="text-white/20 select-none" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons (Right Side, Matching Screenshot 4) */}
          <div className="flex items-center gap-6 text-white/80">
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="transition-transform duration-300 hover:scale-110 hover:text-white"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="transition-transform duration-300 hover:scale-110 hover:text-white"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="transition-transform duration-300 hover:scale-110 hover:text-white"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="transition-transform duration-300 hover:scale-110 hover:text-white"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Tier 2: 5-Column Clean Directory Grid (Matching Screenshot 4) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6 py-12 border-b border-white/[0.08] text-[11px] tracking-wide text-white/50 leading-relaxed font-sans">
          
          {/* Column 1: Chauffeur Mobility */}
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] tracking-[0.25em] text-white/80 font-luxury font-medium mb-1">
              Chauffeur Atelier
            </span>
            <Link href="/services/luxury-chauffeur" className="hover:text-white hover:underline transition">Luxury Car Rental Hyderabad</Link>
            <Link href="/services/luxury-chauffeur" className="hover:text-white hover:underline transition">Rolls-Royce Chauffeur Service</Link>
            <Link href="/services/luxury-chauffeur" className="hover:text-white hover:underline transition">Mercedes-Maybach VIP Hire</Link>
            <Link href="/services/wedding-events" className="hover:text-white hover:underline transition">Royal Wedding Car Rental</Link>
            <Link href="/services/intercity-cabs" className="hover:text-white hover:underline transition">Intercity Luxury Chauffeur</Link>
          </div>

          {/* Column 2: Self-Drive Exotics */}
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] tracking-[0.25em] text-white/80 font-luxury font-medium mb-1">
              Self-Drive Exotics
            </span>
            <Link href="/services/self-drive" className="hover:text-white hover:underline transition">Self-Drive Luxury Car Hyderabad</Link>
            <Link href="/services/self-drive" className="hover:text-white hover:underline transition">Ferrari & Supercar Rental</Link>
            <Link href="/services/self-drive" className="hover:text-white hover:underline transition">Porsche 911 Weekend Drive</Link>
            <Link href="/services/self-drive" className="hover:text-white hover:underline transition">Range Rover SUV Rental</Link>
            <Link href="/services/self-drive" className="hover:text-white hover:underline transition">Convertible Exotic Car Hire</Link>
          </div>

          {/* Column 3: Airport Concierge */}
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] tracking-[0.25em] text-white/80 font-luxury font-medium mb-1">
              Airport Concierge
            </span>
            <Link href="/services/pickup-dropoff" className="hover:text-white hover:underline transition">Shamshabad RGIA VIP Pickup</Link>
            <Link href="/services/pickup-dropoff" className="hover:text-white hover:underline transition">Hyderabad Airport Luxury Drop</Link>
            <Link href="/services/pickup-dropoff" className="hover:text-white hover:underline transition">60-Min Delay Guarantee</Link>
            <Link href="/services/pickup-dropoff" className="hover:text-white hover:underline transition">Private Aviation Hangar Transfer</Link>
            <Link href="/services/pickup-dropoff" className="hover:text-white hover:underline transition">White-Glove Tarmac Protocol</Link>
          </div>

          {/* Column 4: Key Locations */}
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] tracking-[0.25em] text-white/80 font-luxury font-medium mb-1">
              Prime Locations
            </span>
            <Link href="/cars" className="hover:text-white hover:underline transition">Luxury Car Jubilee Hills</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Luxury Car Banjara Hills</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Luxury Car HITEC City</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Luxury Car Gachibowli</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Luxury Car Financial District</Link>
          </div>

          {/* Column 5: Flagship Fleet */}
          <div className="flex flex-col gap-2">
            <span className="uppercase text-[10px] tracking-[0.25em] text-white/80 font-luxury font-medium mb-1">
              Elite Fleets
            </span>
            <Link href="/cars" className="hover:text-white hover:underline transition">Rolls-Royce Phantom VIII</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Mercedes-Maybach S680</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Bentley Continental GT</Link>
            <Link href="/cars" className="hover:text-white hover:underline transition">Lamborghini Urus Performante</Link>
            <Link href="/partner/list-fleet" className="hover:text-white hover:underline transition">List Your Fleet (Consignment)</Link>
          </div>
        </div>

        {/* Tier 3: Centered Brand Emblem, Hashtag & Copyright (Matching Screenshot 4) */}
        <div className="pt-10 flex flex-col items-center justify-center text-center">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <Image
              src={logoSrc}
              alt="DRIVEIT Luxury"
              width={160}
              height={60}
              className="h-10 sm:h-12 w-auto object-contain brightness-110"
            />
          </Link>
          
          <p className="mt-4 font-luxury text-xs sm:text-sm tracking-[0.3em] uppercase text-white/80">
            <span className="text-[var(--gold-400)]">#</span>luxurymobility
          </p>

          <p className="mt-3 font-sans text-[10px] sm:text-xs text-white/40 tracking-wider">
            Copyright © 2026 DRIVEIT Luxury Concierge Private Limited. Made in India
          </p>
        </div>

      </div>
    </footer>
  )
}