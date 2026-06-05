import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, ShieldCheck, CheckCircle2, Star, Users, Settings2, Fuel, Briefcase, Snowflake, Car as CarIcon, ArrowRight, Shield, Award } from "lucide-react"
import { carsData } from "@/lib/cars"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CarBookingWidget } from "./booking-widget" // We'll extract the interactive part to a client component
import { WishlistButton } from "@/components/wishlist-button"
import { PersonalizedSocialProof } from "@/components/personalized-social-proof"

export function generateStaticParams() {
  return carsData.map((car) => ({
    slug: car.slug,
  }))
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = carsData.find(c => c.slug === slug)
  
  if (!car) {
    notFound()
  }

  const mockReviews = [
    { name: "Rahul S.", rating: 5, date: "2 weeks ago", text: "Impeccable condition. The chauffeur arrived 15 mins early and was very professional." },
    { name: "Sneha Reddy", rating: 5, date: "1 month ago", text: "Booked this for our wedding. The car looked stunning and the ride was so smooth. Highly recommend!" },
    { name: "Arvind M.", rating: 4, date: "3 months ago", text: "Great self-drive experience. Car was fully sanitized and documentation took just 5 minutes." },
  ]

  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-20">
        
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-white/40 mb-2">
          <Link href="/" className="hover:text-white transition">Home</Link> &rsaquo; 
          <Link href="/cars" className="hover:text-white transition ml-2">Fleet</Link> &rsaquo; 
          <span className="text-white ml-2">{car.name}</span>
        </div>

        {/* Hero Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[500px]">
            <div className="md:col-span-2 relative rounded-2xl overflow-hidden group">
              <Image src={car.src} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {/* Secondary Images (Mocked with the same image for now, normally would be interior/exterior) */}
              <div className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image src={car.src} alt={`${car.name} interior`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image src={car.src} alt={`${car.name} back`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] cursor-pointer hover:bg-black/20 transition">
                   <span className="font-semibold tracking-wider text-sm">+ View Gallery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
             
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-2 text-[var(--gold-400)] text-sm font-semibold tracking-wider uppercase">
                <Award className="w-4 h-4" /> {car.brand} • {car.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold mb-4">{car.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm border-b border-white/10 pb-6">
                <div className="flex items-center gap-1 text-[var(--gold-400)] font-medium">
                  <Star className="w-4 h-4 fill-current" /> {car.rating} <span className="text-white/40 font-normal">({car.reviewsCount} reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <PersonalizedSocialProof carId={car.id} globalBookings={car.bookingsCount} />
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Available Today</div>
              </div>
            </div>

            {/* Key Specs */}
            <div>
               <h2 className="text-xl font-semibold mb-6">Key Specifications</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Users className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.seats} Seats</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Settings2 className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.transmission}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Fuel className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.fuel}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Briefcase className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.specs.bootSpace}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Snowflake className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.specs.acZones}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <CalendarDays className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.specs.year} Model</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <CarIcon className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{car.specs.odometer}</span>
                  </div>
               </div>
            </div>

            {/* Trust & Inclusions */}
            <div>
               <h2 className="text-xl font-semibold mb-6">Why Book This Vehicle?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                     <Shield className="w-8 h-8 text-[var(--gold-400)] shrink-0" />
                     <div>
                        <h3 className="font-medium mb-1">Comprehensive Insurance</h3>
                        <p className="text-sm text-white/50">Fully covered for collision, damage, and third-party liabilities so you drive stress-free.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <ShieldCheck className="w-8 h-8 text-[var(--gold-400)] shrink-0" />
                     <div>
                        <h3 className="font-medium mb-1">Strict Sanitization</h3>
                        <p className="text-sm text-white/50">Vehicle undergoes a 30-point hygiene check and interior sanitization before every trip.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Users className="w-8 h-8 text-[var(--gold-400)] shrink-0" />
                     <div>
                        <h3 className="font-medium mb-1">Vetted Chauffeurs</h3>
                        <p className="text-sm text-white/50">Our chauffeurs possess minimum 5 years experience, background checks, and white-glove training.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Customer Reviews */}
            <div>
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <div className="text-[var(--gold-400)] font-medium text-lg flex items-center gap-1">
                     <Star className="w-5 h-5 fill-current" /> {car.rating}/5.0
                  </div>
               </div>
               <div className="space-y-4">
                  {mockReviews.map((rev, i) => (
                     <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                           <div className="font-medium">{rev.name}</div>
                           <div className="text-xs text-white/30">{rev.date}</div>
                        </div>
                        <div className="flex gap-1 mb-3">
                           {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < rev.rating ? 'text-[var(--gold-400)] fill-current' : 'text-white/10'}`} />
                           ))}
                        </div>
                        <p className="text-sm text-white/70 italic">&quot;{rev.text}&quot;</p>
                     </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-4">
                <div className="flex justify-end pr-2">
                   <WishlistButton carId={car.id} />
                </div>
                <CarBookingWidget car={car} />
             </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
