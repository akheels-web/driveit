'use client';

import { ArrowRight, Car, Clock, Shield, Users, CheckCircle, ChevronLeft, ChevronRight, Phone, MapPin, Stars, Sparkles, Plane, Building, Crown, ShieldCheck } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ServiceFleetShowcase } from "@/components/service-fleet-showcase"

const GOLD = '#b48811'

export default function PickupDropoffPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Premium Pickup & Dropoff Service Hyderabad",
    "description": "Exclusive door-to-door luxury car pickup and drop-off service for airports, hotels, executive business meetings, and premium events in Hyderabad.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "DRIVEIT Luxury",
      "url": "https://www.driveitluxury.in"
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
            src="https://i.pinimg.com/1200x/83/8b/0e/838b0e74f94eeda365aaf1e0c71bf0f8.jpg"
            alt="Luxury pickup service hero"
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
                Premium Pickup & Dropoff in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300">
                Door-to-door luxury car service for airports, hotels, events, and business meetings.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 md:px-8 py-3 text-black font-medium rounded-full text-sm md:text-base hover:scale-105 transition"
                  style={{ backgroundColor: GOLD }}
                >
                  Book Pickup Service
                </Link>
                <a
                  href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20pickup%20and%20dropoff%20service%20in%20Hyderabad."
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-full border border-neutral-700 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] text-zinc-200 transition text-sm md:text-base font-medium"
                >
                  <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* PICKUP & DROPOFF SERVICE TYPES */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Our Pickup & Dropoff Services</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-left">
              
              {/* Airport Transfers */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Plane className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-medium text-white">Airport Transfers</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Professional pickup and dropoff service to/from RGIA Airport with flight tracking and meet & greet service.
                </p>
              </div>

              {/* Hotel Transfers */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Building className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-medium text-white">Hotel Transfers</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Seamless transfers between hotels, resorts, and luxury accommodations across Hyderabad with VIP treatment.
                </p>
              </div>

              {/* Event Pickup */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Stars className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-medium text-white">Event Transfers</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Special occasion pickups for weddings, corporate events, parties, and celebrations with red-carpet service.
                </p>
              </div>

              {/* Business Meetings */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Crown className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-medium text-white">Business Transfers</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Executive pickup service for business meetings, conferences, and corporate travel with punctual arrivals.
                </p>
              </div>

            </div>

            {/* Service Coverage & Timing */}
            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white mb-2">Service Coverage</h3>
                <p className="text-2xl font-semibold" style={{ color: GOLD }}>All Hyderabad</p>
                <p className="text-sm text-zinc-400 mt-2">Complete city coverage including suburbs and outskirts</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white mb-2">Service Hours</h3>
                <p className="text-2xl font-semibold" style={{ color: GOLD }}>24/7 Available</p>
                <p className="text-sm text-zinc-400 mt-2">Round-the-clock service for all your travel needs</p>
              </div>
            </div>
          </div>
        </section>

        {/* THREE FEATURE BOXES */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Professional Chauffeurs</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Licensed, uniformed chauffeurs with local expertise and punctual service for all pickup and dropoff needs.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Car className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Luxury Fleet</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Premium sedans, SUVs, and luxury vehicles maintained to the highest standards for comfortable transfers.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Crown className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Reliable Service</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                On-time arrivals, flight tracking, and real-time updates ensuring stress-free travel experiences.
              </p>
            </div>
          </div>
        </section>

        {/* LUXURY SUVS FOR PICKUP & DROPOFF — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Luxury SUVs for Pickup & Dropoff</h3>
            <p className="mt-2 text-sm text-zinc-400">Spacious and comfortable SUVs perfect for airport transfers and group pickups.</p>
          </div>
          <div className="mt-8 relative">
            <ServiceFleetShowcase 
              carNames={[
                "BMW 520D", "Lamborghini Gallardo", "Lexus ES 300H", "Mercedes S 350",
                "KIA Carnival", "Mercedes GLS 350D", "Mini Cooper Countryman", 
                "Toyota Commuter (Custom)", "Toyota Crysta MT", "Toyota Fortuner",
                "Toyota Vellfire", "Volvo XC60", "Audi Q7 Quatro", "Mercedes S 450",
                "Mercedes G 350 Wagon", "Mercedes GLS 400D", "Mercedes V-Class",
                "Range Rover Vogue", "Volvo S90", "Volvo XC 90", "BMW 730 LD",
                "BMW i4", "Mercedes C300 Convertible", "Mercedes E 220D", "Toyota Camry",
                "Volvo S60 D5", "Audi A6", "Audi RS5 QUATRO"
              ]}
            />
          </div>
        </section>

        {/* LUXURY SEDANS FOR PICKUP & DROPOFF — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Luxury Sedans for Pickup & Dropoff</h3>
            <p className="mt-2 text-sm text-zinc-400">Executive sedans ideal for business meetings and airport transfers.</p>
          </div>
          <div className="mt-8 relative">
            <ServiceFleetShowcase 
              carNames={[
                "BMW 520D", "Lamborghini Gallardo", "Lexus ES 300H", "Mercedes S 350",
                "Mercedes S 450", "Toyota Camry", "Volvo S60 D5", "Audi A6", "Audi RS5 QUATRO"
              ]}
            />
          </div>
        </section>

        {/* TRENDING CARS FOR PICKUP & DROPOFF — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Trending Cars for Pickup & Dropoff</h2>
            <p className="mt-2 text-sm text-zinc-400">Popular luxury vehicles perfect for all your pickup and dropoff needs.</p>
          </div>
          <div className="mt-8 relative">
            <ServiceFleetShowcase 
              carNames={[
                "Mercedes G 350 Wagon", "Mercedes GLS 400D", "Mercedes V-Class",
                "Range Rover Vogue", "Volvo S90", "Volvo XC 90", "BMW 730 LD",
                "BMW i4", "Mercedes C300 Convertible", "Mercedes E 220D",
              ]}
            />
          </div>
        </section>

        {/* PICKUP SERVICE PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: GOLD }}>How Our Pickup Service Works</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Simple steps to seamless door-to-door luxury transportation.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Book Service</h3>
              <p className="text-sm text-zinc-400">
                Call or WhatsApp with your pickup location, destination, and preferred time.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Car className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Vehicle Assigned</h3>
              <p className="text-sm text-zinc-400">
                We assign the perfect luxury vehicle and professional chauffeur for your journey.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Real-time Updates</h3>
              <p className="text-sm text-zinc-400">
                Receive live tracking and updates about your chauffeur's arrival time.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Stars className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Luxury Travel</h3>
              <p className="text-sm text-zinc-400">
                Enjoy a comfortable, safe journey with premium amenities and service.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: GOLD }}>Why Choose Our Pickup Service</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Reliability, luxury, and convenience for all your transportation needs.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">Always On Time</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Punctual arrivals with flight tracking and traffic monitoring for stress-free travel.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">Licensed Chauffeurs</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Professional, uniformed drivers with extensive local knowledge and safety training.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Crown className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">VIP Treatment</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Meet & greet service, luggage assistance, and personalized attention throughout.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Car className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">Premium Fleet</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Latest luxury vehicles with climate control, Wi-Fi, and premium amenities.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">City-wide Coverage</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Complete Hyderabad coverage including airport, hotels, and business districts.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Stars className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium">24/7 Support</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Round-the-clock customer service and emergency assistance for peace of mind.
              </p>
            </div>
          </div>
        </section>

     
        {/* BOOKING PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 min-h-[420px] md:min-h-[520px]">
            <Image
              src="/black-chauffeur-sedan-night-city.png"
              alt="Luxury chauffeur pickup booking banner Hyderabad"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80" />

            <div className="relative z-10 p-6 md:p-10 flex items-center justify-center min-h-full">
              <div className="w-full max-w-4xl">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">Simple Booking Process</h2>
                  <p className="mt-2 text-sm text-zinc-300">Effortless steps to your premium ride.</p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { t: "Step 1: Choose Car", d: "Pick your preferred luxury model." },
                    { t: "Step 2: Contact Us", d: "Call or WhatsApp for instant assistance." },
                    { t: "Step 3: Confirm Booking", d: "Receive your itinerary and confirmation." },
                    { t: "Step 4: Enjoy Ride", d: "Sit back and experience true luxury." },
                  ].map((s) => (
                    <div key={s.t} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
                        </div>
                        <h3 className="font-medium text-white text-sm">{s.t}</h3>
                      </div>
                      <p className="mt-2 text-xs text-zinc-300">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-4 mt-12 pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800">
            <Image
              src="/black-chauffeur-sedan-night-city.png"
              alt="Premium chauffeur sedan pickup and dropoff Hyderabad"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
              className="object-cover opacity-30"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
            <div className="relative z-10 p-6 md:p-10 flex justify-center">
              <div className="w-full max-w-2xl rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-6 md:px-10 md:py-8 text-center shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  Book Your Luxury Car Today
                </h2>
                <p className="mt-2 text-sm text-zinc-200/90">
                  Hyderabad's finest fleet, ready when you are.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <a
                    href="tel:+916300041186"
                    className="px-6 md:px-8 py-3 rounded-full border border-white/20 hover:border-gold text-zinc-200 hover:text-gold transition text-sm md:text-base inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" style={{ color: GOLD }} />
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20car%20in%20Hyderabad."
                    target="_blank"
                    className="px-6 md:px-8 py-3 text-black font-medium rounded-full text-sm md:text-base hover:scale-105 transition inline-flex items-center gap-2"
                    style={{ backgroundColor: GOLD }}
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp Us
                  </a>
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
