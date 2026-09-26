import type { Metadata } from 'next'
import Image from 'next/image'
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getServicesFromCMS } from '@/lib/cms'

/** ISR: rebuilt at most every 5 minutes, or instantly on a CMS save. */
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  title: "Luxury Car Services Hyderabad | Corporate, Airport, Events | DRIVEIT Luxury",
  description: "Explore our premium luxury car services in Hyderabad. We offer professional chauffeur service, corporate rentals, wedding cars, and airport transfers.",
}

export default async function ServicesPage() {
  const services = await getServicesFromCMS()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')

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
      <main className="bg-black text-zinc-100">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="text-3xl font-semibold text-gold">Our Services</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            Chauffeur-driven and self-drive options across Hyderabad — every itinerary tailored to you.
          </p>

          {services.length === 0 ? (
            <p className="mt-8 text-sm text-zinc-400">Our service catalogue is being updated. Please check back shortly.</p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <li key={service.slug} className="overflow-hidden rounded-lg border border-neutral-800 bg-surface">
                  {service.image && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized={service.image.startsWith('http')}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{service.title}</h2>
                    <p className="mt-2 text-sm text-zinc-400">{service.summary}</p>
                    {service.price && <p className="mt-2 text-sm text-gold">{service.price}</p>}
                    <Link href={service.href} className="mt-3 inline-flex text-sm text-gold hover:underline">
                      Explore →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
