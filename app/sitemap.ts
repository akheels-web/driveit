import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.driveitluxury.com'
  const lastmod = new Date().toISOString()
  const payload = await getPayload({ config })

  // Base static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/cars',
    '/services',
    '/privacy-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastmod,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Car Routes
  try {
    const cars = await payload.find({ collection: 'cars', limit: 100 })
    cars.docs.forEach((car) => {
      routes.push({
        url: `${baseUrl}/cars/${car.slug}`,
        lastModified: car.updatedAt || lastmod,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    })
  } catch (err) {}

  // Dynamic Blog Routes
  try {
    const blogs = await payload.find({ collection: 'blogs', limit: 100 })
    blogs.docs.forEach((blog) => {
      routes.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || lastmod,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    })
  } catch (err) {}

  return routes
}
