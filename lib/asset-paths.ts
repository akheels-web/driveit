export const LEGACY_IMAGE_PATH_MAP: Record<string, string> = {
  // Sedans
  '/sadan/1.webp': '/sadan/bmw-520d.webp',
  '/sadan/2.webp': '/sadan/lamborghini-gallardo.webp',
  '/sadan/3.webp': '/sadan/lexus-es-300h.webp',
  '/sadan/4.webp': '/sadan/mercedes-s-350.webp',
  '/sadan/5.webp': '/sadan/mercedes-s-450.webp',
  '/sadan/6.webp': '/sadan/toyota-camry.webp',
  '/sadan/7.webp': '/sadan/volvo-s60-d5.webp',
  '/sadan/8.webp': '/sadan/audi-a6.webp',
  '/sadan/9.webp': '/sadan/audi-rs5-quattro.webp',

  // SUVs & MPVs
  '/suv/1.webp': '/suv/kia-carnival.webp',
  '/suv/2.webp': '/suv/mercedes-gls-350d.webp',
  '/suv/3.webp': '/suv/mini-cooper-countryman.webp',
  '/suv/4.webp': '/suv/toyota-commuter-custom.webp',
  '/suv/5.webp': '/suv/toyota-crysta-mt.webp',
  '/suv/6.webp': '/suv/toyota-fortuner.webp',
  '/suv/7.webp': '/suv/toyota-vellfire.webp',
  '/suv/8.webp': '/suv/volvo-xc60.webp',
  '/suv/9.webp': '/suv/audi-q7-quattro.webp',

  // Trending & Executive Flagships
  '/trending/1.webp': '/trending/mercedes-g-350-wagon.webp',
  '/trending/2.webp': '/trending/mercedes-gls-400d.webp',
  '/trending/3.webp': '/trending/mercedes-v-class.webp',
  '/trending/4.webp': '/trending/range-rover-vogue.webp',
  '/trending/5.webp': '/trending/volvo-s90.webp',
  '/trending/6.webp': '/trending/volvo-xc90.webp',
  '/trending/7.webp': '/trending/bmw-730-ld.webp',
  '/trending/8.webp': '/trending/bmw-i4.webp',
  '/trending/9.webp': '/trending/mercedes-c300-convertible.webp',
  '/trending/10.webp': '/trending/mercedes-e-220d.webp',

  // Studio renders & Private Aviation
  '/studio/bmw5.webp': '/studio/bmw-520d.webp',
  '/studio/camry.webp': '/studio/toyota-camry.webp',
  '/studio/carnival.webp': '/studio/kia-carnival.webp',
  '/studio/db12.webp': '/studio/aston-martin-db12.webp',
  '/studio/fortuner.webp': '/studio/toyota-fortuner.webp',
  '/studio/gls.webp': '/studio/mercedes-benz-gls-400d.webp',
  '/studio/gwagon.webp': '/studio/mercedes-amg-g63.webp',
  '/studio/huracan.webp': '/studio/lamborghini-huracan-evo.webp',
  '/studio/phantom.webp': '/studio/rolls-royce-phantom.webp',
  '/studio/sf90.webp': '/studio/ferrari-sf90-stradale.webp',
  '/studio/vellfire.webp': '/studio/toyota-vellfire.webp',
  '/studio/volvos60.webp': '/studio/volvo-s60-d5.webp',
  '/studio/xc90.webp': '/studio/volvo-xc90.webp',
  '/studio/jet-g650-tarmac.webp': '/studio/gulfstream-g650er-tarmac.webp',
  '/studio/jet-praetor600.webp': '/studio/embraer-praetor-600.webp',
  '/studio/jet-g650-takeoff.webp': '/studio/bombardier-global-7500.webp',
  '/studio/jet-g650er.webp': '/studio/gulfstream-g650-high-altitude.webp',

  // Superyachts
  '/yachts/superyacht-hero.webp': '/yachts/benetti-oasis-40m-superyacht.webp',
  '/yachts/pin-yacht-1.webp': '/yachts/azimut-grande-36m-yacht.webp',
  '/yachts/yacht-1.webp': '/yachts/ferretti-yachts-1000.webp',
  '/yachts/yacht-hero.webp': '/yachts/sunseeker-90-ocean-yacht.webp',
}

/**
 * Normalizes legacy numbered/abbreviated asset paths stored in Postgres/CMS
 * to their descriptive car/aircraft/yacht WebP filenames, preserving query strings.
 */
export function normalizeAssetPath(src?: string | null): string {
  const value = String(src || '').trim()
  if (!value) return ''

  if (value.startsWith('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2')) {
    return '/rolls-royce-phantom-night.webp'
  }

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  const qIdx = withLeadingSlash.indexOf('?')
  const hIdx = withLeadingSlash.indexOf('#')
  const splitIdx =
    qIdx >= 0 && hIdx >= 0 ? Math.min(qIdx, hIdx) : qIdx >= 0 ? qIdx : hIdx

  const pathname = splitIdx >= 0 ? withLeadingSlash.slice(0, splitIdx) : withLeadingSlash
  const suffix = splitIdx >= 0 ? withLeadingSlash.slice(splitIdx) : ''

  if (LEGACY_IMAGE_PATH_MAP[pathname]) {
    return `${LEGACY_IMAGE_PATH_MAP[pathname]}${suffix}`
  }

  // Fallback for legacy .jpg/.jpeg/.png paths pointing to renamed numbered folders
  const webpCandidate = pathname.replace(/\.(jpe?g|png)$/i, '.webp')
  if (LEGACY_IMAGE_PATH_MAP[webpCandidate]) {
    return `${LEGACY_IMAGE_PATH_MAP[webpCandidate]}${suffix}`
  }

  // Fallback for remaining legacy local jpg paths replaced by .webp
  if (
    /^\/(sadan|suv|trending|studio|yachts|hero|flagship|aston|bentley|black|ferrari|gulfstream|luxury|maybach|placeholder|rolls)/i.test(
      pathname,
    ) &&
    /\.(jpe?g)$/i.test(pathname)
  ) {
    return `${webpCandidate}${suffix}`
  }

  return withLeadingSlash
}

/**
 * Builds a clean, non-duplicated vehicle alt tag (e.g. avoids "Rolls-Royce Rolls-Royce Phantom")
 * and prioritizes an explicit CMS-authored alt text when present.
 */
export function buildVehicleAlt(input: {
  imageAlt?: string | null
  brand?: string | null
  name?: string | null
  category?: string | null
  context?: string
}): string {
  const custom = String(input.imageAlt || '').trim()
  if (custom) return custom

  const brand = String(input.brand || '').trim()
  const name = String(input.name || '').trim()
  let title = name || brand || 'DriveIt Luxury Fleet Vehicle'

  if (brand && name) {
    const bLower = brand.toLowerCase()
    const nLower = name.toLowerCase()
    const brandFirstWord = bLower.split(/[\s-]+/)[0]
    if (nLower.startsWith(bLower) || (brandFirstWord && nLower.startsWith(brandFirstWord))) {
      title = name
    } else {
      title = `${brand} ${name}`
    }
  }

  const category = String(input.category || '').trim()
  const context = String(input.context || '').trim()
  const parts = [title]
  if (category) parts.push(category)
  if (context) parts.push(context)
  return parts.join(' — ')
}

