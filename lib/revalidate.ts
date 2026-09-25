import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Cache invalidation for ISR pages, sitemaps, RSS feeds, and LLM discoverability files.
 *
 * Public pages opt into ISR (`export const revalidate = N`), so a CMS edit must
 * explicitly invalidate the affected routes — otherwise editors "save" and see
 * nothing change for minutes.
 */

const SEO_DISCOVERY_ROUTES = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt']

const ROUTES_BY_COLLECTION: Record<string, string[]> = {
  cars: ['/', '/cars', '/checkout', '/dashboard/wishlist', '/api/fleet', ...SEO_DISCOVERY_ROUTES],
  blogs: ['/blog', '/feed.xml', ...SEO_DISCOVERY_ROUTES],
  services: ['/', '/services', ...SEO_DISCOVERY_ROUTES],
  testimonials: ['/', '/about'],
  coupons: ['/checkout'],
  media: ['/', '/cars', '/blog', ...SEO_DISCOVERY_ROUTES],
  partner_applications: ['/partner/list-fleet'],
}

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch (error) {
    // Revalidation can be a no-op during build/seed runs — never fail a save over it.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[revalidate] skipped ${path}:`, error instanceof Error ? error.message : error)
    }
  }
}

function revalidateForCollection(slug: string, doc?: Record<string, any> | null) {
  for (const path of ROUTES_BY_COLLECTION[slug] ?? []) safeRevalidate(path)

  if (slug === 'cars' && doc?.slug) safeRevalidate(`/cars/${doc.slug}`)
  if (slug === 'blogs' && doc?.slug) safeRevalidate(`/blog/${doc.slug}`)
  if (slug === 'services' && doc?.slug) safeRevalidate(`/services/${doc.slug}`)
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  revalidateForCollection(collection.slug, doc as Record<string, any>)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  revalidateForCollection(collection.slug, doc as Record<string, any>)
  return doc
}

export const revalidateAfterGlobalChange: GlobalAfterChangeHook = ({ doc, global }) => {
  if (global.slug === 'site-settings') {
    safeRevalidate('/')
    safeRevalidate('/about')
    safeRevalidate('/contact')
    safeRevalidate('/api/site-settings')
    for (const route of SEO_DISCOVERY_ROUTES) safeRevalidate(route)
  }
  return doc
}

/**
 * Attaches the revalidation hooks to a collection.
 *
 * Payload only allows `afterError` at the config level, so these wrap each
 * collection instead — any hooks the collection already declares are preserved.
 */
export function withRevalidation(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), revalidateAfterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), revalidateAfterDelete],
    },
  }
}
