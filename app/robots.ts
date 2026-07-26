import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/admin', '/api', '/checkout'],
      }
    ],
    sitemap: 'https://www.driveitluxury.com/sitemap.xml',
  }
}
