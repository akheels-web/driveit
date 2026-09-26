import type { MetadataRoute } from 'next'

const PRIVATE_PATHS = [
  '/admin',
  '/admin/*',
  '/api',
  '/api/*',
  '/checkout',
  '/checkout/*',
  '/dashboard',
  '/dashboard/*',
  '/login',
  '/signup',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Bytespider',
          'CCBot',
          'cohere-ai',
          'Meta-ExternalAgent',
          'FacebookBot',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
