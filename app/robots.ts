import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/cms'

export const dynamic = 'force-dynamic'

const DEFAULT_PRIVATE_PATHS = [
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
  '/thankyou',
  '/contactus',
]

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Applebot-Extended',
]

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const settings = await getSiteSettings().catch(() => ({} as Record<string, any>))

  const allowAiCrawlers = settings?.allowAiCrawlers !== false
  const extraDisallow =
    typeof settings?.extraRobotsDisallow === 'string' && settings.extraRobotsDisallow.trim()
      ? settings.extraRobotsDisallow
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter((line: string) => line.startsWith('/'))
      : []

  const disallowPaths = Array.from(new Set([...DEFAULT_PRIVATE_PATHS, ...extraDisallow]))

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
      allowAiCrawlers
        ? {
            userAgent: AI_CRAWLERS,
            allow: '/',
            disallow: disallowPaths,
          }
        : {
            userAgent: AI_CRAWLERS,
            disallow: '/',
          },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
