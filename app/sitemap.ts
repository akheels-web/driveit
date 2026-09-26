import type { MetadataRoute } from 'next'
import { getCarsFromCMS, getServicesFromCMS } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

/** Regenerated at least every 30 minutes; CMS saves also invalidate it instantly via hooks. */
export const revalidate = 1800

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const now = new Date().toISOString()

  // High-priority core landing pages
  const staticCoreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/cars`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/partner/list-fleet`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dedicated specialized luxury service landing pages
  const dedicatedServiceRoutes: MetadataRoute.Sitemap = [
    '/services/luxury-car-rental',
    '/services/airport-taxi',
    '/services/wedding-cars',
    '/services/corporate-car-rental',
    '/services/private-jet-services',
    '/services/yacht-services',
    '/services/pickup-dropoff',
    '/services/luxury-buses',
    '/services/intercity-cabs',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }))

  // Dynamic content queries: Fleet, Services and Blog
  const [cars, services, posts] = await Promise.all([
    getCarsFromCMS().catch(() => []),
    getServicesFromCMS().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${baseUrl}/cars/${car.slug}`,
    lastModified: car.addedDate || now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const cmsServiceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}${service.href.startsWith('/') ? service.href : `/${service.href}`}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Deduplicate all entries by URL (CMS services matching dedicated pages won't duplicate)
  const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>()

  for (const entry of [
    ...staticCoreRoutes,
    ...dedicatedServiceRoutes,
    ...cmsServiceRoutes,
    ...carRoutes,
    ...blogRoutes,
  ]) {
    sitemapMap.set(entry.url, entry)
  }

  return Array.from(sitemapMap.values())
}
