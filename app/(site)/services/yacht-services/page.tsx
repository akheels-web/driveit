import { metadata } from './metadata'
export { metadata }
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, Lock, Clock, Anchor, Wifi, Utensils, User, Stars, Phone, MessageCircle, MapPin, PawPrint, Crown, Ship, Waves, Compass } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"


export default function YachtServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Luxury Yacht Charters Hyderabad",
    "description": "Premium luxury yacht charter and rental services on Hussain Sagar Lake and key marinas in Hyderabad.",
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
            src="https://i.pinimg.com/1200x/05/c3/3c/05c33c388fa4223c6282d93d36ae3904.jpg"
            alt="Luxury yacht at marina in Hyderabad at night"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <Anchor className="w-4 h-4 text-gold" />
                Hyderabad, India • Hussain Sagar Lake & Premium Marinas
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Luxury Yacht Charters in{" "}
                <span style={{ color: '#b48811' }}>Hyderabad</span>
              </h1>
              <p className="mt-4 mx-auto max-w-2xl text-zinc-300 text-base md:text-lg">
                Experience the ultimate luxury on Hussain Sagar Lake with our premium yacht charter services.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/contact"
                  className="px-6 md:px-8 py-3 text-black font-medium rounded-full shadow transition text-sm md:text-base hover:scale-105 hover:brightness-110"
                  style={{ backgroundColor: '#b48811' }}
                >
                  Book Now / Get a Quote
                </a>
                <a
                  href="tel:+916300041186"
                  className="px-6 py-3 text-sm md:text-base rounded-full border border-neutral-700 hover:border-gold text-zinc-200 hover:text-gold transition"
                >
                  Call: +91 63000 41186
                </a>
              </div>
            </div>
          </div>
        </section>

       

        {/* YACHT FLEET TEXT CONTENT */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Our Premium Yacht Fleet</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-left">
              
              {/* Luxury Motor Yachts */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Ship className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-medium text-white">Luxury Motor Yachts</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Premium motor yachts ranging from 40-80 feet, perfect for intimate gatherings and corporate events on Hussain Sagar Lake.
                </p>
              </div>

              {/* Super Yachts */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-medium text-white">Super Yachts</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Ultra-luxury super yachts 100+ feet with multiple decks, premium amenities, and professional crew for exclusive experiences.
                </p>
              </div>

              {/* Sailing Yachts */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Waves className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-medium text-white">Sailing Yachts</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Classic sailing yachts for those who appreciate traditional elegance and the pure joy of sailing on serene waters.
                </p>
              </div>

              {/* Party Yachts */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Stars className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-medium text-white">Party Yachts</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Specially equipped yachts with entertainment systems, dance floors, and catering facilities for celebrations and events.
                </p>
              </div>

            </div>

            {/* Capacity & Charter Duration */}
            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-medium text-white mb-2">Guest Capacity</h3>
                <p className="text-2xl font-semibold text-gold">8 – 50 guests</p>
                <p className="text-sm text-zinc-400 mt-2">Accommodating intimate gatherings to large celebrations</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-medium text-white mb-2">Charter Duration</h3>
                <p className="text-2xl font-semibold text-gold">Half day to multi-day</p>
                <p className="text-sm text-zinc-400 mt-2">Flexible charter options to suit your schedule</p>
              </div>
            </div>
          </div>
        </section>

        {/* HIGH QUALITY SERVICE */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="group relative h-80 md:h-[460px] rounded-2xl overflow-hidden border border-neutral-800">
              <Image
                src="https://i.pinimg.com/1200x/3e/1c/9f/3e1c9ff2ba7c999f4584eb9349b9bef6.jpg"
                alt="Luxury yacht charter service Hyderabad on Hussain Sagar Lake"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 m-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-2xl border border-white/20">
                <h3 className="text-base font-semibold text-white">Premium Yacht Charter</h3>
                <p className="text-xs text-white/80">Luxury voyages on Hussain Sagar Lake</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
                <span className="text-gold">HIGH QUALITY SERVICE</span>
              </h2>
              <p className="mt-3 text-sm text-zinc-400 text-center md:text-left">
                Personalized, discreet, and detail‑driven—crafted to exceed expectations on every yacht charter.
              </p>

              <div className="mt-6 grid gap-4">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-white/5 backdrop-blur-sm p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-100">EXCLUSIVE DINING</div>
                    <div className="text-xs text-zinc-400">Chef‑crafted menus and curated beverages at sea.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-white/5 backdrop-blur-sm p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Stars className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-100">LUXURY ON BOARD</div>
                    <div className="text-xs text-zinc-400">Sun decks, plush cabins, and designer amenities.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-white/5 backdrop-blur-sm p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <PawPrint className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-100">PET FRIENDLY</div>
                    <div className="text-xs text-zinc-400">Comfortable arrangements and compliant handling at marinas.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-white/5 backdrop-blur-sm p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-100">VIP MARINA TRANSFERS</div>
                    <div className="text-xs text-zinc-400">Door‑to‑dock luxury with chauffeur‑driven arrivals.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* YACHT CHARTER PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gold">Charter Process</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Simple steps to your luxury yacht experience on Hussain Sagar Lake.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Contact</h3>
              <p className="text-sm text-zinc-400">
                Call or message us with your preferred dates and requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Compass className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Plan</h3>
              <p className="text-sm text-zinc-400">
                We'll customize your itinerary and select the perfect yacht for your group.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Confirm</h3>
              <p className="text-sm text-zinc-400">
                Review details, complete booking, and receive confirmation with all arrangements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <Ship className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Enjoy</h3>
              <p className="text-sm text-zinc-400">
                Board your luxury yacht and experience the ultimate charter on the lake.
              </p>
            </div>
          </div>
        </section>

               {/* 3) WHY CHOOSE US */}
               <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gold">Why Choose Us</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Safety, luxury, and convenience—optimized for Hussain Sagar Lake charters.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">Certified Crew</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Experienced, licensed captains and crew adhering to maritime safety standards.
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
                Discreet service, private boarding, and confidential charter arrangements.
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
                On‑demand scheduling, VIP transfers, and tailored onboard service.
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
                Luxury interiors, fine dining, and curated onboard experiences.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Anchor className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-medium">Hyderabad Marina</h3>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Premium marina access on Hussain Sagar Lake with world-class facilities.
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
              Inquire About Yachts
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Get a personalised quote from our concierge team.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </>
  )
}