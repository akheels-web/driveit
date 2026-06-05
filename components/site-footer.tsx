'use client'

import Link from "next/link"
import { Car, Plane, Anchor, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "motion/react"

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  return (
    <footer ref={ref} className="mt-0 border-t border-[var(--luxury-border)] bg-[var(--luxury-bg)] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="DRIVEIT Logo"
              width={200}
              height={80}
              className="h-12 w-auto md:h-14"
              loading="lazy"
            />
          </Link>
          <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
            Luxury mobility & aviation experiences—anytime, anywhere. Premium transportation services proudly serving Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Madhapur, and all of Hyderabad.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="text-sm font-semibold text-white mb-4">Our Services</h4>
          <ul className="grid gap-2.5 text-sm text-zinc-400">
            <li>
              <Link href="/services/luxury-car-rental" className="hover:text-[var(--gold-400)] flex items-center gap-2 transition-colors duration-300">
                <Car className="w-3.5 h-3.5" />
                Luxury Car Rental
              </Link>
            </li>
            <li>
              <Link href="/services/private-jet-services" className="hover:text-[var(--gold-400)] flex items-center gap-2 transition-colors duration-300">
                <Plane className="w-3.5 h-3.5" />
                Private Jet Services
              </Link>
            </li>
            <li>
              <Link href="/services/yacht-services" className="hover:text-[var(--gold-400)] flex items-center gap-2 transition-colors duration-300">
                <Anchor className="w-3.5 h-3.5" />
                Yacht Services
              </Link>
            </li>
            <li>
              <Link href="/services/wedding-cars" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Wedding Cars
              </Link>
            </li>
            <li>
              <Link href="/services/luxury-buses" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Luxury Buses
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
          <ul className="grid gap-3 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>+91 83413 41186</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>info@driveit.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Hyderabad, India</span>
            </li>
          </ul>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul className="grid gap-2.5 text-sm text-zinc-400">
            <li>
              <Link href="/about" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Blog & Journal
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-[var(--gold-400)] transition-colors duration-300">
                Refund Policy
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
              © {new Date().getFullYear()} <a href="https://www.edonesolutions.in/" className="hover:text-[var(--gold-400)] transition-colors duration-300">Edone solutions</a>. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-5 text-sm text-zinc-500">
              <a href="#" className="hover:text-[var(--gold-400)] transition-colors duration-300">Instagram</a>
              <a href="#" className="hover:text-[var(--gold-400)] transition-colors duration-300">Facebook</a>
              <a href="#" className="hover:text-[var(--gold-400)] transition-colors duration-300">LinkedIn</a>
              <a href="#" className="hover:text-[var(--gold-400)] transition-colors duration-300">Twitter</a>
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