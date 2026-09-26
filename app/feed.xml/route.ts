import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog-seed'
import { getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
    const [rawSettings, posts] = await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, any>)),
      getBlogPosts().catch(() => []),
    ])
    const settings = rawSettings as Record<string, any>

    const siteName = settings.siteName || SITE_DEFAULTS.siteName
    const description =
      settings.metaDescription ||
      'Guides, trends and stories from the world of luxury mobility in Hyderabad — wedding cars, corporate travel, and chauffeur tips.'

    const itemsXml = posts
      .map((post) => {
        const postUrl = `${baseUrl}/blog/${post.slug}`
        const pubDate = new Date(post.date || Date.now()).toUTCString()
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.author || 'DriveIt Editorial'}</author>
      <category>${post.category || 'Luxury Travel'}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`
      })
      .join('\n')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName} Journal]]></title>
    <link>${baseUrl}/blog</link>
    <description><![CDATA[${description}]]></description>
    <language>en-in</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    return new NextResponse('<rss version="2.0"><channel><title>DRIVEIT</title></channel></rss>', {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  }
}
