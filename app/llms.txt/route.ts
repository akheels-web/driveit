import { NextResponse } from 'next/server'
import { getCarsFromCMS, getServicesFromCMS, getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.com').replace(/\/$/, '')

    const [rawSettings, cars, services, posts] = await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, any>)),
      getCarsFromCMS().catch(() => []),
      getServicesFromCMS().catch(() => []),
      getBlogPosts().catch(() => []),
    ])
    const settings = rawSettings as Record<string, any>

    const siteName = settings.siteName || SITE_DEFAULTS.siteName
    const phone = settings.contactPhone || SITE_DEFAULTS.contactPhone
    const email = settings.contactEmail || SITE_DEFAULTS.contactEmail
    const whatsapp = settings.whatsappNumber || SITE_DEFAULTS.whatsappNumber
    const address = settings.address || SITE_DEFAULTS.address

    const carList = cars
      .slice(0, 20)
      .map(
        (c) =>
          `- [${c.name}](${baseUrl}/cars/${c.slug}): ${c.category.toUpperCase()} • ${c.brand} • ${c.priceDisplay} • ${c.seats} Seats • ${c.transmission} • ${c.fuel}`,
      )
      .join('\n')

    const serviceList = services
      .map(
        (s) =>
          `- [${s.title}](${baseUrl}${s.href.startsWith('/') ? s.href : `/${s.href}`}): ${s.summary}${s.price ? ` (from ${s.price})` : ''}`,
      )
      .join('\n')

    const blogList = posts
      .slice(0, 5)
      .map((p) => `- [${p.title}](${baseUrl}/blog/${p.slug}) (${p.date}): ${p.excerpt}`)
      .join('\n')

    const content = `# ${siteName}

> Premier luxury car rental, executive chauffeur services, private aviation charters, and VIP airport mobility in Hyderabad, India.

## Overview
${siteName} offers ultra-luxury mobility across Hyderabad, including Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Financial District, and Rajiv Gandhi International Airport (RGIA).

## Primary Services
${serviceList || '- Luxury Car Rental\n- Chauffeur Driven Transfers\n- Airport VIP Meet & Greet\n- Wedding Cars\n- Private Jet Charters\n- Luxury Coaches & Buses'}

## Available Fleet Highlights
${carList || '- Rolls-Royce Phantom\n- Mercedes-Maybach\n- Range Rover Vogue\n- Lamborghini Gallardo\n- Mercedes S-Class\n- Toyota Vellfire'}

## Latest Articles & Travel Guides
${blogList || '- Top luxury wedding cars in Hyderabad\n- Chauffeur vs self-drive comparison\n- Executive travel guide in HITEC City'}

## Policies & Customer Guarantees
- **Fuel Policy**: Full-to-Full (return with full tank, zero fuel charge).
- **Electronic FASTag**: 100% active FASTag installed for automatic toll lanes.
- **Security Deposit**: Governed transparently with live bank UTR refund tracking in dashboard within 48h after return inspection.
- **Airport Delay Guarantee**: Complimentary 60-minute wait policy from flight touchdown at RGIA Hyderabad.
- **Booking Protection**: Guaranteed reservation hold with 10-minute lock prevents double-booking during checkout.

## Official Concierge & Contact
- **Phone**: ${phone}
- **WhatsApp**: ${whatsapp} (https://wa.me/${whatsapp.replace(/[^0-9]/g, '')})
- **Email**: ${email}
- **Address**: ${address}
- **Website**: ${baseUrl}

## Machine-Readable Resources
- [Full LLM Specification & Complete Catalog](${baseUrl}/llms-full.txt): Complete vehicle specifications, pricing table, and policies.
- [XML Sitemap](${baseUrl}/sitemap.xml): Complete search engine index.
`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    return new NextResponse('# DRIVEIT Luxury\n\nLuxury transportation services in Hyderabad, India.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
