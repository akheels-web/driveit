import { metadata } from './metadata'
export { metadata }
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, Lock, Clock, Plane, Wifi, Utensils, User, Stars, Phone, MessageCircle, MapPin, PawPrint, Crown } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"


export default function PrivateJetServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Luxury Private Jet Charters Hyderabad",
    "description": "On-demand VIP private jet and aviation charter services from Begumpet and Rajiv Gandhi International Airport in Hyderabad.",
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
        {/* 1) HERO */}
        <section className="relative min-h-[92vh] flex items-center">
              <Image
            src="https://i.pinimg.com/1200x/f5/03/b8/f503b886eaa87abdfc8d3aa0a19e80cf.jpg"
            alt="Luxury private jet at Hyderabad airport at night"
            fill
            priority
            className="object-cover opacity-60"
          />
          {/* HERO container: center + home width */}
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <MapPin className="w-4 h-4 text-gold" />
                Hyderabad, India • Begumpet & RGIA
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Luxury Private Jet Charters in{" "}
                <span style={{ color: '#b48811' }}>Hyderabad</span>
              </h1>
              <p className="mt-4 mx-auto max-w-2xl text-zinc-300 text-base md:text-lg">
                Exclusive, Comfortable, and On-Demand Travel.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#booking"
                  className="px-6 md:px-8 py-3 text-black font-medium rounded-full shadow transition text-sm md:text-base hover:scale-105 hover:brightness-110"
                  style={{ backgroundColor: '#b48811' }}
                >
                  Book Now / Get a Quote
                </a>
                <a
                  href="tel:+918341341186"
                  className="px-6 py-3 text-sm md:text-base rounded-full border border-neutral-700 hover:border-gold text-zinc-200 hover:text-gold transition"
                >
                  Call: +91 83413 41186
                </a>
              </div>
            </div>
          </div>
        </section>

{/* Types & Models — centered, 2-up, taller cards, glass labels */}
<div className="mx-auto max-w-7xl px-4 mt-12 border-t border-neutral-800 pt-10">
  <div className="text-center max-w-2xl mx-auto">
    <h3 className="text-2xl md:text-3xl font-semibold text-gold">Types & Models</h3>
    <p className="mt-2 text-sm text-zinc-400">A refined selection for Hyderabad routes.</p>
  </div>

  {/* Business Airliners */}
  <div className="mt-8">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Business Airliners</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Airbus Corporate Jet</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Ultra-long range business airliner for intercontinental travel</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 19-30 passengers</div>
          <div>• Range: 6,000+ nautical miles</div>
          <div>• Features: Full flat beds, conference room, luxury amenities</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Boeing Business Jet</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Premium business jet with exceptional range and comfort</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 25-50 passengers</div>
          <div>• Range: 6,200+ nautical miles</div>
          <div>• Features: Private suites, dining area, office space</div>
        </div>
      </div>
    </div>
  </div>

  {/* Super Large Jets */}
  <div className="mt-10">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Super Large Jets</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Falcon 900 / 6X / 7X / 8X</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Ultra-long range jets with exceptional performance</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 12-16 passengers</div>
          <div>• Range: 5,000-7,500 nautical miles</div>
          <div>• Features: Three living areas, full galley, luxury interiors</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Global 5000 / 6000 / 7500</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Premium long-range jets with advanced technology</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 13-17 passengers</div>
          <div>• Range: 5,200-7,700 nautical miles</div>
          <div>• Features: Ka-band connectivity, luxury cabin, advanced avionics</div>
        </div>
      </div>
    </div>
  </div>

  {/* Large Jets */}
  <div className="mt-10">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Large Jets</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Challenger 604 / 605 / 650</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Spacious cabin with transcontinental range</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 9-12 passengers</div>
          <div>• Range: 4,000-4,100 nautical miles</div>
          <div>• Features: Stand-up cabin, full galley, baggage compartment</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Falcon 2000</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Versatile long-range jet with excellent performance</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 8-10 passengers</div>
          <div>• Range: 3,350-4,000 nautical miles</div>
          <div>• Features: Wide cabin, advanced avionics, fuel efficiency</div>
        </div>
      </div>
    </div>
  </div>

  {/* Mid-size Jets */}
  <div className="mt-10">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Mid-size Jets</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Challenger 300 / 350</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Popular mid-size jets with excellent range and comfort</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 8-10 passengers</div>
          <div>• Range: 3,100-3,200 nautical miles</div>
          <div>• Features: Flat floor cabin, large windows, quiet operation</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Citation Longitude</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Modern super-midsize jet with advanced technology</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 8-12 passengers</div>
          <div>• Range: 3,500 nautical miles</div>
          <div>• Features: Flat floor, large cabin, advanced avionics</div>
        </div>
      </div>
    </div>
  </div>

  {/* Super Light • Light & VLJ */}
  <div className="mt-10">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Super Light • Light & VLJ</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Citation XLS / XLS+</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Reliable super-light jets for regional travel</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 9-12 passengers</div>
          <div>• Range: 2,100 nautical miles</div>
          <div>• Features: Stand-up cabin, proven reliability, cost-effective</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Phenom 100</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Entry-level jet with modern amenities</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 4-7 passengers</div>
          <div>• Range: 1,178 nautical miles</div>
          <div>• Features: Single pilot operation, modern avionics, fuel efficient</div>
        </div>
      </div>
    </div>
  </div>

  {/* Turboprops */}
  <div className="mt-10">
    <h4 className="text-xs md:text-sm font-medium text-zinc-400 tracking-wide uppercase text-center">Turboprops</h4>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">King Air 350</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Versatile turboprop for short to medium range flights</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 9-11 passengers</div>
          <div>• Range: 1,806 nautical miles</div>
          <div>• Features: Proven reliability, short runway capability, cost-effective</div>
        </div>
      </div>
      <div className="group p-6 rounded-2xl border border-neutral-800 bg-white/5 backdrop-blur-sm hover:border-gold/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-white">Pilatus PC‑12</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">Single-engine turboprop with exceptional versatility</p>
        <div className="space-y-2 text-xs text-zinc-500">
          <div>• Capacity: 6-9 passengers</div>
          <div>• Range: 1,803 nautical miles</div>
          <div>• Features: Single pilot operation, cargo door, unpaved runway capability</div>
        </div>
      </div>
    </div>
  </div>

  {/* Capacity & Flight Time — compact visual */}
  <div className="mt-10 relative rounded-2xl overflow-hidden border border-neutral-800">
    <Image src="/gulfstream-g650-private-jet-on-tarmac-night.png" alt="Range & capacity" fill loading="lazy" className="object-cover" />
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative z-10 grid sm:grid-cols-2 gap-4 p-6 md:p-8">
      <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
        <div className="text-xs text-zinc-400">Capacity</div>
        <div className="mt-1 text-lg font-medium text-zinc-100">12 – 30 passengers</div>
      </div>
      <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
        <div className="text-xs text-zinc-400">Typical Flight Time</div>
        <div className="mt-1 text-lg font-medium text-zinc-100">Up to 12 hours</div>
      </div>
    </div>
  </div>

