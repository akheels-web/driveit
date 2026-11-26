/**
 * Bootstrap blog entries.
 *
 * These are only shown while the `blogs` collection is empty so a fresh install
 * does not render an empty page. Real articles created in /admin always win.
 */
import { cache } from 'react'
import { isPostgresReachable } from './db'
import { normalizeAssetPath } from './asset-paths'

export type BlogSeedPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  updatedAt?: string
  image: string
  imageAlt?: string
  seoTitle?: string
  seoDescription?: string
  readTimeMinutes: number
  fromCms?: boolean
}

export const blogSeedPosts: BlogSeedPost[] = [
  {
    slug: 'top-5-luxury-wedding-cars-hyderabad',
    title: 'Top 5 Luxury Wedding Cars for a Royal Entrance in Hyderabad',
    excerpt:
      'Make your big day unforgettable with our curated list of the most stunning wedding vehicles available in Hyderabad, from vintage classics to modern Rolls Royces.',
    category: 'Wedding',
    author: 'DriveIt Editorial',
    date: 'Oct 15, 2023',
    image: '/sadan/audi-a6.webp',
    readTimeMinutes: 5,
  },
  {
    slug: 'chauffeur-vs-self-drive',
    title: 'Chauffeur Service vs Self-Drive: Which is Right for You?',
    excerpt:
      'Exploring the pros and cons of hiring a professional chauffeur versus taking the wheel yourself for your next luxury trip or corporate event.',
    category: 'Guides',
    author: 'Michael T.',
    date: 'Nov 02, 2023',
    image: '/trending/range-rover-vogue.webp',
    readTimeMinutes: 4,
  },
  {
    slug: 'corporate-travel-hyderabad-guide',
    title: 'The Ultimate Guide to Executive Corporate Travel in HITEC City',
    excerpt:
      "How to impress your VIP clients and ensure seamless logistics when hosting business delegations in Hyderabad's tech hub.",
    category: 'Corporate',
    author: 'Sarah L.',
    date: 'Dec 12, 2023',
    image: '/suv/mercedes-gls-350d.webp',
    readTimeMinutes: 6,
  },
  {
    slug: 'weekend-getaways-from-hyderabad',
    title: '5 Scenic Weekend Road Trips from Hyderabad in a Luxury SUV',
    excerpt:
      'Take your premium rental out of the city and explore the beautiful landscapes of Telangana and Andhra Pradesh in ultimate comfort.',
    category: 'Travel',
    author: 'DriveIt Editorial',
    date: 'Jan 08, 2024',
    image: '/trending/volvo-xc90.webp',
    readTimeMinutes: 7,
  },
]

export type BlogPostView = BlogSeedPost & { fromCms: boolean }

export const getBlogPosts = cache(async (): Promise<BlogPostView[]> => {
  try {
    const reachable = await isPostgresReachable()
    if (!reachable) {
      return blogSeedPosts.map((post) => ({ ...post, fromCms: false }))
    }

    const { getPayload } = await import('payload')
    const config = (await import('@/payload.config')).default
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'blogs',
      where: { isPublished: { equals: true } },
      sort: '-publishedDate',
      limit: 50,
      overrideAccess: true,
    })

    if (docs.length > 0) {
      return (docs as Record<string, any>[]).map((doc) => ({
        slug: String(doc.slug),
        title: String(doc.title),
        excerpt: String(doc.excerpt),
        category: String(doc.category || 'Blog'),
        author: String(doc.author || 'DriveIt Editorial'),
        date: doc.publishedDate
          ? new Date(doc.publishedDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—',
        updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
        image: normalizeAssetPath(
          typeof doc.coverImage === 'object' && doc.coverImage?.url
            ? doc.coverImage.url
            : doc.coverImageSrc || '/sadan/mercedes-s-350.webp',
        ),
        imageAlt:
          typeof doc.coverImageAlt === 'string' && doc.coverImageAlt.trim()
            ? doc.coverImageAlt.trim()
            : typeof doc.coverImage === 'object' && doc.coverImage?.alt
              ? String(doc.coverImage.alt)
              : String(doc.title),
        seoTitle: typeof doc.seoTitle === 'string' && doc.seoTitle.trim() ? doc.seoTitle.trim() : undefined,
        seoDescription:
          typeof doc.seoDescription === 'string' && doc.seoDescription.trim()
            ? doc.seoDescription.trim()
            : undefined,
        readTimeMinutes: Number(doc.readTimeMinutes) || 5,
        fromCms: true,
      }))
    }
  } catch (_error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[blog] CMS lookup bypassed (Postgres offline), falling back to seed posts.')
    }
  }

  return blogSeedPosts.map((post) => ({ ...post, fromCms: false }))
})

/** Single article by slug — fallback to seed post when offline. */
export const getBlogPost = cache(async (slug: string) => {
  const seed = blogSeedPosts.find((p) => p.slug === slug)

  try {
    const reachable = await isPostgresReachable()
    if (!reachable) {
      return seed ? { ...seed, isPublished: true, content: seed.excerpt } : null
    }

    const { getPayload } = await import('payload')
    const config = (await import('@/payload.config')).default
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'blogs',
      where: { and: [{ slug: { equals: slug } }, { isPublished: { equals: true } }] } as any,
      limit: 1,
      overrideAccess: true,
    })

    if (docs[0]) return docs[0] as Record<string, any>
  } catch (_error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[blog] Single post CMS lookup bypassed, falling back to seed.')
    }
  }

  return seed ? { ...seed, isPublished: true, content: seed.excerpt } : null
})
