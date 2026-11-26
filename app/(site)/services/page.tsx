import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Lock, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getServicesFromCMS } from '@/lib/cms'

/** ISR: rebuilt at most every 5 minutes, or instantly on a CMS save. */
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  title: 'Luxury Mobility & Private Commissions Hyderabad | DRIVEIT Luxury',
  description:
    'Explore DRIVEIT Luxury divisions in Hyderabad: Chauffeur & Self-Drive Flagships, Private Jet Charters, Superyacht Voyages, Royal Wedding Motorcades, and Luxury Coaches.',
}

export default async function ServicesPage() {
  const services = await getServicesFromCMS()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(
    /\/$/,
    '',
  )

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.summary,
        url: `${baseUrl}${service.href}`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'DRIVEIT Luxury',
          url: baseUrl,
        },
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${baseUrl}/services`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="bg-[#050507] text-zinc-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.32em] text-[#c9a96e]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sovereign Mobility Divisions · Hyderabad</span>
            </div>
            <h1 className="font-luxury text-4xl md:text-6xl font-extralight uppercase leading-[0.95] text-[#f4efe6]">
              Every Mode of <span className="text-[#c9a96e]">Command.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
              Reserve chauffeur-driven and exotic self-drive automobiles online in seconds, or brief our Privé Desk for private aviation, superyacht charters, and multi-vehicle convoys.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const isContactOnly =
                service.slug.includes('jet') ||
                service.slug.includes('yacht') ||
                service.slug.includes('bus')

              return (
                <Link
                  key={service.slug}
                  href={service.href}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#111117] to-[#09090d] flex flex-col justify-between hover:border-[#c9a96e]/45 transition-all duration-500 hover:-translate-y-1"
                >
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-black">
                      <Image
                        src={service.image || '/rolls-royce-phantom-night.webp'}
                        alt={service.imageAlt || `${service.title} luxury mobility service in Hyderabad by DRIVEIT`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized={Boolean(service.image?.startsWith('http'))}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-black/30" />

                      <div className="absolute top-3.5 left-3.5">
                        {isContactOnly ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#c9a96e]/40 text-[9px] font-mono uppercase tracking-wider text-[#c9a96e]">
                            <Lock className="w-3 h-3" /> Private Commission · Contact Only
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wider text-emerald-300">
                            Instant Online Booking
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-2.5">
                      <h2 className="text-xl font-semibold text-white group-hover:text-[#c9a96e] transition">
                        {service.title}
                      </h2>
                      <p className="text-xs text-white/60 leading-relaxed">{service.summary}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#c9a96e]">
                      {service.price || (isContactOnly ? 'Contact Only' : 'Book Online')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-white/85 group-hover:text-[#c9a96e] transition">
                      <span>{isContactOnly ? 'Request Commission' : 'Explore'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
