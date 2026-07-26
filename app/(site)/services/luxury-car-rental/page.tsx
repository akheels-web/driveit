import { metadata } from './metadata'
export { metadata }
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Car, ShieldCheck, Crown, MapPin, Phone, Stars, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Users, Settings2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { LuxuryCarClient } from "@/components/luxury-car-client";

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

        {/* VEHICLE SHOWCASE - REPLACED WITH CLIENT COMPONENT */}
        <LuxuryCarClient />

        {/* CHAUFFEUR VS SELF-DRIVE COMPARISON */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-bold text-white mb-4">Choose Your Experience</h2>
            <p className="text-zinc-400">Tailor your journey with our signature chauffeur service or experience the thrill of self-drive.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-[var(--gold-400)]/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                   <Crown className="w-32 h-32" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--gold-400)] mb-6 flex items-center gap-3">
                   <Users className="w-6 h-6" /> Chauffeur Driven
                </h3>
                <ul className="space-y-5 relative z-10">
                   <li className="flex gap-3 text-zinc-300"><span className="text-[var(--gold-400)] mt-1">✓</span> White-glove service from professionally trained, bilingual chauffeurs.</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-[var(--gold-400)] mt-1">✓</span> Zero liability for vehicle damage or insurance deductibles.</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-[var(--gold-400)] mt-1">✓</span> Complimentary bottled water, Wi-Fi, and reading materials.</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-[var(--gold-400)] mt-1">✓</span> Door-to-door VIP airport transfers with meet-and-greet.</li>
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                   <Link href="/cars?service=chauffeur" className="inline-flex items-center gap-2 text-[var(--gold-400)] font-semibold hover:gap-4 transition-all">
                      Browse Chauffeur Fleet <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>

             <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                   <Car className="w-32 h-32" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <Settings2 className="w-6 h-6" /> Self Drive
                </h3>
                <ul className="space-y-5 relative z-10">
                   <li className="flex gap-3 text-zinc-300"><span className="text-white/50 mt-1">✓</span> Complete privacy and freedom to craft your own itinerary.</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-white/50 mt-1">✓</span> Comprehensive insurance coverage included (deductibles apply).</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-white/50 mt-1">✓</span> Flexible pickup and drop-off locations across the city.</li>
                   <li className="flex gap-3 text-zinc-300"><span className="text-white/50 mt-1">✓</span> Transparent fuel policies and generous daily kilometer limits.</li>
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                   <Link href="/cars?service=selfdrive" className="inline-flex items-center gap-2 text-white hover:gap-4 transition-all">
                      Browse Self-Drive Fleet <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
          </div>
        </section>

        {/* TRUST & SANITIZATION */}
        <section className="mx-auto max-w-7xl px-4 py-16 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-white mb-6">Our Commitment to Excellence</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                   Your safety and comfort are our highest priorities. Every vehicle in our fleet undergoes rigorous maintenance and a comprehensive 30-point detailing and sanitization process before each dispatch.
                </p>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center shrink-0">
                         <ShieldCheck className="w-6 h-6 text-[var(--gold-400)]" />
                      </div>
                      <div>
                         <h4 className="text-lg font-semibold text-white">Vetted Professionals</h4>
                         <p className="text-sm text-zinc-500 mt-1">Strict background checks and defensive driving certifications for all staff.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center shrink-0">
                         <Sparkles className="w-6 h-6 text-[var(--gold-400)]" />
                      </div>
                      <div>
                         <h4 className="text-lg font-semibold text-white">Hospital-Grade Sanitization</h4>
                         <p className="text-sm text-zinc-500 mt-1">Interior ozone treatment and surface disinfection after every booking.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 hidden lg:block">
                <Image src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1600&auto=format&fit=crop" alt="Sanitization and Trust" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                   <div className="bg-black/60 backdrop-blur-md border border-[var(--gold-400)]/30 rounded-xl p-6">
                      <div className="text-3xl font-bold text-[var(--gold-400)] mb-1">100%</div>
                      <div className="text-sm text-white font-medium">Satisfaction Rate</div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* STICKY BOTTOM CTA (Mobile/Tablet focused) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-[var(--gold-400)]/30 p-4 md:hidden flex items-center justify-between gap-4">
           <div>
              <div className="text-xs text-[var(--gold-400)] font-semibold uppercase tracking-wider">Ready to Drive?</div>
              <div className="text-sm font-bold text-white">Book Your Luxury Car</div>
           </div>
           <Link href="/cars" className="px-6 py-3 bg-[var(--gold-400)] text-black rounded-full text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap">
              View Fleet
           </Link>
        </div>

      </main>
      <SiteFooter />
    </>
  );
}