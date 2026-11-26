import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { isPostgresReachable } from './db'
import { CarDetails, carsData } from './cars'
import { normalizeAssetPath } from './asset-paths'
import type { EngineType } from './engine-audio'
import {
  DEFAULT_BEYOND_PANELS,
  DEFAULT_HERO_SCENES,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_PICKUP_HUBS,
  DEFAULT_PROTOCOLS,
  DEFAULT_VIP_CORRIDORS,
  type BespokeProtocolConfig,
  type BeyondPanelConfig,
  type HeroSceneConfig,
  type HomeSectionsConfig,
  type PickupHubConfig,
  type ServiceShowcaseItem,
  type StudioHotspotConfig,
  type VipCorridorConfig,
} from './home-config'
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
 * In-memory cache & circuit-breaker for ultra-fast (<1ms) page transitions.
 * Invalidated automatically when CMS documents are updated or after 60s TTL.
 */
const CACHE_TTL_MS = 60_000
const CIRCUIT_BREAKER_MS = 30_000
const DB_TIMEOUT_MS = 900

type CacheEntry<T> = { value: T; expiresAt: number }

const memCache: {
  cars?: CacheEntry<CarDetails[]>
  siteSettings?: CacheEntry<Record<string, any>>
  testimonials?: CacheEntry<TestimonialView[]>
  services?: CacheEntry<RichServiceView[]>
  dbDownUntil: number
} = {
  dbDownUntil: 0,
}

export function invalidateCmsMemoryCache() {
  memCache.cars = undefined
  memCache.siteSettings = undefined
  memCache.testimonials = undefined
  memCache.services = undefined
}

async function withFastDbTimeout<T>(fn: () => Promise<T>): Promise<T> {
  if (Date.now() < memCache.dbDownUntil) {
    throw new Error('DB circuit breaker active')
  }
  const reachable = await isPostgresReachable()
  if (!reachable) {
    memCache.dbDownUntil = Date.now() + CIRCUIT_BREAKER_MS
    throw new Error('Postgres unreachable')
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  // Attach a no-op catch to the underlying promise so if the timer wins the race,
  // a late rejection from `task` never triggers `unhandledRejection`.
  const task = fn()
  task.catch(() => {})

  try {
    return await Promise.race([
      task,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('CMS DB query timed out')), DB_TIMEOUT_MS)
      }),
    ])
  } catch (err) {
    memCache.dbDownUntil = Date.now() + CIRCUIT_BREAKER_MS
    throw err
  } finally {
    if (timer) clearTimeout(timer)
  }
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export function resolveMediaUrl(media: any, fallback: string = ''): string {
  if (!media) return normalizeAssetPath(fallback)
  if (typeof media === 'string' && media.trim()) return normalizeAssetPath(media.trim())
  if (typeof media === 'object' && typeof media.url === 'string' && media.url.trim()) {
    return normalizeAssetPath(media.url.trim())
  }
  return normalizeAssetPath(fallback)
}

type CarDoc = Record<string, any>

const STUDIO_BY_SLUG = new Map(carsData.map((c) => [c.slug, c.src]))

function resolveImage(doc: CarDoc): string {
  const uploaded = resolveMediaUrl(doc.image, '')
  if (
    uploaded &&
    (uploaded.startsWith('http') || uploaded.startsWith('/media/') || uploaded.startsWith('/api/media/'))
  ) {
    return uploaded
  }

  const slug = doc.slug || slugify(String(doc.name ?? ''))
  const studioMatch = STUDIO_BY_SLUG.get(slug)
  if (studioMatch) return studioMatch

  const raw =
    typeof doc.imageSrc === 'string' && doc.imageSrc.trim()
      ? normalizeAssetPath(doc.imageSrc.trim())
      : '/studio/rolls-royce-phantom.webp?v=5'
  return raw.includes('?') ? raw : `${raw}?v=4`
}

const VALID_ENGINE_TYPES = new Set<EngineType>([
  'v12-whisper',
  'v8-twinturbo',
  'v8-hybrid',
  'v8-amg',
  'v10-screamer',
])

