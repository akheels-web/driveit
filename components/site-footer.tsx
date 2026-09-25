'use client'

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "motion/react"

import { useState, useEffect } from 'react'

export function SiteFooter({
  logoSrc: propLogoSrc,
  description: propDescription,
  phone: propPhone,
  email: propEmail,
  address: propAddress,
  instagramUrl: propInstagramUrl,
  facebookUrl: propFacebookUrl,
  linkedinUrl: propLinkedinUrl,
  twitterUrl: propTwitterUrl,
}: {
  logoSrc?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  instagramUrl?: string
  facebookUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
} = {}) {
  const [logoSrc, setLogoSrc] = useState(propLogoSrc || '/logo.png')
  const [description, setDescription] = useState(
    propDescription ||
      'Luxury mobility & aviation experiences—anytime, anywhere. Premium transportation services proudly serving Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Madhapur, and all of Hyderabad.',
  )
  const [instagramUrl, setInstagramUrl] = useState(propInstagramUrl || 'https://instagram.com/driveitluxury')
  const [facebookUrl, setFacebookUrl] = useState(propFacebookUrl || 'https://facebook.com/driveitluxury')
  const [linkedinUrl, setLinkedinUrl] = useState(propLinkedinUrl || 'https://linkedin.com/company/driveitluxury')
  const [twitterUrl, setTwitterUrl] = useState(propTwitterUrl || 'https://twitter.com/driveitluxury')

  useEffect(() => {
    if (propLogoSrc) setLogoSrc(propLogoSrc)
    if (propDescription) setDescription(propDescription)
    if (propInstagramUrl) setInstagramUrl(propInstagramUrl)
    if (propFacebookUrl) setFacebookUrl(propFacebookUrl)
    if (propLinkedinUrl) setLinkedinUrl(propLinkedinUrl)
    if (propTwitterUrl) setTwitterUrl(propTwitterUrl)

    if (!propLogoSrc || !propDescription) {
      fetch('/api/site-settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (!propLogoSrc && data.footerLogo) setLogoSrc(data.footerLogo)
            if (!propDescription && data.footerDescription) setDescription(data.footerDescription)
            if (!propInstagramUrl && data.instagramUrl) setInstagramUrl(data.instagramUrl)
            if (!propFacebookUrl && data.facebookUrl) setFacebookUrl(data.facebookUrl)
            if (!propLinkedinUrl && data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
            if (!propTwitterUrl && data.twitterUrl) setTwitterUrl(data.twitterUrl)
          }
        })
        .catch(() => {})
    }
  }, [propLogoSrc, propDescription, propInstagramUrl, propFacebookUrl, propLinkedinUrl, propTwitterUrl])

  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  return (
    <footer ref={ref} className="mt-0 border-t border-[var(--luxury-border)] bg-[var(--luxury-bg)] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0 }}
          className="flex flex-col gap-4"
        >
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt="DRIVEIT Logo"
              width={200}
              height={80}
              className="h-12 w-auto md:h-14"
              loading="lazy"
              unoptimized={logoSrc.startsWith('http')}
            />
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Fleet Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-6 border-b border-white/5 pb-2">
            FLEET
          </h4>
          <ul className="space-y-3.5 text-sm text-zinc-400">
            <li>
              <Link href="/cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Luxury Cars
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> SUVs
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Executive Cars
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Mini Vans
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Coaches
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Services Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-6 border-b border-white/5 pb-2">
            SERVICES
          </h4>
          <ul className="space-y-3.5 text-sm text-zinc-400">
            <li>
              <Link href="/services/luxury-car-rental" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Chauffeur Driven Cars
              </Link>
            </li>
            <li>
              <Link href="/services/luxury-car-rental" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Self Drive Car
              </Link>
            </li>
            <li>
              <Link href="/services/corporate-car-rental" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Corporate Car Rental
              </Link>
            </li>
            <li>
              <Link href="/services/wedding-cars" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Wedding Cars
              </Link>
            </li>
            <li>
              <Link href="/services/yacht-services" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Yacht Services
              </Link>
            </li>
            <li>
              <Link href="/services/private-jet-services" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Private Jet Services
              </Link>
            </li>
            <li>
              <Link href="/services/pickup-dropoff" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Pickup & Dropoff
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Links Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-6 border-b border-white/5 pb-2">
            QUICK LINKS
          </h4>
          <ul className="space-y-3.5 text-sm text-zinc-400">
            <li>
              <Link href="/about" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Blog & Journal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300 flex items-center">
                <span className="text-[var(--gold-400)] mr-2 font-light">›</span> Refund Policy
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-xs text-zinc-600">
              © {new Date().getFullYear()} <a href="https://www.digitalvint.com" className="hover:text-[var(--gold-400)] transition-colors duration-300">Digitalvint</a>. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-5 text-sm text-zinc-500">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold-400)] transition-colors duration-300">Instagram</a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold-400)] transition-colors duration-300">Facebook</a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold-400)] transition-colors duration-300">LinkedIn</a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold-400)] transition-colors duration-300">Twitter</a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/privacy-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Terms & Conditions
              </Link>
              <Link href="/cookies-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}