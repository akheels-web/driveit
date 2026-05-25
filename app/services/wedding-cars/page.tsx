'use client';

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Heart, Crown, MapPin, Phone, MessageCircle, ArrowRight, Sparkles, Flower2, Car, ShieldCheck, Users, ChevronRight, ChevronLeft } from "lucide-react"

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
                  href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20wedding%20car%20in%20Hyderabad."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
            
            { title: "BMW 520D", img: "/sadan/1.jpg" },
            { title: "Lamborghini Gallardo", img: "/sadan/2.jpg" },
            { title: "Lexus ES 300H", img: "/sadan/3.jpg" },
            { title: "Mercedes S 350", img: "/sadan/4.jpg" },
            { title: "KIA Carnival", img: "/suv/1.jpg" },
            { title: "Mercedes GLS 350D", img: "/suv/2.jpg" },
            { title: "Mini Cooper Countryman", img: "/suv/3.jpg" },
            { title: "Toyota Commuter (Custom)", img: "/suv/4.jpg" },
            { title: "Toyota Crysta MT", img: "/suv/5.jpg" },
            { title: "Toyota Fortuner", img: "/suv/6.jpg" },
            { title: "Toyota Vellfire", img: "/suv/7.jpg" },
            { title: "Volvo XC60", img: "/suv/8.jpg" },
            { title: "Audi Q7 Quatro", img: "/suv/9.jpg" },
            { title: "Mercedes S 450", img: "/sadan/5.jpg" },
            { title: "Mercedes G 350 Wagon", img: "/trending/1.jpg" },
            { title: "Mercedes GLS 400D", img: "/trending/2.jpg" },
            { title: "Mercedes V-Class", img: "/trending/3.jpg" },
            { title: "Range Rover Vogue", img: "/trending/4.jpg" },
            { title: "Volvo S90", img: "/trending/5.jpg" },
            { title: "Volvo XC 90", img: "/trending/6.jpg" },
            { title: "BMW 730 LD", img: "/trending/7.jpg" },
            { title: "BMW i4", img: "/trending/8.jpg" },
            { title: "Mercedes C300 Convertible", img: "/trending/9.jpg" },
            { title: "Mercedes E 220D", img: "/trending/10.jpg" },
            { title: "Toyota Camry", img: "/sadan/6.jpg" },
            { title: "Volvo S60 D5", img: "/sadan/7.jpg" },
            { title: "Audi A6", img: "/sadan/8.jpg" },
            { title: "Audi RS5 QUATRO", img: "/sadan/9.jpg" },
            ].map((car) => (
              <div key={car.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={car.img}
                    alt={`${car.title} wedding car rental Hyderabad`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-medium text-white">Wedding Car</span>
                  </div>
                 
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{car.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20${car.title}%20for%20my%20wedding%20in%20Hyderabad.`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
                    style={{ backgroundColor: GOLD }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-zinc-200 hover:border-gold hover:text-gold transition text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

        {/* BOOKING CTA */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 min-h-[500px] md:min-h-[600px]">
            <Image
              src="/rolls-royce-wedding-ribbon.png"
              alt="Luxury rolls royce wedding car decorated in Hyderabad"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80" />

            <div className="relative z-10 p-6 md:p-10 flex items-center justify-center min-h-full">
              <div className="w-full max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 text-sm text-zinc-300 mb-4">
                  <Heart className="w-4 h-4" style={{ color: GOLD }} />
                  Your Special Day Awaits
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                  Book Your Wedding Car Today
                </h2>
                <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
                  Luxury, elegance, and memories that last a lifetime.
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
                    href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20wedding%20car%20in%20Hyderabad."
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
