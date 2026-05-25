'use client';

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Car, ShieldCheck, Crown, MapPin, Phone, Stars, MessageCircle, ArrowRight, Sparkles, Clock, Plane, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

const GOLD = '#d4af37'
const LIGHT_GOLD = '#f4e4a6'

export default function LuxuryChauffeurPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Premium Chauffeur & Airport Taxi Service Hyderabad",
    "description": "Experience premium airport taxi and chauffeur services in Hyderabad. Meticulously maintained vehicles for airport pickup and drop-off, corporate travel, and special events.",
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
      <main className="bg-black text-zinc-100 min-h-screen">
        {/* ENHANCED HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-amber-900/20 z-0" />
          <Image
            src="https://i.pinimg.com/1200x/a3/e7/0f/a3e70f1bff097271a2e4e903460e3668.jpg"
            alt="Luxury chauffeur service"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 scale-105"
            style={{ transform: 'scale(1.1)' }}
          />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold rounded-full opacity-60 animate-pulse" style={{ backgroundColor: GOLD }} />
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-gold rounded-full opacity-40 animate-pulse delay-300" style={{ backgroundColor: GOLD }} />
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-gold rounded-full opacity-50 animate-pulse delay-700" style={{ backgroundColor: GOLD }} />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-32 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 mb-8">
              <Crown className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-sm font-medium text-zinc-200 tracking-wide">PREMIUM CHAUFFEUR SERVICES, HYDERABAD</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white mb-6">
              Experience Premium Rides in <span style={{ color: GOLD }}>Hyderabad</span>
              <br />
              Chauffeur Services
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
              Experience the pinnacle of sophistication with our exclusive chauffeur services for corporate events, 
              weddings, and VIP transportation in <span style={{ color: LIGHT_GOLD }}>Hyderabad</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/contact"
                className="group px-10 py-5 text-black font-semibold rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
                style={{ 
                  backgroundColor: GOLD,
                  boxShadow: `0 10px 40px ${GOLD}40`
                }}
              >
                Book Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <a
                href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20chauffeur%20service%20in%20Hyderabad."
                target="_blank"
                className="group px-10 py-5 rounded-full border-2 border-white/20 hover:border-gold text-zinc-200 hover:text-white transition-all duration-300 text-lg flex items-center gap-3 backdrop-blur-sm bg-white/5"
              >
                <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
                WhatsApp Us
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: GOLD }} />
                <span>Verified Chauffeurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Stars className="w-4 h-4" style={{ color: GOLD }} />
                <span>5-Star Rated Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: GOLD }} />
                <span>24/7 Availability</span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gold rounded-full mt-2" style={{ backgroundColor: GOLD }} />
            </div>
          </div>
        </section>

        {/* LUXURY FLEET SECTION */}
        <section className="py-24 bg-gradient-to-b from-black to-neutral-950 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${GOLD} 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4" style={{ color: GOLD }}>
                <Sparkles className="w-4 h-4" />
                EXCLUSIVE COLLECTION
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Our <span style={{ color: GOLD }}>Prestigious</span> Fleet
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Meticulously maintained premium vehicles with dedicated chauffeurs for corporate events, 
                weddings, and VIP transportation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Celebrity & Events */}
              <div className="group relative h-96 rounded-3xl overflow-hidden transform transition-all duration-700 hover:scale-[1.02]">
                <Image
                  src="/1.jpg"
                  alt="Celebrity & Events Transportation"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">Celebrity & Events Transportation</h3>
                  <p className="text-zinc-300 mb-6">Red-carpet logistics for VIPs, concerts, shoots, and events</p>
                  <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-medium group/link">
                    <span className="text-white border-b border-transparent group-hover/link:border-gold transition-all" style={{ color: GOLD }}>
                      Discover More
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" style={{ color: GOLD }} />
                  </Link>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              {/* Luxury Service */}
              <div className="group relative h-96 rounded-3xl overflow-hidden transform transition-all duration-700 hover:scale-[1.02]">
                <Image
                  src="https://i.pinimg.com/736x/68/b9/c2/68b9c2fe5a114be8de36d53873d39041.jpg"
                  alt="Chauffeur Luxury Service"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">Chauffeur Luxury Service</h3>
                  <p className="text-zinc-300 mb-6">Executive rides with professional chauffeurs, on time and in style</p>
                  <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-medium group/link">
                    <span className="text-white border-b border-transparent group-hover/link:border-gold transition-all" style={{ color: GOLD }}>
                      Discover More
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" style={{ color: GOLD }} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Wedding Cars - Full Width */}
            <div className="group relative h-[500px] rounded-3xl overflow-hidden transform transition-all duration-700 hover:scale-[1.01]">
              <Image
                src="https://i.pinimg.com/736x/09/f9/44/09f944012c94c6a5b75bffa4e11333c5.jpg"
                alt="Wedding Cars"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 flex items-center p-12 max-w-2xl">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
                    Wedding <span style={{ color: GOLD }}>Cars</span>
                  </h3>
                  <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                    Make your big day unforgettable with our elegant wedding fleet. 
                    Perfect for creating timeless memories.
                  </p>
                  <Link href="/cars" className="inline-flex items-center gap-3 text-lg font-medium group/link">
                    <span className="text-white border-b-2 border-transparent group-hover/link:border-gold transition-all pb-1" style={{ color: GOLD }}>
                      Explore Wedding Collection
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-2" style={{ color: GOLD }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-black" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4" style={{ color: GOLD }}>
                <ShieldCheck className="w-4 h-4" />
                UNMATCHED EXCELLENCE
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Why Choose Our <span style={{ color: GOLD }}>Luxury</span> Service
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Unparalleled elegance and sophistication for the discerning clientele
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Elite Chauffeurs",
                  description: "Impeccably trained, multilingual professionals who embody discretion, courtesy, and exceptional service standards."
                },
                {
                  icon: Car,
                  title: "Prestigious Fleet",
                  description: "An exclusive collection of luxury vehicles including Mercedes, BMW, Audi, and exotic cars for every occasion."
                },
                {
                  icon: Clock,
                  title: "White-Glove Service",
                  description: "Personalized attention to detail with concierge-level service for business, events, and special occasions."
                }
              ].map((item, index) => (
                <div key={index} className="group text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold transition-all duration-500">
                    <item.icon className="w-12 h-12" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-6">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 bg-gradient-to-b from-black to-neutral-950 relative">
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4" style={{ color: GOLD }}>
                <Sparkles className="w-4 h-4" />
                SEAMLESS EXPERIENCE
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Your Luxury <span style={{ color: GOLD }}>Experience</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Simple, elegant process for our distinguished clients
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Car,
                  step: "01",
                  title: "Select Your Experience",
                  description: "Choose from our exclusive collection of luxury vehicles and specify your chauffeur requirements."
                },
                {
                  icon: Plane,
                  step: "02",
                  title: "Personalize Your Service",
                  description: "Share your itinerary, preferences, and special requirements for a bespoke chauffeur experience."
                },
                {
                  icon: CheckCircle,
                  step: "03",
                  title: "Experience Excellence",
                  description: "Enjoy impeccable service, comfort, and sophistication with your dedicated professional chauffeur."
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold transition-all duration-500 h-full">
                    <div className="text-6xl font-bold text-white/10 mb-4 group-hover:text-gold/20 transition-colors duration-500">
                      {item.step}
                    </div>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold transition-all duration-500">
                      <item.icon className="w-10 h-10" style={{ color: GOLD }} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-6">{item.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Connection line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/10 group-hover:bg-gold/50 transition-colors duration-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/black-chauffeur-sedan-night-city.png"
              alt="Book luxury chauffeur service"
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6" style={{ color: GOLD }}>
                <Crown className="w-4 h-4" />
                ELEVATE YOUR JOURNEY
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-tight">
                Reserve Your <span style={{ color: GOLD }}>Luxury</span>
                <br />
                Chauffeur Today
              </h2>
              
              <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Elevate every journey with our premium chauffeur services - where luxury meets exceptional service
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="tel:+918341341186"
                  className="group px-12 py-5 rounded-full border-2 border-white/20 hover:border-gold text-white transition-all duration-300 text-lg flex items-center gap-3 backdrop-blur-sm bg-white/5 hover:bg-white/10"
                >
                  <Phone className="w-5 h-5" style={{ color: GOLD }} />
                  Call Now
                </a>
                
                <a
                  href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20chauffeur%20service%20in%20Hyderabad."
                  target="_blank"
                  className="group px-12 py-5 text-black font-semibold rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
                  style={{ 
                    backgroundColor: GOLD,
                    boxShadow: `0 10px 40px ${GOLD}40`
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-zinc-500 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Flexible Cancellation</span>
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