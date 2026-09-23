import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { Calendar, User, ChevronLeft, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { blogSeedPosts, getBlogPost, getBlogPosts } from "@/lib/blog-seed"

export const revalidate = 300

type BlogPostPageProps = { params: Promise<{ slug: string }> }

const formatDate = (value: unknown) => {
  if (!value) return "—"
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  const seed = blogSeedPosts.find((entry) => entry.slug === slug)

  const title = post?.title ?? seed?.title
  const description = post?.excerpt ?? seed?.excerpt

  if (!title) return { title: "Article not found | DRIVEIT" }

  return {
    title: `${title} | DRIVEIT Journal`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const [cmsPost, allPosts] = await Promise.all([getBlogPost(slug), getBlogPosts()])
  const seedPost = blogSeedPosts.find((entry) => entry.slug === slug)

  if (!cmsPost && !seedPost) notFound()

  const title = cmsPost?.title ?? seedPost!.title
  const category = cmsPost?.category ?? seedPost?.category ?? "Journal"
  const author = cmsPost?.author ?? seedPost?.author ?? "DriveIt Editorial"
  const date = cmsPost?.publishedDate ? formatDate(cmsPost.publishedDate) : seedPost?.date ?? "—"
  const readTime = Number(cmsPost?.readTimeMinutes) || seedPost?.readTimeMinutes || 5
  const coverImage = cmsPost?.coverImageSrc || cmsPost?.coverImage?.url || seedPost?.image || "/sadan/4.jpg"

  const body = cmsPost?.content
  const hasRichBody = Boolean(body?.root?.children?.length)

  const related = allPosts.filter((post) => post.slug !== slug).slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-24">

        <div className="max-w-4xl mx-auto px-4 py-4 mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--gold-400)] transition">
            <ChevronLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        <article className="max-w-4xl mx-auto px-4 mb-12">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-widest text-[var(--gold-400)] uppercase mb-6">
            <span>{category}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] font-bold leading-tight mb-8">
            {title}
          </h1>

          <div className="flex items-center justify-between border-y border-white/10 py-4 mb-10">
            <div className="flex items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /> {author}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</div>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-white/5">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              priority
              className="object-cover"
            />
          </div>

          {hasRichBody ? (
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-a:text-[var(--gold-400)]">
              <RichText data={body} />
            </div>
          ) : (
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-[family-name:var(--font-playfair)]">
              <p className="lead text-xl text-white/70 leading-relaxed">{cmsPost?.excerpt ?? seedPost?.excerpt}</p>
            </div>
          )}

          <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-[var(--gold-400)]/20 text-center">
            <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[var(--gold-400)] mb-2 mt-0">Ready to Experience Luxury?</h2>
            <p className="text-sm text-white/60 mb-6">Explore our curated fleet of premium vehicles available for your next journey.</p>
            <Link href="/cars" className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-[var(--gold-400)] transition">
              Browse Fleet
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-[family-name:var(--font-playfair)] font-semibold mb-6">More from the Journal</h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {related.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-[var(--gold-400)]/30 transition"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-[var(--gold-400)]">{post.category}</span>
                    <p className="mt-2 text-sm font-medium leading-snug line-clamp-3">{post.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