{/* service */}

<div>
  <section className="mx-auto max-w-7xl px-4 mt-12 py-12 space-y-10">
    {/* Row 1: Image Left, Content Right */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="group relative h-64 md:h-[420px] rounded-2xl overflow-hidden border border-neutral-800">
        <Image
          src="/gulfstream-g650-private-jet-on-tarmac-night.png"
          alt="Premium private jet cabin service Hyderabad"
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold">
          <span className="text-gold">HIGH QUALITY SERVICE</span>
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          Personalized, discreet, and detail‑driven—crafted to exceed expectations on every Hyderabad route.
        </p>
      </div>
    </div>

    {/* Row 2: Content Left, Image Right */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h3 className="text-xl md:text-2xl font-semibold text-white">EXCLUSIVE DINING</h3>
        <p className="mt-2 text-sm text-zinc-400">Gourmet menus, bespoke beverages, curated to taste.</p>
      </div>
      <div className="order-1 md:order-2 group relative h-64 md:h-[420px] rounded-2xl overflow-hidden border border-neutral-800">
        <Image
          src="/3.jpg"
          alt="Exclusive in flight dining private jet Hyderabad"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>

    {/* Row 3: Image Left, Content Right */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="group relative h-64 md:h-[420px] rounded-2xl overflow-hidden border border-neutral-800">
        <Image
          src="/4.jpg"
          alt="Luxury private jet cabin interior Hyderabad departures"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-white">LUXURY ON AIR</h3>
        <p className="mt-2 text-sm text-zinc-400">Quiet cabins, lie‑flat seats, fine linens, designer amenities.</p>
      </div>
    </div>

    {/* Row 4: Content Left, Image Right */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h3 className="text-xl md:text-2xl font-semibold text-white">PET FRIENDLY</h3>
        <p className="mt-2 text-sm text-zinc-400">Comfortable arrangements and compliant handling.</p>
      </div>
      <div className="order-1 md:order-2 group relative h-64 md:h-[420px] rounded-2xl overflow-hidden border border-neutral-800">
        <Image
          src="/2.jpg"
          alt="Pet friendly private jet charter Hyderabad"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>

    {/* Row 5: Image Left, Content Right */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="group relative h-64 md:h-[420px] rounded-2xl overflow-hidden border border-neutral-800">
        <Image
          src="https://i.pinimg.com/736x/64/fb/5e/64fb5e82d7e9128ce78783f6d6e8998e.jpg"
          alt="VIP private jet ground transfers Hyderabad"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-white">VIP GROUND TRANSFERS</h3>
        <p className="mt-2 text-sm text-zinc-400">Door‑to‑jet luxury with chauffeur‑driven arrivals.</p>
      </div>
    </div>
  </section>
</div>
  
</div>
               {/* 3) WHY CHOOSE US */}
               <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gold">Why Choose Us</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Safety, privacy, and convenience—optimized for Hyderabad departures.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">Certified Pilots</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Experienced, type‑rated crews adhering to global safety standards.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">Full Privacy</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Discreet handling, private lounges, and confidential itineraries.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">24/7 Concierge</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                On‑demand scheduling, VIP transfers, and tailored cabin service.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Stars className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">VIP Experience</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Luxury interiors, fine dining, and curated in‑flight experiences.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">Hyderabad Advantage</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Operations from Begumpet and Rajiv Gandhi International Airport.
              </p>
            </div>
          </div>
        </section>
    

      </main>

      {/* Contact Section */}
      <section className="bg-[var(--luxury-bg)] pb-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Inquire About Private Jets
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Get a personalised quote from our aviation team.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </>
  )
}