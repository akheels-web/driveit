import { NextResponse } from 'next/server'
import { getCarsFromCMS, getFaqs, getServicesFromCMS, getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.com').replace(/\/$/, '')

    const [rawSettings, cars, services, posts, faqs] = await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, any>)),
      getCarsFromCMS().catch(() => []),
      getServicesFromCMS().catch(() => []),
      getBlogPosts().catch(() => []),
      getFaqs().catch(() => []),
    ])
    const settings = rawSettings as Record<string, any>

    const siteName = settings.siteName || SITE_DEFAULTS.siteName
    const phone = settings.contactPhone || SITE_DEFAULTS.contactPhone
    const email = settings.contactEmail || SITE_DEFAULTS.contactEmail
    const whatsapp = settings.whatsappNumber || SITE_DEFAULTS.whatsappNumber
    const address = settings.address || SITE_DEFAULTS.address

    const carDetails = cars
      .map(
        (c) => `### ${c.name}
- **URL**: ${baseUrl}/cars/${c.slug}
- **Brand**: ${c.brand}
- **Category**: ${c.category.toUpperCase()}
- **Rental Rate**: ${c.priceDisplay}
- **Seating Capacity**: ${c.seats} passengers
- **Transmission**: ${c.transmission}
- **Fuel Type**: ${c.fuel}
- **Specifications**: Year: ${c.specs?.year || '2024'} | Boot Space: ${c.specs?.bootSpace || '450L'} | Climate: ${c.specs?.acZones || '4-Zone'} | Odometer: ${c.specs?.odometer || '15,000 km'}
- **Security Deposit**: ${c.securityDeposit || '₹25,000'} (Refundable via bank UTR within 48h)
- **KM Allowance**: ${c.kmAllowance || '100 km/day included'}
- **Fuel Policy**: ${c.fuelPolicy || 'Full-to-Full'}
- **FASTag**: ${c.fastTagEquipped ? 'Equipped with electronic FASTag' : 'Not equipped'}
- **Cancellation**: ${c.cancellationPolicy || 'Free cancellation up to 48 hours before pickup'}
- **Description**: ${c.description || 'Premium flagship vehicle for executive and ceremonial travel.'}
`,
      )
      .join('\n')

    const serviceDetails = services
      .map(
        (s) => `### ${s.title}
- **URL**: ${baseUrl}${s.href.startsWith('/') ? s.href : `/${s.href}`}
- **Summary**: ${s.summary}
- **Starting Price**: ${s.price || 'Bespoke Quote'}
`,
      )
      .join('\n')

    const faqDetails = faqs
      .map(
        (f) => `**Q: ${f.q}**
A: ${f.a}
`,
      )
      .join('\n')

    const blogDetails = posts
      .map(
        (p) => `- [${p.title}](${baseUrl}/blog/${p.slug}) (${p.date} • ${p.readTimeMinutes} min read): ${p.excerpt}`,
      )
      .join('\n')

    const content = `# ${siteName} — Full LLM Specification & Fleet Directory

> Complete machine-readable catalog of luxury vehicles, private aviation, yacht charters, chauffeur services, terms, and FAQs for AI retrieval engines.

## 1. Company Profile
- **Company**: ${siteName}
- **City & Hub**: Hyderabad, Telangana, India
- **Key Service Regions**: Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Financial District, Begumpet, Secunderabad, RGIA Shamshabad Airport.
- **Support & Voice**: ${phone}
- **WhatsApp Concierge**: ${whatsapp} (https://wa.me/${whatsapp.replace(/[^0-9]/g, '')})
- **Email**: ${email}
- **Office Location**: ${address}
- **Website**: ${baseUrl}

## 2. Complete Active Fleet Catalog
${carDetails || 'No vehicles currently listed in the fleet directory.'}

## 3. Comprehensive Service Directory
${serviceDetails || 'No services currently listed in the directory.'}

## 4. Frequently Asked Questions
${faqDetails || 'No FAQs currently listed.'}

## 5. Journal & Guides
${blogDetails || 'No journal entries listed.'}

## 6. Verification, KYC & Booking Safety
- **KYC Vault**: Self-drive customers must upload a valid Driving License and Govt ID (Aadhaar/Passport).
- **Concurrency Hold**: The booking engine secures a 10-minute guaranteed reservation hold so vehicles cannot be double-booked.
- **Deposit Refund Policy**: Admin verifies return inspection; security deposits are refunded within 48 hours with verifiable bank UTR reference numbers.
- **VIP Touchdown Delay Guarantee**: Complimentary 60-minute wait policy from flight landing for airport arrivals.
`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    return new NextResponse('# DRIVEIT Luxury — Full Catalog\n\nFull vehicle specifications and services directory.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
