import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Award, Users, Clock, Shield, Star, Heart, Car, Plane, MapPin, Phone, Mail, Crown, Sparkles, CheckCircle, MessageCircle } from "lucide-react"

const GOLD = '#b48811'

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-black text-zinc-100">
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center">
          <Image
            src="/luxury-flagship-cars-in-black-studio.png"
            alt="DRIVEIT Luxury Fleet"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <Crown className="w-4 h-4" style={{ color: GOLD }} />
                Premium Luxury Transportation, Hyderabad
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
                About Us – Redefining Luxury Travel in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-3xl mx-auto">
                Seamless journeys, premium comfort, and trusted service.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 md:px-8 py-3 text-black font-medium rounded-full text-sm md:text-base hover:scale-105 transition"
                  style={{ backgroundColor: GOLD }}
                >
                  Contact Us
                </Link>
                <a
                  href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20DRIVEIT%20services."
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

        {/* WHO WE ARE */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Who We Are</h2>
            <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
              <p>
                We are Hyderabad's trusted premium car rental and transfer service, specializing in luxury cars, airport transfers, intercity rides, and corporate rentals. With a focus on comfort, punctuality, and professionalism, we deliver experiences tailored for business leaders, travelers, and families.
              </p>
              <p>
                Our commitment to excellence has made us the preferred choice for discerning clients who value quality, reliability, and sophisticated service. From executive airport transfers to luxury wedding cars, we ensure every journey reflects our dedication to premium hospitality.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Our Mission & Vision</h2>
            <p className="mt-2 text-sm text-zinc-400">The driving force behind our commitment to excellence.</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/maybach-s680-night.png"
                alt="Our Mission - Luxury Service"
                fill
                loading="lazy"
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60" />
              <div className="relative p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Our Mission</h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  To provide world-class, reliable, and luxurious travel experiences in Hyderabad and beyond.
                </p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/rolls-royce-phantom-night-black.png"
                alt="Our Vision - Premium Excellence"
                fill
                loading="lazy"
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/60" />
              <div className="relative p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Our Vision</h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  To become the most trusted luxury transport partner for individuals and businesses across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose Us</h2>
            <p className="mt-2 text-sm text-zinc-400">Experience the difference with our premium service standards.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Car className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Premium Fleet of Luxury Cars</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Rolls Royce, Ferrari, Bentley, and other world-class vehicles for every occasion.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Experienced & Professional Drivers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Trained chauffeurs with years of experience in luxury hospitality and safe driving.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">24/7 Customer Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Round-the-clock assistance via WhatsApp and phone for all your travel needs.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Trusted by Corporates & Elite Clients</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Preferred choice of business leaders, celebrities, and discerning travelers.
              </p>
            </div>
          </div>
        </section>

        {/* OUR PRESENCE */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Our Presence</h2>
            <p className="mt-2 text-sm text-zinc-400">Strategically positioned to serve Hyderabad's premium transportation needs.</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/black-chauffeur-sedan-night-city.png"
              alt="Hyderabad City Presence"
              fill
              loading="lazy"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/80" />
            <div className="relative p-8 md:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                  Your Local Luxury Transport Partner in <span style={{ color: GOLD }}>Hyderabad</span>
                </h3>
                <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                  Strategically located to serve Rajiv Gandhi International Airport, Begumpet Airport, and corporate hubs across the city. Our deep understanding of Hyderabad's routes, traffic patterns, and premium destinations ensures seamless, efficient journeys every time.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3 text-center">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <Plane className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
                    <h4 className="text-white font-semibold mb-2">Airport Connectivity</h4>
                    <p className="text-sm text-zinc-400">Direct access to RGIA & Begumpet Airport</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
                    <h4 className="text-white font-semibold mb-2">Corporate Hubs</h4>
                    <p className="text-sm text-zinc-400">Serving HITEC City, Gachibowli & Financial District</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
                    <h4 className="text-white font-semibold mb-2">24/7 Availability</h4>
                    <p className="text-sm text-zinc-400">Round-the-clock service across the city</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLIENTELE & TRUST */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Trusted by Industry Leaders</h2>
            <p className="mt-2 text-sm text-zinc-400">Our commitment to excellence has earned the trust of premium clients.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center mb-12">
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GOLD }}>500+</div>
              <div className="text-zinc-300 font-medium">Happy Clients</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GOLD }}>1000+</div>
              <div className="text-zinc-300 font-medium">Successful Trips</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GOLD }}>50+</div>
              <div className="text-zinc-300 font-medium">Luxury Vehicles</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: GOLD }}>24/7</div>
              <div className="text-zinc-300 font-medium">Support Available</div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-white mb-3">Safety Certified</h3>
              <p className="text-sm text-zinc-400">All drivers undergo thorough background checks and safety training</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-white mb-3">Verified Drivers</h3>
              <p className="text-sm text-zinc-400">Licensed, experienced chauffeurs with impeccable service records</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <Star className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-white mb-3">5-Star Rated</h3>
              <p className="text-sm text-zinc-400">Consistently rated excellent by corporate clients and individuals</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="relative py-20">
          <Image
            src="/luxury-flagship-cars-in-black-studio.png"
            alt="Contact DRIVEIT"
            fill
            loading="lazy"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to book your luxury ride?
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              Experience premium transportation with DRIVEIT. Our team is ready to make your journey exceptional.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 text-black font-medium rounded-full text-lg hover:scale-105 transition"
                style={{ backgroundColor: GOLD }}
              >
                <Car className="w-5 h-5" />
                Book Now
              </Link>
              <a
                href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20DRIVEIT%20services."
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-zinc-200 hover:border-gold hover:text-gold transition text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <a
                href="tel:+918341341186"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-zinc-200 hover:border-gold hover:text-gold transition text-lg"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-3">Hyderabad Office</h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: GOLD }} />
                  <span>Banjara Hills, Hyderabad - 500034</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: GOLD }} />
                  <span>+91 83413 41186</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: GOLD }} />
                  <span>contact@driveit.com</span>
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