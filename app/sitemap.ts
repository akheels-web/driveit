import type { MetadataRoute } from 'next'
import { getCarsFromCMS, getServicesFromCMS, getSiteSettings, resolveMediaUrl } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

/** Always reflects the latest CMS fleet, services, blog articles, and site assets. */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const fallbackNow = new Date().toISOString()

  const toAbsUrl = (asset?: string) => {
    if (!asset) return undefined
    if (/^https?:\/\//i.test(asset)) return asset
    return `${baseUrl}${asset.startsWith('/') ? asset : `/${asset}`}`
  }

  const [settings, cars, services, posts] = await Promise.all([
    getSiteSettings().catch(() => ({} as Record<string, any>)),
    getCarsFromCMS().catch(() => []),
    getServicesFromCMS().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  const siteUpdated = typeof settings?.updatedAt === 'string' ? settings.updatedAt : fallbackNow
  const homeOgImage = toAbsUrl(resolveMediaUrl(settings?.ogImage, '/rolls-royce-phantom-night.webp'))

  const staticCoreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: siteUpdated,
      changeFrequency: 'daily',
      priority: 1.0,
      ...(homeOgImage ? { images: [homeOgImage] } : {}),
    },
    { url: `${baseUrl}/cars`, lastModified: siteUpdated, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/services`, lastModified: siteUpdated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/partner/list-fleet`, lastModified: siteUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: siteUpdated, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/privacy-policy`, lastModified: siteUpdated, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-conditions`, lastModified: siteUpdated, changeFrequency: 'yearly', priority: 0.3 },
  ]

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
    lastModified: siteUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }))

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => {
    const imgs = Array.from(
      new Set(
        [car.src, ...(car.gallery || [])]
          .map((img) => toAbsUrl(img))
          .filter((img): img is string => Boolean(img)),
      ),
    )
    return {
      url: `${baseUrl}/cars/${car.slug}`,
      lastModified: car.updatedAt || car.addedDate || fallbackNow,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      ...(imgs.length > 0 ? { images: imgs } : {}),
    }
  })

  const cmsServiceRoutes: MetadataRoute.Sitemap = services.map((service) => {
    const absImage = toAbsUrl(service.image)
    return {
      url: `${baseUrl}${service.href.startsWith('/') ? service.href : `/${service.href}`}`,
      lastModified: service.updatedAt || siteUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.88,
      ...(absImage ? { images: [absImage] } : {}),
    }
  })

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const absImage = toAbsUrl(post.image)
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.date || fallbackNow,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...(absImage ? { images: [absImage] } : {}),
    }
  })

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
