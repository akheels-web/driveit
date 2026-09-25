import type { Metadata } from 'next'
import {
  getCarsFromCMS,
  getFaqs,
  getServicesFromCMS,
  getSiteSettings,
  getStats,
  getTestimonials,
  resolveMediaUrl,
} from '@/lib/cms'
import { SITE_DEFAULTS } from '@/lib/content-seed'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Hero from "@/components/hero"
import { MarqueeStrip } from "@/components/marquee-strip"
import { Stats } from "@/components/stats"
import { Showcase } from "@/components/showcase"
import Mision from "@/components/Mision"
import { TrendingGrid } from "@/components/trending-grid"
import { ProcessTimeline } from "@/components/process-timeline"
import { BookingSection } from "@/components/booking-section"
import { FleetCarousel } from "@/components/fleet-carousel"
import Testomonials from "@/components/Testomonials"
import { FAQ } from "@/components/faq"
import { About } from "@/components/about"
import { TrustStrip } from "@/components/trust-strip"

/** ISR: the homepage is rebuilt at most every 5 minutes, or instantly on a CMS save. */
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: "DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad | Book Online",
  description: "Book premium luxury cars in Hyderabad online. Choose from our elite fleet of Rolls Royce, Mercedes, BMW, Range Rover and more for weddings, corporate travel, airport transfers. Serving Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, and all Hyderabad areas.",
  keywords: [
    "luxury car rental Hyderabad",
    "premium car booking online",
    "wedding car rental Hyderabad",
    "chauffeur service Hyderabad",
    "airport transfer Hyderabad",
    "Rolls Royce rental Hyderabad",
    "Mercedes rental Hyderabad",
    "BMW rental Hyderabad",
    "Range Rover rental Hyderabad",
    "luxury bus hire Hyderabad",
    "corporate car rental Hyderabad",
    "private jet Hyderabad",
    "self drive cars Hyderabad",
    "luxury car Jubilee Hills",
    "car rental Banjara Hills",
    "car rental HITEC City",
    "car rental Gachibowli",
    "car rental Madhapur",
    "car rental Kondapur",
    "wedding car Shamshabad",
    "airport taxi Hyderabad",
    "luxury cab Hyderabad",
  ],
}

export default async function HomePage() {
  // One round-trip for all homepage content instead of serial CMS calls.
  const [siteSettings, testimonials, stats, faqs, cars, services] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
    getStats(),
    getFaqs(),
    getCarsFromCMS(),
    getServicesFromCMS(),
  ])

  const headerLogo = resolveMediaUrl(siteSettings.headerLogo, '/logo.png')
  const footerLogo = resolveMediaUrl(siteSettings.footerLogo, headerLogo)
  const heroImage = resolveMediaUrl(siteSettings.heroImage, '/rolls-royce-phantom-night.png')
  const missionImage = resolveMediaUrl(siteSettings.missionImage, '/luxury-flagship-cars-in-black-studio.png')

  return (
    <>
      <SiteHeader logoSrc={headerLogo} siteName={siteSettings.siteName} />
      <main className="bg-[var(--luxury-bg)] text-zinc-100">
        {/* Hero — Full viewport cinematic */}
        <section id="home">
          <Hero
            videoUrl={siteSettings.headerVideoUrl as string | undefined}
            heroImageSrc={heroImage}
            subtitle={siteSettings.heroSubtitle}
            headingLine1={siteSettings.heroHeadingLine1}
            headingLine2={siteSettings.heroHeadingLine2}
          />
          <MarqueeStrip />
          <Stats items={stats} />
        </section>

        {/* Booking — Primary CTA */}
        <BookingSection />
        
        {/* Trust & Promos */}
        <TrustStrip />

        {/* Showcase & Mission */}
        <section id="services" className="content-auto">
          <Showcase services={services} />
          <Mision
            badge={siteSettings.missionBadge}
            title={siteSettings.missionTitle}
            text={siteSettings.missionText}
            imageSrc={missionImage}
          />
          <TrendingGrid services={services} />
          <ProcessTimeline />
        </section>

        {/* Fleet */}
        <div className="content-auto">
          <FleetCarousel cars={cars} />
        </div>

        {/* Social Proof & Info */}
        <section id="about" className="content-auto">
          <Testomonials testimonials={testimonials} />
          <FAQ faqs={faqs} />
          <About
            phone={siteSettings.contactPhone || SITE_DEFAULTS.contactPhone}
            mapEmbedUrl={siteSettings.mapEmbedUrl || SITE_DEFAULTS.mapEmbedUrl}
            mapLink={siteSettings.mapLink || SITE_DEFAULTS.mapLink}
          />
        </section>

        {/* Footer */}
        <SiteFooter
          logoSrc={footerLogo}
          description={siteSettings.footerDescription}
          phone={siteSettings.contactPhone || SITE_DEFAULTS.contactPhone}
          email={siteSettings.contactEmail || SITE_DEFAULTS.contactEmail}
          address={siteSettings.address || SITE_DEFAULTS.address}
          instagramUrl={siteSettings.instagramUrl}
          facebookUrl={siteSettings.facebookUrl}
          linkedinUrl={siteSettings.linkedinUrl}
          twitterUrl={siteSettings.twitterUrl}
        />
      </main>
    </>
  )
}
