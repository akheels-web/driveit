import type { Metadata } from 'next'
import {
  extractHomeCmsPayload,
  getCarsFromCMS,
  getSiteSettings,
  getStats,
  getTestimonials,
  resolveMediaUrl,
} from '@/lib/cms'
import { SITE_DEFAULTS } from '@/lib/content-seed'
import { SiteHeader } from '@/components/site-header'
import { HypeHomeClient } from '@/components/home/hype-home-client'
import { SiteFooter } from '@/components/site-footer'

/** ISR: the homepage is rebuilt at most every 5 minutes, or instantly on a CMS save. */
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => ({} as Record<string, any>))
  const title =
    settings.metaTitle || 'DRIVEIT Luxury | Cars, Private Jets & Superyachts — Hyderabad'
  const description =
    settings.metaDescription ||
    'Chauffeured flagship automobiles, exotic self-drive supercars, private jets, and superyachts in Hyderabad.'
  const ogImage = resolveMediaUrl(settings.ogImage, '/rolls-royce-phantom-night.webp')

  return {
    alternates: { canonical: '/' },
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: settings.heroImageAlt || 'DRIVEIT Luxury Flagship Fleet Hyderabad',
        },
      ],
    },
  }
}

export default async function HomePage() {
  const [siteSettings, cars, testimonials, stats] = await Promise.all([
    getSiteSettings(),
    getCarsFromCMS(),
    getTestimonials(),
    getStats(),
  ])

  const headerLogo = resolveMediaUrl(siteSettings.headerLogo, '/logo.png')
  const footerLogo = resolveMediaUrl(siteSettings.footerLogo, headerLogo)
  const headerLogoAlt =
    siteSettings.headerLogoAlt || 'DRIVEIT Luxury Chauffeur & Supercar Rental Logo'
  const footerLogoAlt = siteSettings.footerLogoAlt || 'DRIVEIT Luxury Mobility Hyderabad Logo'
  const phone = siteSettings.contactPhone || SITE_DEFAULTS.contactPhone
  const whatsappNumber = siteSettings.whatsappNumber || SITE_DEFAULTS.whatsappNumber
  const homeCms = extractHomeCmsPayload(siteSettings)

  return (
    <>
      <SiteHeader
        logoSrc={headerLogo}
        logoAlt={headerLogoAlt}
        siteName={siteSettings.siteName || SITE_DEFAULTS.siteName}
        promoEnabled={siteSettings.promoBannerEnabled !== false}
        promoText={siteSettings.promoBannerText}
        promoCode={siteSettings.promoBannerCode}
      />
      <HypeHomeClient
        cars={cars}
        whatsappNumber={whatsappNumber}
        phone={phone}
        homeCms={homeCms}
        testimonials={testimonials}
        stats={stats}
      />
      <SiteFooter
        logoSrc={footerLogo}
        logoAlt={footerLogoAlt}
        phone={phone}
        whatsappNumber={whatsappNumber}
        address={siteSettings.address || SITE_DEFAULTS.address}
        instagramUrl={siteSettings.instagramUrl}
        youtubeUrl={siteSettings.youtubeUrl}
        linkedinUrl={siteSettings.linkedinUrl}
        twitterUrl={siteSettings.twitterUrl}
      />
    </>
  )
}
