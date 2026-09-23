import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight } from "lucide-react"
import { getBlogPosts } from "@/lib/blog-seed"

/** ISR: refreshed every 5 minutes, or immediately when an editor saves a post. */
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: "Luxury Travel Journal | Car Rental & Chauffeur Insights | DRIVEIT",
  description:
    "Guides, trends and stories from the world of luxury mobility in Hyderabad — wedding cars, corporate travel, weekend getaways and chauffeur tips.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

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

          {posts.length === 0 ? (
            <p className="text-center text-white/50">No articles published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[var(--gold-400)]/30 transition-all duration-500"
                >
                  <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
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
                      <div className="hidden sm:block">{post.readTimeMinutes} min read</div>
                    </div>

                    <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-bold mb-3 group-hover:text-[var(--gold-400)] transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-white/50 text-sm mb-6 flex-1 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center text-[var(--gold-400)] font-medium text-sm group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>
      <SiteFooter />
    </>
  )
}