export function mapCarDoc(doc: CarDoc): CarDetails {
  const price = Number(doc.pricePerDay ?? doc.price ?? 0)
  const selfDrivePrice =
    doc.selfDrivePricePerDay != null && doc.selfDrivePricePerDay !== ''
      ? Number(doc.selfDrivePricePerDay)
      : Math.round(price * 0.85)

  const galleryEntries = Array.isArray(doc.gallery)
    ? doc.gallery
        .map((entry: any) => ({
          url: resolveMediaUrl(entry?.image, typeof entry?.src === 'string' ? entry.src : ''),
          alt: typeof entry?.alt === 'string' ? entry.alt.trim() : '',
        }))
        .filter((e: { url: string }) => Boolean(e.url))
    : []
  const gallery = galleryEntries.map((e: { url: string }) => e.url)
  const galleryAlts = galleryEntries.map((e: { alt: string }) => e.alt)

  const studioHotspots: StudioHotspotConfig[] | undefined = Array.isArray(doc.studioHotspots)
    ? doc.studioHotspots
        .filter((h: any) => h?.label)
        .map((h: any, idx: number) => ({
          id: String(h.id || `hs-${idx + 1}`),
          label: String(h.label),
          specBadge: String(h.specBadge || ''),
          detail: String(h.detail || ''),
          x: typeof h.x === 'number' ? h.x : Number(h.x) || 50,
          y: typeof h.y === 'number' ? h.y : Number(h.y) || 50,
        }))
    : undefined

  const audioCandidate = String(doc.engineAudioProfile || '') as EngineType
  const uploadedAlt =
    typeof doc.image === 'object' && typeof doc.image?.alt === 'string' && doc.image.alt.trim()
      ? doc.image.alt.trim()
      : undefined
  const imageAlt =
    typeof doc.imageAlt === 'string' && doc.imageAlt.trim() ? doc.imageAlt.trim() : uploadedAlt

  return {
    id: String(doc.id),
    slug: doc.slug || slugify(String(doc.name ?? '')),
    name: String(doc.name ?? 'Luxury Car'),
    src: resolveImage(doc),
    imageAlt,
    gallery: gallery.length > 0 ? gallery : undefined,
    galleryAlts: galleryAlts.some(Boolean) ? galleryAlts : undefined,
    brand: doc.brand || 'Luxury',
    category: doc.category || 'sedan',
    price,
    selfDrivePrice,
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
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : doc.createdAt,
    featuredInStudioStage: Boolean(doc.featuredInStudioStage),
    tagline: typeof doc.tagline === 'string' && doc.tagline.trim() ? doc.tagline.trim() : undefined,
    powerHp: typeof doc.powerHp === 'number' && doc.powerHp > 0 ? doc.powerHp : undefined,
    zeroToHundred:
      typeof doc.zeroToHundred === 'string' && doc.zeroToHundred.trim()
        ? doc.zeroToHundred.trim()
        : undefined,
    topSpeed: typeof doc.topSpeed === 'string' && doc.topSpeed.trim() ? doc.topSpeed.trim() : undefined,
    acousticNote:
      typeof doc.acousticNote === 'string' && doc.acousticNote.trim()
        ? doc.acousticNote.trim()
        : undefined,
    engineAudioProfile: VALID_ENGINE_TYPES.has(audioCandidate) ? audioCandidate : undefined,
    studioHotspots: studioHotspots && studioHotspots.length > 0 ? studioHotspots : undefined,
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
  const now = Date.now()
  if (memCache.cars && memCache.cars.expiresAt > now) {
    return memCache.cars.value
  }

  try {
    const docs = await withFastDbTimeout(async () => {
      const payload = await getPayload({ config: configPromise })
      const res = await payload.find({
        collection: 'cars',
        where: { isActive: { equals: true } },
        sort: 'sortOrder',
        limit: 200,
        depth: 1,
        overrideAccess: true,
      })
      return res.docs
    })

    if (docs.length > 0) {
      const dbCars = docs.map(mapCarDoc)
      const dbSlugs = new Set(dbCars.map((c) => c.slug))
      const topFlagships = carsData.slice(0, 6).filter((c) => !dbSlugs.has(c.slug))
      const merged = [...topFlagships, ...dbCars]
      memCache.cars = { value: merged, expiresAt: Date.now() + CACHE_TTL_MS }
      return merged
    }
  } catch {
    // Fallback to seed data immediately
  }

  memCache.cars = { value: carsData, expiresAt: Date.now() + CACHE_TTL_MS }
  return carsData
})

