import { metadata } from './metadata'
export { metadata }
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Car, ShieldCheck, Crown, MapPin, Phone, Stars, MessageCircle, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const GOLD = '#b48811';

type CarItem = {
  title: string;
  img: string;
  isAd?: boolean;
  type?: 'whatsapp' | 'contact';
  description?: string;
};

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LuxuryCarRentalPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Premium Luxury Car Rental Hyderabad",
    "description": "Book premium luxury cars in Hyderabad with professional chauffeurs or as self-drive. Choose from Mercedes, BMW, Audi, and other exotic cars.",
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
            src="https://i.pinimg.com/1200x/1d/cf/cb/1dcfcb4696c662ba71d32cb76fccc103.jpg"
            alt="Luxury car hero"
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
                Experience Luxury Cars in <span style={{ color: GOLD }}>Hyderabad</span>
              </h1>
              <p className="mt-3 text-base md:text-lg text-zinc-300">
                Book premium cars with professional drivers or self-drive – anytime, anywhere.
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
                  href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20car%20in%20Hyderabad."
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
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Professional Drivers</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Professionally trained, multilingual drivers with a service-first attitude, ensuring every journey is seamless and memorable.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Car className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Best Quality Cars</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Meticulously maintained luxury vehicles from premium brands, ensuring comfort, safety, and style for every journey.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                  <Crown className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-medium text-white">Chosen by the Elite</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Trusted by business leaders, celebrities, and discerning travelers who demand nothing but the finest in luxury transportation.
              </p>
            </div>
          </div>
        </section>

        {/* TRENDING LUXURY CARS — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Trending Luxury Cars in Your City</h2>
            <p className="mt-2 text-sm text-zinc-400">Explore top selections for style, performance, and presence.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
              { 
                title: "Quick Booking", 
                img: "", 
                isAd: true, 
                type: "whatsapp" as const,
                description: "Book instantly via WhatsApp"
              },
              { 
                title: "Get Quote", 
                img: "", 
                isAd: true, 
                type: "contact" as const,
                description: "Personalized service"
              }
            ].map((c, index) => {
              if (c.isAd && c.type === "whatsapp") {
                return (
                  <div key="whatsapp-ad" className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 md:p-6 hover:border-green-400/50 transition-all duration-300 group">
                    <div className="flex flex-col items-center justify-center h-48 mb-4 rounded-xl bg-green-500/10">
                      <MessageCircle className="w-16 h-16 text-green-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                      <p className="text-sm text-zinc-300 text-center">{c.description}</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-white text-center">Chat with Us Now</h4>
                      <a
                        href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20car%20in%20Hyderabad."
                        target="_blank"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Now
                      </a>
                    </div>
                  </div>
                );
              }
              
              if (c.isAd && c.type === "contact") {
                return (
                  <Link key="contact-ad" href="/contact" className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 md:p-6 hover:border-blue-400/50 transition-all duration-300 group block">
                    <div className="flex flex-col items-center justify-center h-48 mb-4 rounded-xl bg-blue-500/10">
                      <Phone className="w-16 h-16 text-blue-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                      <p className="text-sm text-zinc-300 text-center">{c.description}</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-white text-center">Contact Our Team</h4>
                      <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition">
                        <ArrowRight className="w-4 h-4" />
                        Get Personalized Quote
                      </div>
                    </div>
                  </Link>
                );
              }
              
              return (
                <div key={c.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300">
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={c.img}
                      alt={`${c.title} luxury rental car Hyderabad`}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-medium text-white">Trending</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">{c.title}</h3>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20${c.title}%20in%20Hyderabad.`}
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
              );
            })}
            </div>
          </div>
        </section>

        {/* LUXURY SEDANS — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury Sedans with a Driver</h3>
            <p className="mt-2 text-sm text-zinc-400">Refined comfort with signature elegance.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "BMW 520D", img: "/sadan/1.jpg" },
              { title: "Lamborghini Gallardo", img: "/sadan/2.jpg" },
              { title: "Lexus ES 300H", img: "/sadan/3.jpg" },
              { title: "Mercedes S 350", img: "/sadan/4.jpg" },
              { title: "Mercedes S 450", img: "/sadan/5.jpg" },
              { title: "Toyota Camry", img: "/sadan/6.jpg" },
              { title: "Volvo S60 D5", img: "/sadan/7.jpg" },
              { title: "Audi A6", img: "/sadan/8.jpg" },
              { title: "Audi RS5 QUATRO", img: "/sadan/9.jpg" },
            ].map((s) => (
              <div key={s.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={s.img}
                    alt={`${s.title} premium sedan rental Hyderabad`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-medium text-white">Luxury Sedan</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{s.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20${s.title}%20sedan%20in%20Hyderabad.`}
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

        {/* LUXURY SUVS — scroll-snap carousel */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury SUVs with a Driver</h3>
            <p className="mt-2 text-sm text-zinc-400">Dominant stance with absolute comfort and safety.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "KIA Carnival", img: "/suv/1.jpg" },
              { title: "Mercedes GLS 350D", img: "/suv/2.jpg" },
              { title: "Mini Cooper Countryman", img: "/suv/3.jpg" },
              { title: "Toyota Commuter (Custom)", img: "/suv/4.jpg" },
              { title: "Toyota Crysta MT", img: "/suv/5.jpg" },
              { title: "Toyota Fortuner", img: "/suv/6.jpg" },
              { title: "Toyota Vellfire", img: "/suv/7.jpg" },
              { title: "Volvo XC60", img: "/suv/8.jpg" },
              { title: "Audi Q7 Quatro", img: "/suv/9.jpg" },
            ].map((suv) => (
              <div key={suv.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300">
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={suv.img}
                    alt={`${suv.title} luxury SUV hire Hyderabad`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-medium text-white">Luxury SUV</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{suv.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20${suv.title}%20SUV%20in%20Hyderabad.`}
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

        {/* HIRE LUXURY CARS FOR SELF DRIVE */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury Cars for Self Drive</h3>
            <p className="mt-2 text-sm text-zinc-400">An extraordinary driving experience with unmatched privacy and comfort—fully in your hands.</p>
          </div>
          <div className="mt-8">
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
                    alt={`${car.title} self drive luxury car Hyderabad`}
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
                    href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20${car.title}%20for%20self%20drive%20in%20Hyderabad.`}
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
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Choose Us</h2>
            <p className="mt-2 text-sm text-zinc-400">Experience the difference with our premium luxury car rental service.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: GOLD }}>
                  <span className="text-xs font-bold text-black flex items-center justify-center h-full">✓</span>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">Professional Chauffeurs</h3>
              <p className="text-sm text-zinc-400">
                Trained, multilingual drivers for a seamless travel experience.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                  <Car className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: GOLD }}>
                  <span className="text-xs font-bold text-black flex items-center justify-center h-full">✓</span>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">Premium Fleet</h3>
              <p className="text-sm text-zinc-400">
                A wide range of sedans, SUVs, and elite cars, always maintained to the highest standards.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                  <Stars className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: GOLD }}>
                  <span className="text-xs font-bold text-black flex items-center justify-center h-full">✓</span>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">24/7 Availability</h3>
              <p className="text-sm text-zinc-400">
                Book anytime through Call or WhatsApp.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                  <Crown className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: GOLD }}>
                  <span className="text-xs font-bold text-black flex items-center justify-center h-full">✓</span>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">Trusted by the Elite</h3>
              <p className="text-sm text-zinc-400">
                Preferred by corporates, business leaders, and premium travelers.
              </p>
            </div>
          </div>
        </section>


        {/* CALL TO ACTION */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                <Car className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Experience Luxury on Every Ride</h2>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Book your next ride with us today for an extraordinary driving experience.
            </p>
            <div className="flex gap-2 justify-center">
              <a
                href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20book%20a%20luxury%20car%20in%20Hyderabad."
                target="_blank"
                className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
                style={{ backgroundColor: GOLD }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-zinc-200 hover:border-gold hover:text-gold transition text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}