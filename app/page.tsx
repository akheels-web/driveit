import type { Metadata } from 'next'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Hero from "@/components/hero"
import { MarqueeStrip } from "@/components/marquee-strip"
import { Stats } from "@/components/stats"
import { Showcase } from "@/components/showcase"
import Mision from "@/components/Mision"
import { TrendingGrid } from "@/components/trending-grid"
import { ProcessTimeline } from "@/components/process-timeline"
import { BookingSection } from "@/components/booking-section"
import { FleetCarousel } from "@/components/fleet-carousel"
import Testomonials from "@/components/Testomonials"
import { FAQ } from "@/components/faq"
import { About } from "@/components/about"
import { TrustStrip } from "@/components/trust-strip"

export const metadata: Metadata = {
  title: "DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad | Book Online",
  description: "Book premium luxury cars in Hyderabad online. Choose from our elite fleet of Rolls Royce, Mercedes, BMW, Range Rover and more for weddings, corporate travel, airport transfers. Serving Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, and all Hyderabad areas.",
  keywords: [
    "luxury car rental Hyderabad",
    "premium car booking online",
    "wedding car rental Hyderabad",
    "chauffeur service Hyderabad",
    "airport transfer Hyderabad",
    "Rolls Royce rental Hyderabad",
    "Mercedes rental Hyderabad",
    "BMW rental Hyderabad",
    "Range Rover rental Hyderabad",
    "luxury bus hire Hyderabad",
    "corporate car rental Hyderabad",
    "private jet Hyderabad",
    "self drive cars Hyderabad",
    "luxury car Jubilee Hills",
    "car rental Banjara Hills",
    "car rental HITEC City",
    "car rental Gachibowli",
    "car rental Madhapur",
    "car rental Kondapur",
    "wedding car Shamshabad",
    "airport taxi Hyderabad",
    "luxury cab Hyderabad",
  ],
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[var(--luxury-bg)] text-zinc-100">
        {/* Hero — Full viewport cinematic */}
        <section id="home">
          <Hero />
          <MarqueeStrip />
          <Stats />
        </section>

        {/* Booking — Primary CTA */}
        <BookingSection />
        
        {/* Trust & Promos */}
        <TrustStrip />

        {/* Showcase & Mission */}
        <section id="services">
          <Showcase />
          <Mision />
          <TrendingGrid />
          <ProcessTimeline />
        </section>

        {/* Fleet */}
        <FleetCarousel />

        {/* Social Proof & Info */}
        <section id="about">
          <Testomonials />
          <FAQ />
          <About />
        </section>

        {/* Footer */}
        <SiteFooter />
      </main>
    </>
  )
}
