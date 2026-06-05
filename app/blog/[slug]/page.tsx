import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"

// For demo purposes, we define the content dynamically based on the slug. 
// In a real app, this would come from a CMS or Supabase.

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  
  // Mock data based on the slug to make it look realistic
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-24">
        
        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-4 py-4 mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--gold-400)] transition">
            <ChevronLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-4 text-xs font-semibold tracking-widest text-[var(--gold-400)] uppercase mb-6">
            <span>Guide</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>5 Min Read</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] font-bold leading-tight mb-8">
            {title}
          </h1>

          <div className="flex items-center justify-between border-y border-white/10 py-4 mb-10">
            <div className="flex items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /> Driveit Editorial</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Oct 24, 2023</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30 uppercase tracking-widest hidden sm:block">Share</span>
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--gold-400)] hover:text-black transition"><Facebook className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--gold-400)] hover:text-black transition"><Twitter className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--gold-400)] hover:text-black transition"><Linkedin className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-white/5">
            <Image src="/sadan/4.jpg" alt={title} fill className="object-cover" />
          </div>

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-a:text-[var(--gold-400)]">
            <p className="lead text-xl text-white/70 leading-relaxed">
              When it comes to luxury transportation, the details matter. Whether you're planning a grand wedding entrance, managing VIP corporate travel, or simply treating yourself to a premium weekend getaway, making the right choice ensures a flawless experience.
            </p>

            <h2>The Rise of Premium Mobility</h2>
            <p>
              In recent years, the demand for high-end vehicle rentals has skyrocketed. Clients are no longer just looking to get from point A to point B; they are seeking an experience. This involves stepping into a meticulously maintained Rolls Royce, smelling the premium leather, and enjoying the whisper-quiet cabin of an S-Class.
            </p>

            <blockquote>
              "Luxury is not just about the car; it's about the seamless, anxiety-free experience that comes with it."
            </blockquote>

            <h2>Key Considerations Before Booking</h2>
            <p>
              Before you reserve your next luxury vehicle, consider the following elements to ensure your expectations are met:
            </p>
            <ul>
              <li><strong>Chauffeur vs Self-Drive:</strong> Do you want to relax and catch up on emails in the back seat, or do you crave the thrill of driving a powerful AMG engine yourself?</li>
              <li><strong>Luggage Space:</strong> Ensure the vehicle can comfortably accommodate your bags, especially for airport transfers.</li>
              <li><strong>Cancellation Policies:</strong> Look for flexible booking options that adapt to your changing schedules.</li>
            </ul>

            <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-[var(--gold-400)]/20 text-center">
              <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[var(--gold-400)] mb-2 mt-0">Ready to Experience Luxury?</h3>
              <p className="text-sm text-white/60 mb-6">Explore our curated fleet of premium vehicles available for your next journey.</p>
              <Link href="/cars" className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-[var(--gold-400)] transition">
                Browse Fleet
              </Link>
            </div>

            <p>
              Whatever your choice, partnering with a trusted service like DRIVEIT ensures that your journey will be as spectacular as your destination.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