/**
 * Finds a car by slug, name or numeric id.
 */
export async function getCarByIdentifier(identifier: string): Promise<CarDetails | null> {
  const needle = identifier?.trim()
  if (!needle) return null

  const fleet = await getCarsFromCMS()
  const fromFleet =
    fleet.find((car) => car.slug === needle || car.name === needle || car.id === needle) ?? null
  if (fromFleet) return fromFleet

  const seed =
    carsData.find((car) => car.slug === needle || car.name === needle || car.id === needle) ?? null
  return seed
}

/** Global branding/contact document, with safe defaults when none is saved yet. */
export const getSiteSettings = cache(async (): Promise<Record<string, any>> => {
  const now = Date.now()
  if (memCache.siteSettings && memCache.siteSettings.expiresAt > now) {
    return memCache.siteSettings.value
  }

  try {
    const settings = await withFastDbTimeout(async () => {
      const payload = await getPayload({ config: configPromise })
      return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as Record<string, any>
    })
    memCache.siteSettings = { value: settings, expiresAt: Date.now() + CACHE_TTL_MS }
    return settings
  } catch {
    memCache.siteSettings = { value: {}, expiresAt: Date.now() + CACHE_TTL_MS }
    return {}
  }
})

/** Published client reviews for the homepage slider. */
export const getTestimonials = cache(async (): Promise<TestimonialView[]> => {
  const now = Date.now()
  if (memCache.testimonials && memCache.testimonials.expiresAt > now) {
    return memCache.testimonials.value
  }

  try {
    const docs = await withFastDbTimeout(async () => {
      const payload = await getPayload({ config: configPromise })
      const res = await payload.find({
        collection: 'testimonials',
        where: { isPublished: { equals: true } },
        sort: 'sortOrder',
        limit: 50,
        depth: 1,
        overrideAccess: true,
      })
      return res.docs
    })

    const mapped = docs.map((doc: Record<string, any>) => {
      const name = String(doc.author ?? 'Verified Client')
      return {
        name,
        role: String(doc.role || doc.company || 'Verified Client'),
        image: resolveMediaUrl(doc.avatar, doc.avatarSrc || '/placeholder-user.webp'),
        imageAlt:
          typeof doc.avatarAlt === 'string' && doc.avatarAlt.trim()
            ? doc.avatarAlt.trim()
            : `${name} — DRIVEIT Luxury client portrait`,
        quote: String(doc.content ?? ''),
        rating: Math.min(5, Math.max(1, Number(doc.rating) || 5)),
        fromCms: true,
      }
    })

    if (mapped.length > 0) {
      memCache.testimonials = { value: mapped, expiresAt: Date.now() + CACHE_TTL_MS }
      return mapped
    }
  } catch {
    // Fallback to seed
  }

  memCache.testimonials = { value: testimonialSeed, expiresAt: Date.now() + CACHE_TTL_MS }
  return testimonialSeed
})

