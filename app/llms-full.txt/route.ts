import { NextResponse } from 'next/server'
import { extractHomeCmsPayload, getCarsFromCMS, getFaqs, getServicesFromCMS, getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'
import { getBlogPosts } from '@/lib/blog-seed'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')

    const [rawSettings, cars, services, posts, faqs] = await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, any>)),
      getCarsFromCMS().catch(() => []),
      getServicesFromCMS().catch(() => []),
      getBlogPosts().catch(() => []),
      getFaqs().catch(() => []),
    ])
    const settings = rawSettings as Record<string, any>
    const homeCms = extractHomeCmsPayload(settings)

    const siteName = settings.siteName || SITE_DEFAULTS.siteName
    const phone = settings.contactPhone || SITE_DEFAULTS.contactPhone
    const email = settings.contactEmail || SITE_DEFAULTS.contactEmail
    const whatsapp = settings.whatsappNumber || SITE_DEFAULTS.whatsappNumber
    const address = settings.address || SITE_DEFAULTS.address
    const overview =
      (typeof settings.llmsSummaryIntro === 'string' && settings.llmsSummaryIntro.trim()) ||
      'Complete machine-readable catalog of luxury vehicles, private aviation, yacht charters, chauffeur services, terms, and FAQs.'

    const carDetails = cars
      .map(
        (c) => `### ${c.name}
- **URL**: ${baseUrl}/cars/${c.slug}
- **Brand**: ${c.brand}
- **Category**: ${c.category.toUpperCase()}
- **Chauffeur Rate**: ${c.priceDisplay}${c.selfDrivePrice ? `\n- **Self-Drive Rate**: ₹${c.selfDrivePrice.toLocaleString('en-IN')}/day` : ''}${c.powerHp ? `\n- **Performance**: ${c.powerHp} HP${c.zeroToHundred ? ` · 0–100 km/h ${c.zeroToHundred}` : ''}${c.topSpeed ? ` · Top Speed ${c.topSpeed}` : ''}` : ''}
- **Seating Capacity**: ${c.seats} passengers
- **Transmission**: ${c.transmission}
- **Fuel Type**: ${c.fuel}
- **Specifications**: Year: ${c.specs?.year || '2024'} | Boot Space: ${c.specs?.bootSpace || '450L'} | Climate: ${c.specs?.acZones || '4-Zone'} | Odometer: ${c.specs?.odometer || '15,000 km'}
- **Security Deposit**: ${c.securityDeposit || '₹25,000'} (Refundable via bank UTR within 48h)
- **KM Allowance**: ${c.kmAllowance || '100 km/day included'}
- **Fuel Policy**: ${c.fuelPolicy || 'Full-to-Full'}
- **FASTag**: ${c.fastTagEquipped ? 'Equipped with electronic FASTag' : 'Not equipped'}
- **Cancellation**: ${c.cancellationPolicy || 'Free cancellation up to 48 hours before pickup'}
- **Description**: ${c.description || c.tagline || 'Premium flagship vehicle for executive and ceremonial travel.'}
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

    const priveDetails = homeCms.beyondPanels
      .map(
        (panel) => `### ${panel.title}
- **URL**: ${baseUrl}${panel.href}
- **Category**: ${panel.eyebrow}
- **Fleet / Vessels**: ${panel.subtitle}
- **Capacity**: ${panel.capacity}
- **Highlights**: ${panel.highlights.join(' | ')}
`,
      )
      .join('\n')

    const protocolDetails = homeCms.protocols
      .map(
        (p) => `- **${p.tag} — ${p.title}**: ${p.subtitle} · Assigned Flagship: ${p.flagshipName} (${p.tariffFormatted}) · Pickup: ${p.pickupHub}${p.flightSyncSupported ? ' · Flight-Sync Enabled' : ''} · Highlights: ${p.highlights.join(' | ')}`,
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

> ${overview}

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

## 4. Privé Beyond-Road Aviation, Marine & Coach Charters
${priveDetails}

## 5. Curated Mobility Protocols & VIP Occasions
${protocolDetails}

## 6. Frequently Asked Questions
${faqDetails || 'No FAQs currently listed.'}

## 7. Blog & Editorial Guides
${blogDetails || 'No blog entries listed.'}

## 8. Verification, KYC & Booking Safety
- **KYC Vault**: Self-drive customers must upload a valid Driving License and Govt ID (Aadhaar/Passport).
- **Concurrency Hold**: The booking engine secures a 10-minute guaranteed reservation hold so vehicles cannot be double-booked.
- **Deposit Refund Policy**: Admin verifies return inspection; security deposits are refunded within 48 hours with verifiable bank UTR reference numbers.
- **VIP Touchdown Delay Guarantee**: Complimentary 60-minute wait policy from flight landing for airport arrivals.
`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
      },
    })
  } catch {
    return new NextResponse('# DRIVEIT Luxury — Full Catalog\n\nFull vehicle specifications and services directory.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
