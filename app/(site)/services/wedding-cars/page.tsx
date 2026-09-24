'use client';

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Heart, Crown, MapPin, Phone, ArrowRight, Sparkles, Flower2, Car, ShieldCheck, Users, ChevronRight, ChevronLeft } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { ServiceFleetShowcase } from "@/components/service-fleet-showcase"

import { WeddingConfigurator } from "@/components/wedding-configurator"

const GOLD = '#b48811'

export default function WeddingCarsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-black text-zinc-100">
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center">
          <Image
            src="https://i.pinimg.com/736x/a1/86/db/a186db7d8842e5c511163b21076dac56.jpg"
            alt="Wedding luxury car hero"
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
                Wedding Luxury Cars Rental in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-3xl mx-auto">
                Arrive in style on your big day with premium wedding cars from DriveItCars.
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
                  href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20wedding%20car%20in%20Hyderabad."
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

        {/* ABOUT SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Make Your Special Day Memorable</h2>
            <p className="text-base text-zinc-300 leading-relaxed">
              Make your wedding day unforgettable by choosing DriveItCars for Wedding Luxury Car Rentals in Hyderabad. From the elegance of the Jaguar XF to the grandeur of the Mercedes Maybach, our premium cars ensure you arrive in absolute style. Perfectly maintained and decorated to match your wedding theme, our luxury cars add the touch of sophistication every couple deserves.
            </p>
          </div>
        </section>

        {/* LUXURY WEDDING CAR COLLECTIONS */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Luxury Wedding Car Collections</h2>
            <p className="mt-2 text-sm text-zinc-400">Make your special day extraordinary with our premium wedding car fleet.</p>
          </div>
          <div className="mt-8">
            <p className="text-center text-zinc-400 mb-6">Explore our complete wedding fleet</p>
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

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose DriveItCars for Wedding Cars?</h2>
            <p className="mt-2 text-sm text-zinc-400">Making your special day even more memorable.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Car className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wide Range of Premium Cars</h3>
              <p className="text-sm text-zinc-400">From SUVs to super luxury sedans, we have the perfect car for your wedding.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Flower2 className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Custom Decoration Options</h3>
              <p className="text-sm text-zinc-400">Flowers, ribbons, themes – we customize everything to match your vision.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Chauffeurs</h3>
              <p className="text-sm text-zinc-400">Well-trained, uniformed drivers ensuring a smooth and elegant experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Crown className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Flexible Packages</h3>
              <p className="text-sm text-zinc-400">Luxury for every budget with customizable wedding car packages.</p>
            </div>
          </div>
        </section>

        {/* BOOKING CTA / CONFIGURATOR */}
        <section className="mx-auto max-w-7xl px-4 py-16">
           <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Configure Your Wedding Package</h2>
            <p className="text-zinc-400">Design the perfect luxury transport experience for your special day.</p>
           </div>
           
           <WeddingConfigurator />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
