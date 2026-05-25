"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Car, Plane, Anchor, Phone, Crown } from "lucide-react"
import Image from "next/image"
const nav = [
  { href: "/", label: "Home" },
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
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-zinc-100">
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
                <div className="flex items-center gap-1 text-sm text-zinc-300 hover:text-gold cursor-pointer py-2">
                  <span>{item.label}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown Menu with improved hover area */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-black/95 backdrop-blur-sm border border-neutral-800 rounded-lg shadow-xl p-3 min-w-[200px]">
                    <ul className="grid gap-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link 
                            href={c.href} 
                            className="block px-3 py-2 text-sm text-zinc-300 hover:text-gold hover:bg-white/10 rounded-md transition-colors"
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
                className="text-sm text-zinc-300 hover:text-gold flex items-center gap-1 py-2"
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
            href="/contact" 
            className="flex items-center gap-2 text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: '#b48811' }}
          >
            <Phone className="w-4 h-4" />
            Contact Us
          </Link>
        </div>

        <button
          aria-label="Toggle Menu"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-neutral-800 p-2 text-zinc-300 hover:text-gold"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-800 bg-black text-zinc-100">
          <div className="mx-auto max-w-6xl px-4 py-4 grid gap-3">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href}>
                  <button
                    className="w-full text-left text-zinc-300 hover:text-gold flex items-center justify-between py-2"
                    onClick={() => setServicesOpen((v) => !v)}
                    aria-expanded={servicesOpen}
                  >
                    {item.label}
                    <span className={cn("transition-transform", servicesOpen ? "rotate-180" : "")}>⌄</span>
                  </button>
                  {servicesOpen && (
                    <ul className="mt-2 grid gap-2 pl-4 border-l border-neutral-800">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block text-sm text-zinc-300 hover:text-gold py-1">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="text-zinc-300 hover:text-gold flex items-center gap-2 py-2"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ),
            )}
            
            {/* Mobile Call to Action */}
            <div className="pt-2 border-t border-neutral-800">
              <Link 
                href="/contact" 
                className="flex items-center gap-2 text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all duration-300 justify-center"
                style={{ backgroundColor: '#b48811' }}
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}