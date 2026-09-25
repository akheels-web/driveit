import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Star,
  Users,
  Settings2,
  Fuel,
  Briefcase,
  Snowflake,
  Car as CarIcon,
  Shield,
  Award,
} from 'lucide-react'

import { getCarByIdentifier, getCarsFromCMS } from '@/lib/cms'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CarBookingWidget } from './booking-widget'
import { WishlistButton } from '@/components/wishlist-button'
import { PersonalizedSocialProof } from '@/components/personalized-social-proof'

// Fleet edits revalidate these paths via the hooks in payload.config.ts.
export const revalidate = 300

export async function generateStaticParams() {
  const cars = await getCarsFromCMS()
  return cars.map((car) => ({ slug: car.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const car = await getCarByIdentifier(slug)

  if (!car) return { title: 'Vehicle not found | DRIVEIT Luxury' }

  return {
    title: `${car.name} Rental Hyderabad | DRIVEIT Luxury`,
    description:
      car.description?.slice(0, 155) ??
      `Rent the ${car.name} in Hyderabad with chauffeur or self-drive options. Transparent pricing from ${car.priceDisplay}.`,
    openGraph: {
      title: `${car.name} — DRIVEIT Luxury Fleet`,
      images: [{ url: car.src }],
    },
    alternates: { canonical: `/cars/${car.slug}` },
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = await getCarByIdentifier(slug)

  if (!car) notFound()

  const gallery = car.gallery && car.gallery.length > 0 ? car.gallery : [car.src]
  const hasRatings = car.reviewsCount > 0 && car.rating > 0
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.com').replace(/\/$/, '')
  const carUrl = `${baseUrl}/cars/${car.slug}`

  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': ['Car', 'Product'],
    name: car.name,
    description: car.description || `Rent ${car.name} in Hyderabad with chauffeur or self-drive options.`,
    image: gallery,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    vehicleConfiguration: `${car.category}, ${car.seats} seats, ${car.transmission}, ${car.fuel}`,
    seatingCapacity: car.seats,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    modelDate: car.specs?.year || '2024',
    offers: {
      '@type': 'Offer',
      url: carUrl,
      price: car.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/UsedCondition',
    },
    ...(hasRatings
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: car.rating,
            reviewCount: car.reviewsCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
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
        name: 'Luxury Fleet',
        item: `${baseUrl}/cars`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: car.name,
        item: carUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-white/40 mb-2">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>{' '}
          &rsaquo;
          <Link href="/cars" className="hover:text-white transition ml-2">
            Fleet
          </Link>{' '}
          &rsaquo;
          <span className="text-white ml-2">{car.name}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[500px]">
            <div className="md:col-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src={gallery[0]}
                alt={`${car.name} luxury car rental Hyderabad`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized={gallery[0].startsWith('http')}
              />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {[gallery[1] ?? gallery[0], gallery[2] ?? gallery[0]].map((src, index) => (
                <div key={`${src}-${index}`} className="relative flex-1 rounded-2xl overflow-hidden">
                  <Image
                    src={src}
                    alt={`${car.name} gallery image ${index + 2}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                    unoptimized={src.startsWith('http')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-2 text-[var(--gold-400)] text-sm font-semibold tracking-wider uppercase">
                <Award className="w-4 h-4" /> {car.brand} • {car.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold mb-4">
                {car.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm border-b border-white/10 pb-6">
                {hasRatings && (
                  <>
                    <div className="flex items-center gap-1 text-[var(--gold-400)] font-medium">
                      <Star className="w-4 h-4 fill-current" /> {car.rating}{' '}
                      <span className="text-white/40 font-normal">({car.reviewsCount} reviews)</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                  </>
                )}
                <PersonalizedSocialProof carSlug={car.slug} globalBookings={car.bookingsCount} />
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Available for your dates
                </div>
              </div>
            </div>

            {car.description && (
              <section>
                <h2 className="text-xl font-semibold mb-4">About this vehicle</h2>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{car.description}</p>
              </section>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-6">Key specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: `${car.seats} Seats` },
                  { icon: Settings2, label: car.transmission },
                  { icon: Fuel, label: car.fuel },
                  { icon: Briefcase, label: car.specs.bootSpace },
                  { icon: Snowflake, label: car.specs.acZones },
                  { icon: CalendarDays, label: `${car.specs.year} Model` },
                  { icon: CarIcon, label: car.specs.odometer },
                  { icon: ShieldCheck, label: car.kmAllowance },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2"
                  >
                    <Icon className="w-6 h-6 text-white/50" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6">Why book this vehicle?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: 'Comprehensive insurance',
                    copy: 'Fully covered for collision, damage and third-party liabilities so you drive stress-free.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Strict sanitisation',
                    copy: 'A 30-point hygiene check and interior sanitisation before every trip.',
                  },
                  {
                    icon: Users,
                    title: 'Vetted chauffeurs',
                    copy: 'Minimum five years of experience, background checks and white-glove training.',
                  },
                  {
                    icon: CalendarDays,
                    title: 'Transparent deposit & cancellation',
                    copy: `${car.cancellationPolicy} Refundable security deposit of ${car.securityDeposit || '₹25,000'} released in 24–48 hours post inspection.`,
                  },
                  {
                    icon: Fuel,
                    title: 'Full-to-Full Fuel & Electronic FASTag',
                    copy: 'Delivered with a full tank — return with the same level with zero fuel surcharge. Non-stop electronic FASTag toll lanes included.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Exact Car Guarantee',
                    copy: 'The vehicle photographed and described is the exact vehicle delivered to your doorstep. Zero bait-and-switch.',
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="flex gap-4">
                    <Icon className="w-8 h-8 text-[var(--gold-400)] shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{title}</h3>
                      <p className="text-sm text-white/50">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="flex justify-end pr-2">
                <WishlistButton carId={car.slug} />
              </div>
              <CarBookingWidget car={car} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
