import type { Metadata } from 'next'
import { metadata as fallbackMetadata } from './metadata'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Lock, ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { getServiceBySlugFromCMS, getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'
import { DEFAULT_COACH_SHOWCASE } from '@/lib/home-config'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlugFromCMS('luxury-buses')
  if (!service) return fallbackMetadata

  const title = service.seoTitle || fallbackMetadata.title
  const description = service.seoDescription || service.summary || fallbackMetadata.description
  const heroSrc = service.image || '/luxury-coach-interior-black-gold.webp'
  const heroAlt = service.imageAlt || 'Luxury Executive Coach & Lounge Charter Hyderabad — DRIVEIT'

  return {
    ...fallbackMetadata,
    title,
    description,
    keywords: service.seoKeywords?.length ? service.seoKeywords : fallbackMetadata.keywords,
    openGraph: {
      ...fallbackMetadata.openGraph,
      title: String(title),
      description: String(description),
      images: [{ url: heroSrc, width: 1920, height: 1072, alt: heroAlt }],
    },
  }
}

export default async function LuxuryBusesPage() {
  const [service, settings] = await Promise.all([
    getServiceBySlugFromCMS('luxury-buses'),
    getSiteSettings(),
  ])

  const heroSrc = service?.image || '/luxury-coach-interior-black-gold.webp'
  const heroAlt = service?.imageAlt || 'Bespoke obsidian leather and gold luxury lounge coach cabin in Hyderabad'
  const heroTitle = service?.title || 'Luxury Coaches'
  const heroSubtitle =
    service?.heroSubtitle ||
    service?.summary ||
    '14 to 45-Seater Reclining Lounge Buses & Wedding Convoys'
  const heroCta = service?.heroCtaLabel || 'Inquire Privately'
  const coachList =
    service?.showcaseItems && service.showcaseItems.length > 0
      ? service.showcaseItems
      : DEFAULT_COACH_SHOWCASE

  const contactPhone = String(settings?.contactPhone || SITE_DEFAULTS.contactPhone)
  const cleanPhone = contactPhone.replace(/[^+\d]/g, '')
  const whatsappClean = String(settings?.whatsappNumber || SITE_DEFAULTS.whatsappNumber).replace(/[^\d]/g, '')
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: heroTitle,
    description: heroSubtitle,
    provider: {
      '@type': 'Organization',
      name: String(settings?.siteName || SITE_DEFAULTS.siteName),
      url: siteUrl,
    },
    areaServed: ['Hyderabad', 'Secunderabad', 'RGIA Shamshabad', 'Falaknuma'],
    url: `${siteUrl}/services/luxury-buses`,
    image: heroSrc.startsWith('http') ? heroSrc : `${siteUrl}${heroSrc}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
      { '@type': 'ListItem', position: 3, name: heroTitle, item: `${siteUrl}/services/luxury-buses` },
    ],
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-[#040405] text-zinc-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* VISUAL HERO */}
        <section className="relative h-[86svh] min-h-[580px] flex items-end overflow-hidden">
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/50 to-black/30" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12 md:pb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-[#c9a96e]/40 text-[10px] font-mono uppercase tracking-[0.26em] text-[#c9a96e] mb-4">
              <Lock className="w-3 h-3" />
              <span>VIP ENTOURAGE & DELEGATIONS · BESPOKE</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-luxury text-[clamp(2.5rem,6vw,5.5rem)] font-extralight uppercase leading-[0.92] tracking-[0.02em] text-[#f4efe6]">
                  {heroTitle}
                </h1>
                <p className="mt-2 text-xs md:text-sm font-mono uppercase tracking-[0.24em] text-white/65">
                  {heroSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#commission-desk"
                  className="px-6 py-3.5 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[11px] font-mono uppercase tracking-[0.22em] transition inline-flex items-center gap-2"
                >
                  <span>{heroCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hello%20DRIVEIT%20Charter%20Desk%2C%20I%20would%20like%20to%20commission%20a%20luxury%20coach%20or%20convoy.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full border border-white/20 bg-black/60 hover:border-[#c9a96e] text-[11px] font-mono uppercase tracking-[0.2em] text-white inline-flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#c9a96e]" />
                  <span>WhatsApp Charter Desk</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL COACH GALLERY */}
        <section className="mx-auto max-w-7xl px-4 py-20 border-t border-white/8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block mb-2">
                01 / LOUNGE COACHES & VANS
              </span>
              <h2 className="font-luxury text-3xl md:text-4xl font-extralight uppercase text-[#f4efe6]">
                The Fleet
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45">
              By Private Commission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coachList.map((item) => (
              <a
                key={item.model}
                href="#commission-desk"
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black hover:border-[#c9a96e]/50 transition"
              >
                <Image
                  src={item.src}
                  alt={item.imageAlt || `${item.model} — ${item.badgeLabel} by DRIVEIT Luxury`}
                  fill
                  quality={80}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/25 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/75 border border-white/12 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">
                    {item.specs}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/80 border border-[#c9a96e]/40 text-[9px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                    Contact Only
                  </span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c9a96e]">
                      {item.badgeLabel}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light text-[#f4efe6] mt-0.5">
                      {item.model}
                    </h3>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-[#c9a96e] text-black font-bold text-[10px] font-mono uppercase tracking-[0.2em]">
                    {item.ctaLabel || 'Inquire'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* COMMISSION DESK */}
        <section id="commission-desk" className="mx-auto max-w-5xl px-4 py-16 pb-28 scroll-mt-24">
          <div className="rounded-3xl border border-[#c9a96e]/30 bg-[#09090d] p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block mb-1.5">
                  02 / CHARTER DESK
                </span>
                <h3 className="font-luxury text-2xl md:text-3xl font-extralight uppercase text-[#f4efe6]">
                  Request Coach Commission
                </h3>
              </div>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#c9a96e] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contactPhone}</span>
              </a>
            </div>
            <ContactForm defaultService="Luxury Coach & Convoy Charter" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
