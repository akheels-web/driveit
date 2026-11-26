import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  CalendarDays,
  ShieldCheck,
  Users,
  Settings2,
  Fuel,
  Briefcase,
  Snowflake,
  Car as CarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  PlaneLanding,
  Lock,
  ArrowUpRight,
} from 'lucide-react'

import { getCarByIdentifier, getCarsFromCMS } from '@/lib/cms'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CarBookingWidget } from './booking-widget'
import { WishlistButton } from '@/components/wishlist-button'
import { CarCard } from '@/components/car-card'
import { buildVehicleAlt } from '@/lib/asset-paths'
import { formatBrandAndModel } from '@/lib/cars'

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

  const resolvedAlt = buildVehicleAlt({
    imageAlt: car.imageAlt,
    brand: car.brand,
    name: car.name,
    category: car.category,
    context: 'DRIVEIT Luxury Hyderabad',
  })

  return {
    title: `${car.name} Rental Hyderabad | DRIVEIT Luxury`,
    description:
      car.description?.slice(0, 155) ??
      `Rent the ${car.name} in Hyderabad with chauffeur or self-drive options. Transparent pricing from ${car.priceDisplay}.`,
    openGraph: {
      title: `${car.name} — DRIVEIT Luxury Fleet`,
      images: [{ url: car.src, alt: resolvedAlt }],
    },
    alternates: { canonical: `/cars/${car.slug}` },
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [car, allCars] = await Promise.all([getCarByIdentifier(slug), getCarsFromCMS()])

  if (!car) notFound()

  const { brandLabel, modelLabel } = formatBrandAndModel(car.brand, car.name)
  const selfDriveRate = car.selfDrivePrice ?? Math.round(car.price * 0.85)
  const selfDriveSavings = Math.max(0, car.price - selfDriveRate)
  const supportsSelfDrive = car.services.includes('selfdrive')
  const supportsChauffeur = car.services.includes('chauffeur') || car.services.length === 0
  const isCharterOnly = car.category === 'bus'

  const categoryLabels: Record<string, string> = {
    sedan: 'Flagship Saloon',
    sports: 'Supercar & GT',
    suv: 'Executive SUV',
    mpv: 'VIP Lounge MPV',
    bus: 'Private Coach',
  }

  const occasionsByCategory: Record<string, string[]> = {
    sedan: ['Taj Falaknuma Protocol', 'RGIA VIP Meet & Greet', 'Boardroom Chauffeur', 'Royal Baraat Arrival'],
    sports: ['Weekend Expressway Sprint', 'Private Shoot & Gala', 'Concours Entry', 'Self-Drive Privilege'],
    suv: ['Outstation Estate Tours', 'Banjara Hills Executive', 'Convoy Lead', 'Family VIP Comfort'],
    mpv: ['Airport Group Reception', 'Film & Crew Hospitality', 'Diplomatic Delegations', 'Golf & Retreat Transfers'],
    bus: ['Wedding Caravan Logistics', 'Corporate Offsites', '24x7 Event Shuttle', 'Private Charter'],
  }
  const occasions = occasionsByCategory[car.category] ?? occasionsByCategory.sedan

  const comparableCars = allCars
    .filter((item) => item.slug !== car.slug && item.category !== 'bus')
    .sort((a, b) => {
      const aMatch = a.category === car.category ? 0 : 1
      const bMatch = b.category === car.category ? 0 : 1
      if (aMatch !== bMatch) return aMatch - bMatch
      return Math.abs(a.price - car.price) - Math.abs(b.price - car.price)
    })
    .slice(0, 2)

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const canonicalUrl = `${baseUrl}/cars/${car.slug}`
  const absoluteImageUrl = car.src.startsWith('http')
    ? car.src
    : `${baseUrl}${car.src.startsWith('/') ? '' : '/'}${car.src}`

  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.name,
    brand: { '@type': 'Brand', name: car.brand },
    category: categoryLabels[car.category] ?? 'Luxury Automobile',
    image: [absoluteImageUrl],
    description:
      car.description ||
      `Reserve ${car.name} in Hyderabad with chauffeur or self-drive concierge service by DRIVEIT Luxury.`,
    sku: car.slug,
    url: canonicalUrl,
    ...(isCharterOnly
      ? {}
      : {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: Math.min(car.price, selfDriveRate),
            highPrice: Math.max(car.price, selfDriveRate),
            offerCount: supportsSelfDrive ? 2 : 1,
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
          },
        }),
    ...(car.rating > 0 && car.reviewsCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: car.rating.toFixed(1),
            reviewCount: car.reviewsCount,
          },
        }
      : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Fleet', item: `${baseUrl}/cars` },
      { '@type': 'ListItem', position: 3, name: car.name, item: canonicalUrl },
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
      <main className="bg-[#040405] min-h-screen text-white pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-white/45 mb-2">
          <div className="flex items-center flex-wrap gap-y-1">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cars" className="hover:text-white transition">
              Fleet
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#c9a96e]">{car.name}</span>
          </div>
          <WishlistButton carId={car.slug} />
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Seamless #ebebea Light-Grey Studio Stage + Enhanced Vehicle Dossier */}
          <div className="lg:col-span-8 space-y-6">
            {/* Full-Width Seamless #ebebea Light-Grey Studio Card */}
            <div className="relative w-full aspect-[16/10] rounded-[26px] overflow-hidden bg-[#ebebea] shadow-2xl">
              <Image
                src={car.src}
                alt={buildVehicleAlt({
                  imageAlt: car.imageAlt,
                  brand: car.brand,
                  name: car.name,
                  category: car.category,
                  context: 'DRIVEIT Luxury Hyderabad',
                })}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-bottom"
              />

              {/* Top Studio Header Overlay */}
              <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-9 sm:right-9 z-10 flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="font-luxury text-[11px] sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-[#7a6440] font-medium truncate">
                    {brandLabel}
                  </p>
                  <h1 className="font-luxury mt-0.5 sm:mt-1 text-2xl sm:text-5xl font-light tracking-[-0.01em] text-[#111111] truncate">
                    {modelLabel}
                  </h1>
                </div>

                <div className="flex flex-col items-end gap-2 pt-0.5 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/8 text-[10px] font-mono uppercase tracking-[0.22em] text-[#222]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8c734b]" />
                    <span>{isCharterOnly ? 'PRIVÉ CHARTER' : categoryLabels[car.category] ?? 'Flagship Spec'}</span>
                  </span>
                  {car.rating > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#5c5952]">
                      ★ {car.rating.toFixed(1)} · {car.reviewsCount} Verified Drives
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Users, label: 'Capacity', value: `${car.seats} Guests` },
                { icon: Settings2, label: 'Drivetrain', value: car.transmission },
                { icon: Fuel, label: 'Fuel Spec', value: car.fuel },
                { icon: ShieldCheck, label: 'Allocation', value: car.kmAllowance },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-[#09090d] border border-white/10 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/25 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#c9a96e]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      {label}
                    </span>
                    <span className="text-xs font-mono font-medium text-white/90 truncate block mt-0.5">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Executive Dossier & Curated Protocol */}
            <section className="rounded-3xl bg-[#09090d] border border-white/10 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block">
                    01 / EXECUTIVE DOSSIER
                  </span>
                  <h2 className="font-luxury text-2xl sm:text-3xl font-light text-[#f4efe6] mt-1">
                    {car.name} Architecture &amp; Concierge Profile
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
                  {car.specs.year} Concierge Fleet
                </span>
              </div>

              <p className="text-sm sm:text-[15px] text-white/70 leading-relaxed font-light">
                {car.description ||
                  `Commissioned and detailed in our Banjara Hills studio garage, the ${car.name} pairs unmistakable road presence with whisper-quiet cabin composure across Hyderabad’s VVIP corridors — from RGIA Shamshabad private airside transfers to HITEC City diplomatic convoys and royal gala arrivals.`}
              </p>

              {(car.powerHp || car.zeroToHundred || car.topSpeed || car.acousticNote) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {car.powerHp ? (
                    <span className="px-3 py-1 rounded-full bg-[#c9a96e]/12 border border-[#c9a96e]/30 text-[11px] font-mono text-[#c9a96e]">
                      {car.powerHp} BHP Output
                    </span>
                  ) : null}
                  {car.zeroToHundred ? (
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/80">
                      0–100 km/h: {car.zeroToHundred}
                    </span>
                  ) : null}
                  {car.topSpeed ? (
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/80">
                      Top Speed: {car.topSpeed}
                    </span>
                  ) : null}
                  {car.acousticNote ? (
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/80">
                      {car.acousticNote}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {occasions.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-white/75"
                  >
                    <Sparkles className="w-3 h-3 text-[#c9a96e]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* Dual Protocol Comparison: Chauffeur vs Self-Drive */}
            {!isCharterOnly && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[#09090d] border border-[#c9a96e]/30 p-6 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c9a96e]">
                        CHAUFFEUR PROTOCOL
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c9a96e]/15 text-[#c9a96e] text-[9px] font-mono uppercase tracking-[0.2em]">
                        {supportsChauffeur ? 'Available Now' : 'On Request'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-[#f4efe6]">
                        ₹{car.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono text-white/45">/ day</span>
                    </div>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                      Includes vetted multilingual chauffeur in tailored livery, zero security deposit, and priority tarmac or palace staging.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/8 flex items-center gap-2 text-[11px] font-mono text-[#c9a96e]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Zero Refundable Deposit · Fuel-Ready Dispatch</span>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#09090d] border border-white/10 p-6 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-white/55">
                        SELF-DRIVE PRIVILEGE
                      </span>
                      {supportsSelfDrive && selfDriveSavings > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono uppercase tracking-[0.18em]">
                          Save ₹{selfDriveSavings.toLocaleString('en-IN')}/d
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-white/50 text-[9px] font-mono uppercase tracking-[0.18em]">
                          {supportsSelfDrive ? 'KYC Eligible' : 'Concierge Vet Required'}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-[#f4efe6]">
                        ₹{selfDriveRate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono text-white/45">/ day</span>
                    </div>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                      Take the wheel privately across Hyderabad &amp; Telangana. Verified Driving Licence + Aadhaar KYC via Member Vault.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/8 flex items-center gap-2 text-[11px] font-mono text-white/70">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e] shrink-0" />
                    <span>Refundable Deposit: {car.securityDeposit} (48h UTR)</span>
                  </div>
                </div>
              </section>
            )}

            {/* Complete Specification Matrix */}
            <section className="rounded-3xl bg-[#09090d] border border-white/10 p-6 sm:p-8">
              <div className="mb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block">
                  02 / TECHNICAL &amp; HOSPITALITY SPEC
                </span>
                <h2 className="font-luxury text-2xl sm:text-3xl font-light text-[#f4efe6] mt-1">
                  Cabin, Fleet &amp; Policy Matrix
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                {[
                  { icon: CalendarDays, k: 'Model Year Spec', v: `${car.specs.year} Verified Plate` },
                  { icon: Clock, k: 'Studio Odometer', v: car.specs.odometer },
                  { icon: Briefcase, k: 'Luggage Accommodation', v: `${car.specs.bootSpace} Compartment` },
                  { icon: Snowflake, k: 'Climate Architecture', v: car.specs.acZones },
                  { icon: CarIcon, k: 'Fuel & Energy Policy', v: car.fuelPolicy || 'Full-to-Full Fuel' },
                  { icon: CheckCircle2, k: 'Electronic FASTag', v: car.fastTagEquipped !== false ? 'Pre-Loaded & Active' : 'Manual Toll Pass' },
                  { icon: ShieldCheck, k: 'Security Deposit', v: car.securityDeposit },
                  { icon: Lock, k: 'Cancellation Window', v: car.cancellationPolicy },
                ].map(({ icon: Icon, k, v }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 py-3 border-b border-white/8"
                  >
                    <span className="flex items-center gap-2 text-white/50 font-mono uppercase tracking-[0.14em] text-[10px]">
                      <Icon className="w-3.5 h-3.5 text-[#c9a96e]" />
                      {k}
                    </span>
                    <span className="text-white/90 font-mono text-right">{v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* DRIVEIT White-Glove Assurance Strip */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Lock,
                  title: '10-Min Lock Hold',
                  desc: 'Postgres transactional hold secures this exact chassis while you complete booking.',
                },
                {
                  icon: PlaneLanding,
                  title: '60-Min Flight Buffer',
                  desc: 'Complimentary runway touchdown waiting for RGIA & Begumpet arrivals.',
                },
                {
                  icon: ShieldCheck,
                  title: 'UTR Deposit Audit',
                  desc: 'Post-drive return inspection logs bank UTR references right inside your dashboard.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-[#09090d] border border-white/10 p-5 space-y-2"
                >
                  <Icon className="w-4 h-4 text-[#c9a96e]" />
                  <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-[#f4efe6]">
                    {title}
                  </h3>
                  <p className="text-[11px] text-white/55 leading-relaxed font-light">{desc}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Right 4 Columns: Compact Sticky Booking Widget */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <CarBookingWidget car={car} />
          </div>
        </div>

        {/* Comparable Fleet Machines (Reusing CarCard) */}
        {comparableCars.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 mt-20 pt-14 border-t border-white/8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block mb-2">
                  03 / COMPARABLE COMMISSION
                </span>
                <h2 className="font-luxury text-3xl sm:text-4xl font-extralight uppercase text-[#f4efe6]">
                  Explore Similar Machines
                </h2>
              </div>
              <Link
                href="/cars"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#c9a96e] hover:text-white transition"
              >
                <span>All Fleet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {comparableCars.map((peer) => (
                <CarCard key={peer.id} car={peer} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
