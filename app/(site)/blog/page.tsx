import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    slug: "top-5-luxury-wedding-cars-hyderabad",
    title: "Top 5 Luxury Wedding Cars for a Royal Entrance in Hyderabad",
    excerpt: "Make your big day unforgettable with our curated list of the most stunning wedding vehicles available in Hyderabad, from vintage classics to modern Rolls Royces.",
    category: "Wedding",
    author: "Driveit Editorial",
    date: "Oct 15, 2023",
    image: "/sadan/8.jpg"
  },
  {
    slug: "chauffeur-vs-self-drive",
    title: "Chauffeur Service vs Self-Drive: Which is Right for You?",
    excerpt: "Exploring the pros and cons of hiring a professional chauffeur versus taking the wheel yourself for your next luxury trip or corporate event.",
    category: "Guides",
    author: "Michael T.",
    date: "Nov 02, 2023",
    image: "/trending/4.jpg"
  },
  {
    slug: "corporate-travel-hyderabad-guide",
    title: "The Ultimate Guide to Executive Corporate Travel in HITEC City",
    excerpt: "How to impress your VIP clients and ensure seamless logistics when hosting business delegations in Hyderabad's tech hub.",
    category: "Corporate",
    author: "Sarah L.",
    date: "Dec 12, 2023",
    image: "/suv/2.jpg"
  },
  {
    slug: "weekend-getaways-from-hyderabad",
    title: "5 Scenic Weekend Road Trips from Hyderabad in a Luxury SUV",
    excerpt: "Take your premium rental out of the city and explore the beautiful landscapes of Telangana and Andhra Pradesh in ultimate comfort.",
    category: "Travel",
    author: "Driveit Editorial",
    date: "Jan 08, 2024",
    image: "/trending/6.jpg"
  }
]

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] font-bold mb-4">
              The <span className="text-gradient-gold">Luxury</span> Journal
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
              Discover the latest trends in premium transportation, travel guides, and insights from the world of luxury mobility in Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post, i) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[var(--gold-400)]/30 transition-all duration-500">
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-[var(--gold-400)] uppercase">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</div>
                  </div>
                  
                  <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-bold mb-3 group-hover:text-[var(--gold-400)] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-white/50 text-sm mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-[var(--gold-400)] font-medium text-sm group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  )
}
