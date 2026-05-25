import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.driveitluxury.com'
  const lastmod = new Date().toISOString()

  const routes = [
    '/',
    '/about',
    '/contact',
    '/contactus',
    '/cars',
    '/thankyou',
    '/services',
    '/services/airport-taxi',
    '/services/luxury-car-rental',
    '/services/pickup-dropoff',
    '/services/luxury-buses',
    '/services/wedding-cars',
    '/services/corporate-car-rental',
    '/services/intercity-cabs',
    '/services/private-jet-services',
    '/services/yacht-services',
    '/privacy-policy',
    '/terms-conditions',
    '/refund-policy',
  ]

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastmod,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