/** Published service catalogue for /services. */
export const getServicesFromCMS = cache(async (): Promise<RichServiceView[]> => {
  const now = Date.now()
  if (memCache.services && memCache.services.expiresAt > now) {
    return memCache.services.value
  }

  try {
    const docs = await withFastDbTimeout(async () => {
      const payload = await getPayload({ config: configPromise })
      const res = await payload.find({
        collection: 'services',
        where: { isPublished: { equals: true } },
        sort: 'sortOrder',
        limit: 50,
        depth: 1,
        overrideAccess: true,
      })
      return res.docs
    })

    const mapped = docs.map((doc: Record<string, any>) => ({
      title: String(doc.title),
      slug: String(doc.slug),
      href: `/services/${doc.slug}`,
      summary: String(doc.shortDescription ?? ''),
      price: typeof doc.price === 'string' && doc.price ? doc.price : undefined,
      image: resolveMediaUrl(doc.image, doc.imageSrc || '') || undefined,
      imageAlt:
        typeof doc.imageAlt === 'string' && doc.imageAlt.trim()
          ? doc.imageAlt.trim()
          : `${String(doc.title)} by DRIVEIT Luxury Hyderabad`,
      heroSubtitle:
        typeof doc.heroSubtitle === 'string' && doc.heroSubtitle.trim() ? doc.heroSubtitle.trim() : undefined,
      heroCtaLabel:
        typeof doc.heroCtaLabel === 'string' && doc.heroCtaLabel.trim() ? doc.heroCtaLabel.trim() : undefined,
      seoTitle: typeof doc.seoTitle === 'string' && doc.seoTitle.trim() ? doc.seoTitle.trim() : undefined,
      seoDescription:
        typeof doc.seoDescription === 'string' && doc.seoDescription.trim()
          ? doc.seoDescription.trim()
          : undefined,
      seoKeywords:
        typeof doc.seoKeywords === 'string' && doc.seoKeywords.trim()
          ? doc.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
          : undefined,
      showcaseItems: Array.isArray(doc.showcaseItems)
        ? doc.showcaseItems
            .filter((item: any) => item?.model)
            .map((item: any): ServiceShowcaseItem => ({
              badgeLabel: String(item.badgeLabel || 'DRIVEIT PRIVÉ'),
              model: String(item.model),
              specs: String(item.specs || ''),
              highlightTag: String(item.highlightTag || ''),
              src: resolveMediaUrl(item.image, item.imageSrc || ''),
              imageAlt: String(item.imageAlt || `${item.badgeLabel || 'DRIVEIT'} ${item.model}`).trim(),
              ctaLabel: String(item.ctaLabel || 'Inquire'),
            }))
        : undefined,
      updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
      fromCms: true,
    }))

    if (mapped.length > 0) {
      memCache.services = { value: mapped, expiresAt: Date.now() + CACHE_TTL_MS }
      return mapped
    }
  } catch {
    // Fallback to seed
  }

  memCache.services = { value: serviceSeed, expiresAt: Date.now() + CACHE_TTL_MS }
  return serviceSeed
})

export const getServiceBySlugFromCMS = cache(async (slug: string): Promise<RichServiceView | null> => {
  const services = await getServicesFromCMS()
  return (services.find((s) => s.slug === slug) as RichServiceView | undefined) ?? null
})

export interface RichServiceView extends ServiceView {
  icon?: string
  imageAlt?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  showcaseItems?: ServiceShowcaseItem[]
  updatedAt?: string
}

