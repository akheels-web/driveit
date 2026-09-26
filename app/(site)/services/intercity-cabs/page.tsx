'use client';

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Car, ShieldCheck, Crown, MapPin, Phone, Stars, MessageCircle, ArrowRight, Sparkles, Clock, Users, CheckCircle, IndianRupee, Route, Calendar, UserCheck, ChevronLeft, ChevronRight } from "lucide-react"

const GOLD = '#b48811'

export default function IntercityCabsPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Intercity & Outstation Cabs from Hyderabad",
    "description": "Safe, reliable, and premium long-distance outstation taxi services from Hyderabad to major cities across South India.",
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
            src="https://i.pinimg.com/1200x/55/5f/35/555f355e29293e4c680192d119d4bf3f.jpg"
            alt="Luxury intercity cab on highway"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="relative w-full">
            <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 text-center">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-300 mb-4">
                <Route className="w-4 h-4" style={{ color: GOLD }} />
                Long Distance Travel from Hyderabad
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
                Intercity & Outstation Cabs from <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-3xl mx-auto">
                Comfortable, safe, and reliable rides for your long journeys across South India.
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
                  href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20an%20intercity%20cab%20from%20Hyderabad."
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

        {/* THREE FEATURE BOXES */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose Our Intercity Cabs</h2>
            <p className="mt-2 text-sm text-zinc-400">Premium service designed for long-distance comfort and safety.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Professional Drivers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Experienced chauffeurs trained for long-distance travel with safety first approach and local route knowledge.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Car className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Wide Fleet Options</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Choose from Sedans, SUVs, and Premium Cars for your journey. All vehicles are well-maintained and comfortable.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IndianRupee className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Transparent Pricing</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                No hidden charges – fixed and fair fares for all intercity trips with upfront pricing and no surprises.
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
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -webkit-overflow-scrolling-touch" id="selfdrive-carousel">
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
              <div key={car.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300 group snap-start flex-shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] lg:w-[calc((100%-48px)/3)]">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={car.img}
                    alt={`${car.title} outstation self drive car Hyderabad`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-medium text-white">Self Drive</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{car.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20${car.title}%20for%20self%20drive%20in%20Hyderabad.`}
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
            <button 
              onClick={() => {
                const carousel = document.getElementById('selfdrive-carousel');
                if (carousel) carousel.scrollBy({left: -320, behavior: 'smooth'});
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 border border-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => {
                const carousel = document.getElementById('selfdrive-carousel');
                if (carousel) carousel.scrollBy({left: 320, behavior: 'smooth'});
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 border border-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </section>

        {/* FLEET OPTIONS FOR INTERCITY TRAVEL */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Fleet Options for Intercity Travel</h2>
            <p className="mt-2 text-sm text-zinc-400">Choose the perfect vehicle for your long-distance journey.</p>
          </div>

          <div className="space-y-12">
            {/* Luxury SUVs */}
            <div className="bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Luxury SUVs for Outstation</h3>
                  <p className="text-zinc-400 mb-6">
                    Spacious and comfortable SUVs perfect for family trips and group travel. Extra luggage space and superior comfort for long journeys.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      7-8 seater capacity
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Extra luggage space
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Premium interiors
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src="/bentley-bentayga-night.png"
                    alt="Luxury SUV intercity cab rental Hyderabad"
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Premium Sedans */}
            <div className="bg-gradient-to-l from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <h3 className="text-2xl font-semibold text-white mb-4">Premium Sedans for Long Trips</h3>
                  <p className="text-zinc-400 mb-6">
                    Elegant and fuel-efficient sedans ideal for business travel and comfortable long-distance journeys.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      4-5 seater comfort
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Fuel efficient
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Business class comfort
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden md:order-1">
                  <Image
                    src="/bentley-continental-gt-black-studio.png"
                    alt="Premium Sedan outstation car rental Hyderabad"
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Family-Friendly MUVs */}
            <div className="bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Family-Friendly Vans / MUVs</h3>
                  <p className="text-zinc-400 mb-6">
                    Spacious multi-utility vehicles perfect for large families and group outings with ample space for everyone.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      8+ seater capacity
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Maximum luggage space
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                      Family-friendly features
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src="/black-chauffeur-sedan-night-city.png"
                    alt="Family MUV chauffeur car Hyderabad"
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Simple Booking Process</h2>
            <p className="mt-2 text-sm text-zinc-400">Book your intercity cab in just 3 easy steps.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Route className="w-10 h-10" style={{ color: GOLD }} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-black font-bold text-sm flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Select Your Route & Car</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Choose your destination and select the perfect vehicle from our premium fleet options.
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
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Date & Pickup</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Set your travel date, time, and pickup location. We'll handle all the logistics for you.
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
              <h3 className="text-xl font-semibold text-white mb-4">Enjoy a Comfortable Ride</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sit back and relax while our professional chauffeur takes you to your destination safely.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="relative py-20">
          <Image
            src="/black-chauffeur-sedan-night-city.png"
            alt="Book premium intercity cabs from Hyderabad"
            fill
            loading="lazy"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Book Your Intercity Cab Today
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              Experience premium comfort and reliability for your long-distance travel from Hyderabad.
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
                href="https://wa.me/916300041186?text=Hi%2C%20I%27d%20like%20to%20book%20an%20intercity%20cab%20from%20Hyderabad."
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-zinc-200 hover:border-gold hover:text-gold transition text-lg"
              >
                <MessageCircle className="w-5 h-5" />
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
