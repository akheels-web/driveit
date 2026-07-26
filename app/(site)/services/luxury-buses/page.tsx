import { metadata } from './metadata'
export { metadata }
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import HScroll from "@/components/HScroll"
import { Bus, ShieldCheck, Crown, MapPin, Phone, Stars, MessageCircle, ArrowRight, Sparkles, Clock, Users, Wifi, Utensils } from "lucide-react"

const GOLD = '#b48811'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LuxuryBusesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Luxury Bus & Coach Rental Service Hyderabad",
    "description": "Hire luxury buses and coaches in Hyderabad. Perfect for corporate events, weddings, family group travel, and outstation tours with professional drivers.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "DRIVEIT Luxury",
      "url": "https://www.driveitluxury.com"
    },
    "areaServed": {
      "@type": "State",
      "name": "Telangana"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <SiteHeader />
      <main className="bg-black text-zinc-100">
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center">
          <Image
            src="https://i.pinimg.com/1200x/d8/f0/0a/d8f00a84676313b515b180db1353d902.jpg"
            alt="Luxury bus hero"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <MapPin className="w-4 h-4" style={{ color: GOLD }} />
                Hyderabad, India
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
                LUXURY BUSES Rental in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-3xl mx-auto">
                Travel in comfort & style with DriveItCars – perfect for weddings, corporate trips, family tours, and group travel.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 md:px-8 py-3 text-black font-medium rounded-full text-sm md:text-base hover:scale-105 transition"
                  style={{ backgroundColor: GOLD }}
                >
                  Book Now
                </Link>
                <a
                  href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20bus%20in%20Hyderabad."
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full border border-neutral-700 hover:border-gold text-zinc-200 hover:text-gold transition text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4" style={{ color: GOLD }} />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Luxury Buses in Hyderabad</h2>
            <p className="text-base text-zinc-300 leading-relaxed">
              Book LUXURY BUSES with DriveItCars in Hyderabad. From 30-seaters to 50-seaters, our well-maintained fleet ensures smooth and relaxing rides. Perfect for corporate events, weddings, family trips, or sightseeing tours, our buses come with premium amenities like AC, recliner seats, entertainment systems, and spacious interiors. Enjoy luxury travel at competitive prices with professional drivers and flexible bookings.
            </p>
          </div>
        </section>

        {/* BUS OPTIONS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Our Luxury Bus Fleet</h2>
            <p className="mt-2 text-sm text-zinc-400">Premium buses for every group size and occasion.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 30 Seater */}
            <div className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-surface">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://i.pinimg.com/1200x/86/ab/68/86ab68142fa922be172856a8bb08000f.jpg"
                  alt="Luxury 30-seater bus rental Hyderabad"
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-medium text-white">30 Seater</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Luxury Bus – 30 Seater</h3>
                <p className="text-sm text-zinc-400 mb-4">Spacious interiors, AC, entertainment system</p>
                <div className="flex gap-2">
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-full"
                    style={{ backgroundColor: GOLD, color: '#000' }}
                  >
                    Book Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%2030-seater%20luxury%20bus%20in%20Hyderabad."
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/20 text-xs text-white/90 hover:text-gold hover:border-gold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 35 Seater */}
            <div className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-surface">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://i.pinimg.com/736x/d0/5c/80/d05c800fb00a1ab015294c8a0020a3f8.jpg"
                  alt="Luxury 35-seater coach hire Hyderabad"
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-medium text-white">35 Seater</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Luxury Bus – 35 Seater </h3>
                <p className="text-sm text-zinc-400 mb-4">Perfect for medium groups with comfort & safety</p>
                <div className="flex gap-2">
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-full"
                    style={{ backgroundColor: GOLD, color: '#000' }}
                  >
                    Book Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%2035-seater%20luxury%20bus%20in%20Hyderabad."
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/20 text-xs text-white/90 hover:text-gold hover:border-gold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 50 Seater */}
            <div className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-surface">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://i.pinimg.com/736x/f2/e4/67/f2e467f893e9cb305ef50924f25656ab.jpg"
                  alt="Luxury 50-seater wedding bus Hyderabad"
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-medium text-white">50 Seater</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Luxury Bus – 50 Seater </h3>
                <p className="text-sm text-zinc-400 mb-4">Ideal for weddings, corporate events & tours</p>
                <div className="flex gap-2">
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-full"
                    style={{ backgroundColor: GOLD, color: '#000' }}
                  >
                    Book Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%2050-seater%20luxury%20bus%20in%20Hyderabad."
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/20 text-xs text-white/90 hover:text-gold hover:border-gold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose DriveItCars?</h2>
            <p className="mt-2 text-sm text-zinc-400">Your trusted partner for luxury bus rentals in Hyderabad.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Bus className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Drivers</h3>
              <p className="text-sm text-zinc-400">Experienced, licensed drivers ensuring safe and comfortable journeys.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Premium Interiors & Safety</h3>
              <p className="text-sm text-zinc-400">Well-maintained buses with modern amenities and safety features.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Crown className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Affordable Luxury Pricing</h3>
              <p className="text-sm text-zinc-400">Competitive rates without compromising on quality and comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Clock className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Hyderabad Service</h3>
              <p className="text-sm text-zinc-400">Round-the-clock availability for all your travel needs.</p>
            </div>
          </div>
        </section>

        {/* BOOKING CTA */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 min-h-[500px] md:min-h-[600px]">
            <Image
              src="/luxury-coach-interior-black-gold.png"
              alt="Luxury coach interior with premium seats Hyderabad"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80" />

            <div className="relative z-10 p-6 md:p-10 flex items-center justify-center min-h-full">
              <div className="w-full max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                  Book Your Luxury Bus in Hyderabad Today
                </h2>
                <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
                  Experience premium comfort and style for your next group journey.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="tel:+918341341186"
                    className="px-8 py-4 rounded-full border border-white/20 hover:border-gold text-zinc-200 hover:text-gold transition text-base inline-flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" style={{ color: GOLD }} />
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20bus%20in%20Hyderabad."
                    target="_blank"
                    className="px-8 py-4 text-black font-medium rounded-full text-base hover:scale-105 transition inline-flex items-center gap-2"
                    style={{ backgroundColor: GOLD }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Us
                  </a>
                  <Link
                    href="/contact"
                    className="px-8 py-4 text-black font-medium rounded-full text-base hover:scale-105 transition inline-flex items-center gap-2"
                    style={{ backgroundColor: GOLD }}
                  >
                    Book Online
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
