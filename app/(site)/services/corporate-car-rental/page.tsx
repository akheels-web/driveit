'use client';

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Car, ShieldCheck, Crown, MapPin, Phone, Stars, ArrowRight, Sparkles, Clock, Users, CheckCircle, Building2, Calendar, UserCheck, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { ServiceFleetShowcase } from "@/components/service-fleet-showcase"

const GOLD = '#b48811'

export default function CorporateCarRentalPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Corporate Car Rental Services Hyderabad",
    "description": "Tailored luxury transportation solutions for businesses, executive travel, client meetings, and corporate events in Hyderabad.",
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
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center">
          <Image
            src="https://i.pinimg.com/736x/14/c0/e4/14c0e437d268500ac4b4bc1b46879219.jpg"
            alt="Corporate car rental with business professionals"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <Building2 className="w-4 h-4" style={{ color: GOLD }} />
                Corporate Travel Solutions, Hyderabad
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
                Corporate Car Rentals in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-3xl mx-auto">
                Tailored travel solutions for businesses, executives, and corporate events.
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
                  href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20corporate%20car%20rental%20services%20in%20Hyderabad."
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

        {/* THREE FEATURE BOXES */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose Our Corporate Services</h2>
            <p className="mt-2 text-sm text-zinc-400">Professional transportation solutions designed for business excellence.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Professional Chauffeurs</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Multilingual, well-trained drivers ensuring punctual and discreet service for executives.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Car className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Premium Fleet for Business</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Luxury sedans, SUVs, and vans designed to meet all corporate travel needs.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Trusted by Corporates</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Chosen by top companies for reliable travel, meetings, and events in Hyderabad.
              </p>
            </div>
          </div>
        </section>

      
         {/* HIRE LUXURY CARS FOR SELF DRIVE */}
         <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury Cars for Self Drive</h3>
            <p className="mt-2 text-sm text-zinc-400">An extraordinary driving experience with unmatched privacy and comfort—fully in your hands.</p>
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

        {/* CORPORATE PACKAGES & SERVICES */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Corporate Packages & Services</h2>
            <p className="mt-2 text-sm text-zinc-400">Comprehensive solutions for all your business travel needs.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Users className="w-8 h-8" style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-semibold text-white">Employee Pick-up & Drop-off Services</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Reliable daily commute solutions for your employees with scheduled pick-up and drop-off services across Hyderabad.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Daily scheduled services
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Multiple pickup points
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Flexible timing options
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Briefcase className="w-8 h-8" style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-semibold text-white">Executive Cars for Client Meetings</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Premium vehicles with professional chauffeurs for important client meetings and business appointments.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Luxury sedans & SUVs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Professional chauffeurs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  On-demand availability
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Calendar className="w-8 h-8" style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-semibold text-white">Shuttle Services for Events & Conferences</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Organized transportation for corporate events, conferences, and large gatherings with multiple vehicle coordination.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Event coordination
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Multiple vehicle fleet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Dedicated event manager
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Clock className="w-8 h-8" style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-semibold text-white">Long-term Corporate Rentals</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Cost-effective long-term rental solutions for businesses with dedicated vehicles and drivers for extended periods.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Monthly & yearly packages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Dedicated vehicles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                  Maintenance included
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOOKING PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Simple Corporate Booking Process</h2>
            <p className="mt-2 text-sm text-zinc-400">Get your corporate transportation sorted in just 3 easy steps.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-10 h-10" style={{ color: GOLD }} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-black font-bold text-sm flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Your Corporate Plan</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Select the service that best fits your business needs - from daily commutes to event transportation.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-10 h-10" style={{ color: GOLD }} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-black font-bold text-sm flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Schedule & Requirements</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Provide your schedule, pickup locations, and specific requirements. We'll customize the service accordingly.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-10 h-10" style={{ color: GOLD }} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-black font-bold text-sm flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Relax with Hassle-Free Travel</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Enjoy professional, punctual, and comfortable transportation while you focus on your business.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="relative py-20">
          <Image
            src="/luxury-flagship-cars-in-black-studio.png"
            alt="Book your corporate car rental in Hyderabad"
            fill
            loading="lazy"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Book Your Corporate Car Rental Today
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              Professional transportation solutions tailored for your business needs in Hyderabad.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <a
                href="tel:+916300041186"
                className="inline-flex items-center gap-2 px-8 py-4 text-black font-medium rounded-full text-lg hover:scale-105 transition"
                style={{ backgroundColor: GOLD }}
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a
                href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20corporate%20car%20rental%20services%20in%20Hyderabad."
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] text-zinc-200 transition text-lg font-medium"
              >
                <FaWhatsapp className="w-6 h-6" />
                WhatsApp Us
              </a>
            </div>

           
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
