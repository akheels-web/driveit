import type { Metadata } from 'next'
import { metadata as fallbackMetadata } from './metadata'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Lock, ArrowRight, MessageCircle, Phone, Anchor, ShieldCheck, Clock, Award } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { getServiceBySlugFromCMS, getSiteSettings, SITE_DEFAULTS } from '@/lib/cms'
import { DEFAULT_YACHT_SHOWCASE } from '@/lib/home-config'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlugFromCMS('yacht-services')
  if (!service) return fallbackMetadata

  const title = service.seoTitle || fallbackMetadata.title
  const description = service.seoDescription || service.summary || fallbackMetadata.description
  const heroSrc = service.image || '/yachts/benetti-oasis-40m-superyacht.webp'
  const heroAlt = service.imageAlt || 'Benetti Oasis 40m Superyacht Charter — DRIVEIT Privé'

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

export default async function YachtServicesPage() {
  const [service, settings] = await Promise.all([
    getServiceBySlugFromCMS('yacht-services'),
    getSiteSettings(),
  ])

  const heroSrc = service?.image || '/yachts/benetti-oasis-40m-superyacht.webp'
  const heroAlt = service?.imageAlt || 'Benetti Oasis 40M private superyacht charter at twilight — DRIVEIT Privé'
  const heroTitle = service?.title || 'Superyachts'
  const heroSubtitle =
    service?.heroSubtitle ||
    service?.summary ||
    'Private Deck Soirées · Sunset Harbor Cruises & Coastal Voyages'
  const heroCta = service?.heroCtaLabel || 'Inquire Privately'
  const yachtList =
    service?.showcaseItems && service.showcaseItems.length > 0
      ? service.showcaseItems
      : DEFAULT_YACHT_SHOWCASE

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
    areaServed: ['Hyderabad', 'Hussain Sagar', 'Goa Marina', 'Mumbai Harbour'],
    url: `${siteUrl}/services/yacht-services`,
    image: heroSrc.startsWith('http') ? heroSrc : `${siteUrl}${heroSrc}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
      { '@type': 'ListItem', position: 3, name: heroTitle, item: `${siteUrl}/services/yacht-services` },
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

        {/* FULL-SCREEN VISUAL HERO */}
        <section className="relative h-[86svh] min-h-[580px] flex items-end overflow-hidden">
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            priority
            quality={88}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/50 to-black/30" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12 md:pb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-[#c9a96e]/40 text-[10px] font-mono uppercase tracking-[0.26em] text-[#c9a96e] mb-4">
              <Lock className="w-3 h-3" />
              <span>DRIVEIT MARINE · BY PRIVATE COMMISSION</span>
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
                  className="px-6 py-3.5 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[11px] font-mono uppercase tracking-[0.22em] transition inline-flex items-center gap-2 shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                >
                  <span>{heroCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hello%20DRIVEIT%20Marine%20Desk%2C%20I%20would%20like%20to%20commission%20a%20private%20yacht%20charter.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full border border-white/20 bg-black/60 hover:border-[#c9a96e] text-[11px] font-mono uppercase tracking-[0.2em] text-white inline-flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#c9a96e]" />
                  <span>WhatsApp Marine Desk</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL YACHT FLEET GALLERY (2 CARDS IN A ROW - PURE YACHTS ONLY) */}
        <section className="mx-auto max-w-7xl px-4 py-20 border-t border-white/8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block mb-2">
                01 / MARINE FLEET
              </span>
              <h2 className="font-luxury text-3xl md:text-5xl font-extralight uppercase text-[#f4efe6]">
                The Yacht Vessels
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/45">
              <span className="w-2 h-2 rounded-full bg-[#c9a96e]" />
              <span>Contact Only · No Online Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {yachtList.map((yacht) => (
              <div
                key={yacht.model}
                className="group rounded-3xl bg-[#09090d] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#c9a96e]/50 transition-all duration-300 shadow-xl"
              >
                {/* Visual Image Stage */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden p-6 sm:p-7 flex flex-col justify-between">
                  {/* Top Overlay Badge */}
                  <div className="relative z-10 flex items-start justify-between gap-3 pointer-events-none select-none">
                    <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/12">
                      <p className="text-[9px] font-mono uppercase tracking-[0.28em] text-[#c9a96e] font-semibold">
                        {yacht.badgeLabel}
                      </p>
                      <h3 className="font-luxury text-xl sm:text-2xl font-light text-[#f4efe6] uppercase tracking-wide mt-0.5">
                        {yacht.model}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#c9a96e]/40 text-[9px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                      <span>Contact Only</span>
                    </div>
                  </div>

                  {/* Yacht Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={yacht.src}
                      alt={yacht.imageAlt || `${yacht.badgeLabel} ${yacht.model} superyacht charter — DRIVEIT Privé`}
                      fill
                      quality={88}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Subtle Gradient Vignette */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Dark Obsidian Bottom Strip */}
                <div className="p-5 sm:p-6 bg-[#0c0c10] border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-[#c9a96e]">
                      {yacht.specs}
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-light">
                      {yacht.highlightTag}
                    </p>
                  </div>

                  <a
                    href="#commission-desk"
                    className="shrink-0 px-5 py-3 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[10px] font-mono uppercase tracking-[0.22em] transition inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{yacht.ctaLabel || 'Inquire'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARITIME PROTOCOL METRICS */}
        <section className="mx-auto max-w-7xl px-4 py-12 border-t border-white/8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Private Pier Boarding',
                desc: 'Discreet boarding arrangements with dedicated chauffeur transfers directly to the gangway.',
                Icon: Anchor,
              },
              {
                title: 'Private Executive Chef',
                desc: 'Tailored 5-course fine dining, champagne sommelier, and bespoke canapé cocktail service.',
                Icon: Award,
              },
              {
                title: 'Licensed Maritime Crew',
                desc: 'Fully certified master captains, deckhands, and stewards prioritizing passenger privacy.',
                Icon: ShieldCheck,
              },
              {
                title: 'Celebration Styling',
                desc: 'Custom floral arrangements, acoustic deck setup, and drone videography for milestone moments.',
                Icon: Clock,
              },
            ].map((feature) => {
              const Icon = feature.Icon
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl bg-[#09090d] border border-white/8 flex flex-col gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#c9a96e]/15 border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-medium text-white mt-1">{feature.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* COMMISSION DESK FORM */}
        <section id="commission-desk" className="mx-auto max-w-5xl px-4 py-16 pb-28 scroll-mt-24">
          <div className="rounded-3xl border border-[#c9a96e]/30 bg-[#09090d] p-6 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block mb-1.5">
                  02 / MARINE DESK
                </span>
                <h3 className="font-luxury text-2xl md:text-3xl font-extralight uppercase text-[#f4efe6]">
                  Request Yacht Commission
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  Our private marine concierge will prepare vessel options, catering menus, and bespoke charter itineraries.
                </p>
              </div>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#c9a96e] hover:underline shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contactPhone}</span>
              </a>
            </div>
            <ContactForm defaultService="Superyacht & Marine Charter" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