export function extractHomeCmsPayload(settings: Record<string, any>) {
  const rawScenes = Array.isArray(settings.heroScenes) ? settings.heroScenes : []
  const heroScenes: HeroSceneConfig[] =
    rawScenes.length > 0
      ? rawScenes
          .filter((s: any) => s?.title)
          .map((s: any, idx: number): HeroSceneConfig => ({
            id: String(s.id || `scene-${idx + 1}`),
            tabLabel: String(s.tabLabel || `0${idx + 1} / ${String(s.title).toUpperCase().slice(0, 14)}`),
            kicker: String(s.kicker || 'FLAGSHIP CHAUFFEUR · HYDERABAD'),
            title: String(s.title),
            subtitle: String(s.subtitle || ''),
            badge: String(s.badge || 'Flagship Spec'),
            src: resolveMediaUrl(s.image, s.src || '/rolls-royce-phantom-night.webp'),
            imageAlt: String(s.imageAlt || `${s.title} — DRIVEIT Luxury Hyderabad`),
            ctaLabel: String(s.ctaLabel || 'Explore Fleet'),
            ctaHref: String(s.ctaHref || '/cars'),
          }))
      : DEFAULT_HERO_SCENES

  const rawHubs = Array.isArray(settings.pickupHubs) ? settings.pickupHubs : []
  const pickupHubs: PickupHubConfig[] =
    rawHubs.length > 0
      ? rawHubs
          .filter((h: any) => h?.label && h?.active !== false)
          .map((h: any) => ({
            label: String(h.label),
            zoneTag: String(h.zoneTag || ''),
            active: h.active !== false,
          }))
      : DEFAULT_PICKUP_HUBS

  const rawPanels = Array.isArray(settings.beyondPanels) ? settings.beyondPanels : []
  const beyondPanels: BeyondPanelConfig[] =
    rawPanels.length > 0
      ? rawPanels
          .filter((p: any) => p?.title)
          .map((p: any, idx: number): BeyondPanelConfig => ({
            key: String(p.key || `panel-${idx + 1}`),
            number: String(p.number || `0${idx + 1}`),
            eyebrow: String(p.eyebrow || 'DRIVEIT PRIVÉ'),
            title: String(p.title),
            subtitle: String(p.subtitle || ''),
            capacity: String(p.capacity || ''),
            highlights:
              typeof p.highlightsText === 'string' && p.highlightsText.trim()
                ? p.highlightsText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean)
                : [],
            src: resolveMediaUrl(p.image, p.src || '/gulfstream-g650-private-jet-on-tarmac-night.webp'),
            imageAlt: String(p.imageAlt || `${p.title} — ${p.subtitle || 'DRIVEIT Privé'}`),
            href: String(p.href || '/services'),
            serviceName: String(p.serviceName || p.title),
            ctaLabel: String(p.ctaLabel || 'Request Commission'),
            directBook: Boolean(p.directBook),
          }))
      : DEFAULT_BEYOND_PANELS

  const rawProtocols = Array.isArray(settings.protocols) ? settings.protocols : []
  const protocols: BespokeProtocolConfig[] =
    rawProtocols.length > 0
      ? rawProtocols
          .filter((p: any) => p?.title)
          .map((p: any, idx: number): BespokeProtocolConfig => ({
            id: String(p.protocolId || p.id || `protocol-${idx + 1}`),
            tag: String(p.tag || `PROTOCOL 0${idx + 1}`),
            title: String(p.title),
            subtitle: String(p.subtitle || ''),
            description: String(p.description || ''),
            flagshipSlug: String(p.flagshipSlug || 'rolls-royce-phantom'),
            flagshipName: String(p.flagshipName || 'Rolls-Royce Phantom VIII'),
            tariffFormatted: String(p.tariffFormatted || '₹1,85,000 / Day'),
            serviceMode: p.serviceMode === 'selfdrive' ? 'selfdrive' : 'chauffeur',
            pickupHub: String(p.pickupHub || 'RGIA Airport (Shamshabad)'),
            bannerImage: resolveMediaUrl(
              p.bannerImage,
              p.bannerImageSrc || '/black-chauffeur-sedan-night-city.webp',
            ),
            bannerImageAlt: String(p.bannerImageAlt || `${p.title} — DRIVEIT Luxury Hyderabad`),
            highlights:
              typeof p.highlightsText === 'string' && p.highlightsText.trim()
                ? p.highlightsText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean)
                : Array.isArray(p.highlights)
                  ? p.highlights.map(String)
                  : [],
            flightSyncSupported: Boolean(p.flightSyncSupported),
          }))
      : DEFAULT_PROTOCOLS

  const rawCorridors = Array.isArray(settings.vipCorridors) ? settings.vipCorridors : []
  const vipCorridors: VipCorridorConfig[] =
    rawCorridors.length > 0
      ? rawCorridors
          .filter((c: any) => c?.origin && c?.destination)
          .map((c: any, idx: number): VipCorridorConfig => ({
            id: String(c.corridorId || `corridor-${idx + 1}`),
            tag: String(c.tag || `CORRIDOR 0${idx + 1}`),
            origin: String(c.origin),
            destination: String(c.destination),
            distanceKm: String(c.distanceKm || '15 km'),
            etaMinutes: String(c.etaMinutes || '20 min'),
            fromCoord: {
              x: Number(c.fromX) || 240,
              y: Number(c.fromY) || 318,
              label: String(c.origin).split('(')[0].trim(),
            },
            toCoord: {
              x: Number(c.toX) || 430,
              y: Number(c.toY) || 240,
              label: String(c.destination).split('(')[0].trim(),
            },
            controlPoint: {
              x: Number(c.ctrlX) || 350,
              y: Number(c.ctrlY) || 300,
            },
            recommendedCarSlug: String(c.recommendedCarSlug || 'rolls-royce-phantom'),
            recommendedCarName: String(c.recommendedCarName || 'Rolls-Royce Phantom'),
            priceFormatted: String(c.priceFormatted || '₹1,85,000/day'),
          }))
      : DEFAULT_VIP_CORRIDORS

  const sections: HomeSectionsConfig = {
    studioStageEyebrow: settings.studioStageEyebrow || DEFAULT_HOME_SECTIONS.studioStageEyebrow,
    studioStageTitle: settings.studioStageTitle || DEFAULT_HOME_SECTIONS.studioStageTitle,
    fleetSectionEyebrow: settings.fleetSectionEyebrow || DEFAULT_HOME_SECTIONS.fleetSectionEyebrow,
    fleetSectionTitle: settings.fleetSectionTitle || DEFAULT_HOME_SECTIONS.fleetSectionTitle,
    fleetSectionSubtitle: settings.fleetSectionSubtitle || DEFAULT_HOME_SECTIONS.fleetSectionSubtitle,
    beyondEyebrow: settings.beyondEyebrow || DEFAULT_HOME_SECTIONS.beyondEyebrow,
    beyondTitle: settings.beyondTitle || DEFAULT_HOME_SECTIONS.beyondTitle,
    beyondSubtitle: settings.beyondSubtitle || DEFAULT_HOME_SECTIONS.beyondSubtitle,
    protocolEyebrow: settings.protocolEyebrow || DEFAULT_HOME_SECTIONS.protocolEyebrow,
    protocolTitle: settings.protocolTitle || DEFAULT_HOME_SECTIONS.protocolTitle,
    protocolSubtitle: settings.protocolSubtitle || DEFAULT_HOME_SECTIONS.protocolSubtitle,
    radarEyebrow: settings.radarEyebrow || DEFAULT_HOME_SECTIONS.radarEyebrow,
    radarTitle: settings.radarTitle || DEFAULT_HOME_SECTIONS.radarTitle,
    radarSectorLabel: settings.radarSectorLabel || DEFAULT_HOME_SECTIONS.radarSectorLabel,
    radarDelayBadge: settings.radarDelayBadge || DEFAULT_HOME_SECTIONS.radarDelayBadge,
    radarDefaultFlightCode: settings.radarDefaultFlightCode || DEFAULT_HOME_SECTIONS.radarDefaultFlightCode,
    closingEyebrow: settings.closingEyebrow || DEFAULT_HOME_SECTIONS.closingEyebrow,
    closingTitle: settings.closingTitle || DEFAULT_HOME_SECTIONS.closingTitle,
    closingDescription: settings.closingDescription || DEFAULT_HOME_SECTIONS.closingDescription,
    closingBannerImage: resolveMediaUrl(
      settings.closingBannerImage,
      settings.closingBannerImageSrc || DEFAULT_HOME_SECTIONS.closingBannerImage,
    ),
    closingBannerImageAlt:
      settings.closingBannerImageAlt || DEFAULT_HOME_SECTIONS.closingBannerImageAlt,
    closingCtaLabel: settings.closingCtaLabel || DEFAULT_HOME_SECTIONS.closingCtaLabel,
    closingPassLabel: settings.closingPassLabel || DEFAULT_HOME_SECTIONS.closingPassLabel,
    closingPassTitle: settings.closingPassTitle || DEFAULT_HOME_SECTIONS.closingPassTitle,
    closingPassBenefits:
      typeof settings.closingPassBenefitsText === 'string' && settings.closingPassBenefitsText.trim()
        ? settings.closingPassBenefitsText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean)
        : DEFAULT_HOME_SECTIONS.closingPassBenefits,
  }

  return { heroScenes, pickupHubs, beyondPanels, vipCorridors, protocols, sections }
}

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
