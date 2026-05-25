import Link from "next/link"
import { Car, Plane, Anchor, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-black text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4">
        {/* Company Info */}
        <div>
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
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Luxury mobility & aviation experiences—anytime, anywhere. Premium transportation services in Hyderabad, India.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Our Services</h4>
          <ul className="grid gap-2 text-sm text-zinc-300">
            <li>
              <Link href="/services/luxury-car-rental" className="hover:text-gold flex items-center gap-2">
                <Car className="w-4 h-4" />
                Luxury Car Rental
              </Link>
            </li>
            <li>
              <Link href="/services/private-jet-services" className="hover:text-gold flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Private Jet Services
              </Link>
            </li>
            <li>
              <Link href="/services/yacht-services" className="hover:text-gold flex items-center gap-2">
                <Anchor className="w-4 h-4" />
                Yacht Services
              </Link>
            </li>
            <li>
              <Link href="/services/wedding-cars" className="hover:text-gold">
                Wedding Cars
              </Link>
            </li>
            <li>
              <Link href="/services/luxury-buses" className="hover:text-gold">
                Luxury Buses
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
          <ul className="grid gap-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" />
              <span>+91 83413 41186</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              <span>info@driveit.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Hyderabad, India</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul className="grid gap-2 text-sm text-zinc-300">
            <li>
              <Link href="/about" className="hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-gold">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-gold">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-xs text-zinc-500">
              © {new Date().getFullYear()} <a href="https://www.edonesolutions.in/">Edone solutions</a>. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <a href="#" className="hover:text-gold transition-colors">Instagram</a>
              <a href="#" className="hover:text-gold transition-colors">Facebook</a>
              <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gold transition-colors">Twitter</a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-gold transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cookies-policy" className="hover:text-gold transition-colors">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}