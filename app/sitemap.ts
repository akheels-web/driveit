import type { MetadataRoute } from 'next'
import { getCarsFromCMS, getServicesFromCMS } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

/** Regenerated hourly; CMS saves also invalidate the affected pages. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.com').replace(/\/$/, '')
  const lastmod = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/cars',
    '/blog',
    '/services',
    '/privacy-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastmod,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fleet, services and journal all fall back to their seed content, so a fresh
  // install still submits a complete sitemap instead of an almost-empty one.
  const [cars, services, posts] = await Promise.all([
    getCarsFromCMS().catch(() => []),
    getServicesFromCMS().catch(() => []),
    getBlogPosts().catch(() => []),
  ])

  return [
    ...staticRoutes,
    ...cars.map((car) => ({
      url: `${baseUrl}/cars/${car.slug}`,
      lastModified: car.addedDate || lastmod,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...services.map((service) => ({
      url: `${baseUrl}${service.href}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: lastmod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
