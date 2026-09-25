import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CarDetails, carsData } from './cars'
import {
  FaqView,
  SITE_DEFAULTS,
  ServiceView,
  StatView,
  TestimonialView,
  faqSeed,
  serviceSeed,
  statsSeed,
  testimonialSeed,
} from './content-seed'

export { SITE_DEFAULTS }

/**
 * CMS-backed fleet access.
 *
 * The static catalogue in `lib/cars.ts` is only a bootstrap seed for installs
 * that have not added any cars in /admin yet — real content always wins.
 */

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export function resolveMediaUrl(media: any, fallback: string = ''): string {
  if (!media) return fallback
  if (typeof media === 'string' && media.trim()) return media.trim()
  if (typeof media === 'object' && typeof media.url === 'string' && media.url.trim()) return media.url.trim()
  return fallback
}

type CarDoc = Record<string, any>

function resolveImage(doc: CarDoc): string {
  return resolveMediaUrl(
    doc.image,
    typeof doc.imageSrc === 'string' && doc.imageSrc.trim() ? doc.imageSrc.trim() : '/placeholder.jpg',
  )
}

export function mapCarDoc(doc: CarDoc): CarDetails {
  const price = Number(doc.pricePerDay ?? doc.price ?? 0)
  const gallery = Array.isArray(doc.gallery)
    ? (doc.gallery
        .map((entry: any) => resolveMediaUrl(entry?.image, typeof entry?.src === 'string' ? entry.src : ''))
        .filter(Boolean) as string[])
    : undefined

  return {
    id: String(doc.id),
    slug: doc.slug || slugify(String(doc.name ?? '')),
    name: String(doc.name ?? 'Luxury Car'),
    src: resolveImage(doc),
    gallery: gallery && gallery.length > 0 ? gallery : undefined,
    brand: doc.brand || 'Luxury',
    category: doc.category || 'sedan',
    price,
    priceDisplay: `₹${price.toLocaleString('en-IN')}/day`,
    seats: Number(doc.seats) || 5,
    transmission: doc.transmission || 'Automatic',
    fuel: doc.fuel || doc.fuelType || 'Petrol',
    services: Array.isArray(doc.services) && doc.services.length > 0 ? doc.services : ['chauffeur'],
    description: typeof doc.description === 'string' && doc.description.trim() ? doc.description.trim() : undefined,
    rating: Number(doc.rating) || 0,
    reviewsCount: Number(doc.reviewsCount) || 0,
    bookingsCount: Number(doc.bookingsCount) || 0,
    addedDate: doc.createdAt || new Date().toISOString(),
    specs: {
      bootSpace: doc.specs?.bootSpace || '450L',
      acZones: doc.specs?.acZones || '4-Zone Climate Control',
      year: doc.specs?.year || '2024',
      odometer: doc.specs?.odometer || '15,000 km',
    },
    cancellationPolicy:
      doc.cancellationPolicy || 'Free cancellation up to 48 hours before pickup.',
    kmAllowance: doc.kmAllowance || '100 km/day included.',
    securityDeposit: doc.securityDeposit || '₹25,000',
    securityDepositAmount: Number(doc.securityDepositAmount ?? 25000),
    fuelPolicy: doc.fuelPolicy || 'Full-to-Full (Return full tank, pay ₹0 fuel fee)',
    fastTagEquipped: doc.fastTagEquipped !== false,
  }
}

/** Active fleet from the CMS, or the bootstrap seed when the CMS is still empty. */
export const getCarsFromCMS = cache(async (): Promise<CarDetails[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'cars',
      where: { isActive: { equals: true } },
      sort: 'sortOrder',
      limit: 200,
      depth: 1,
      overrideAccess: true,
    })

    if (docs.length > 0) return docs.map(mapCarDoc)
  } catch (error) {
    console.error(
      '[cms] Failed to load fleet from Payload:',
      error instanceof Error ? error.message : error,
    )
  }

  console.warn(
    '[cms] No active cars in the CMS — serving the bootstrap seed catalogue from lib/cars.ts. ' +
      'Add cars in /admin and set `isActive` to replace it.',
  )
  return carsData
})

/**
 * Finds a car by slug, name or numeric id. Used by checkout, which receives
 * either a slug (from the fleet pages) or a legacy identifier (seed catalogue id).
 */
export async function getCarByIdentifier(identifier: string): Promise<CarDetails | null> {
  const needle = identifier?.trim()
  if (!needle) return null

  try {
    const payload = await getPayload({ config: configPromise })

    for (const where of [
      { slug: { equals: needle } },
      { name: { equals: needle } },
      ...(/^\d+$/.test(needle) ? [{ id: { equals: Number(needle) } }] : []),
    ]) {
      const { docs } = await payload.find({
        collection: 'cars',
        where: where as any,
        limit: 1,
        depth: 1,
        overrideAccess: true,
      })
      if (docs[0]) return mapCarDoc(docs[0] as CarDoc)
    }
  } catch (error) {
    console.error(
      '[cms] Car lookup failed:',
      error instanceof Error ? error.message : error,
    )
  }

  // Bootstrap seed fallback so a fresh install can still take bookings.
  const seed =
    carsData.find((car) => car.slug === needle || car.name === needle || car.id === needle) ?? null
  return seed
}

/** Global branding/contact document, with safe defaults when none is saved yet. */
export const getSiteSettings = cache(async (): Promise<Record<string, any>> => {
  try {
    const payload = await getPayload({ config: configPromise })
    return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as Record<string, any>
  } catch (error) {
    console.error('[cms] Failed to load site settings:', error instanceof Error ? error.message : error)
    return {}
  }
})

/** Published client reviews for the homepage slider. */
export const getTestimonials = cache(async (): Promise<TestimonialView[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'testimonials',
      where: { isPublished: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      overrideAccess: true,
    })

    const mapped = docs.map((doc: Record<string, any>) => ({
      name: String(doc.author ?? 'Verified Client'),
      role: String(doc.role || doc.company || 'Verified Client'),
      image: typeof doc.avatarSrc === 'string' && doc.avatarSrc ? doc.avatarSrc : '/placeholder-user.jpg',
      quote: String(doc.content ?? ''),
      rating: Math.min(5, Math.max(1, Number(doc.rating) || 5)),
      fromCms: true,
    }))

    if (mapped.length > 0) return mapped
  } catch (error) {
    console.error('[cms] Failed to load testimonials:', error instanceof Error ? error.message : error)
  }

  return testimonialSeed
})

/** Published service catalogue for /services. */
export const getServicesFromCMS = cache(async (): Promise<ServiceView[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'services',
      where: { isPublished: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })

    const mapped = docs.map((doc: Record<string, any>) => ({
      title: String(doc.title),
      slug: String(doc.slug),
      href: `/services/${doc.slug}`,
      summary: String(doc.shortDescription ?? ''),
      price: typeof doc.price === 'string' && doc.price ? doc.price : undefined,
      image:
        doc.imageSrc ||
        (doc.image && typeof doc.image === 'object' ? (doc.image.url ?? undefined) : undefined),
      fromCms: true,
    }))

    if (mapped.length > 0) return mapped
  } catch (error) {
    console.error('[cms] Failed to load services:', error instanceof Error ? error.message : error)
  }

  return serviceSeed
})

/** Homepage counter stats, editable under Site Settings. */
export async function getStats(): Promise<StatView[]> {
  const settings = await getSiteSettings()
  const rows = Array.isArray(settings.stats) ? settings.stats : []
  const mapped = rows
    .filter((row: Record<string, any>) => row?.label)
    .map((row: Record<string, any>) => ({
      label: String(row.label),
      value: Number(row.value) || 0,
      suffix: String(row.suffix ?? ''),
    }))

  return mapped.length > 0 ? mapped : statsSeed
}

/** Homepage FAQ entries, editable under Site Settings. */
export async function getFaqs(): Promise<FaqView[]> {
  const settings = await getSiteSettings()
  const rows = Array.isArray(settings.faqs) ? settings.faqs : []
  const mapped = rows
    .filter((row: Record<string, any>) => row?.question && row?.answer)
    .map((row: Record<string, any>) => ({ q: String(row.question), a: String(row.answer) }))

  return mapped.length > 0 ? mapped : faqSeed
}
