/**
 * Pricing rules — the single source of truth for money.
 *
 * ⚠️ Anything a browser sends about price is treated as display-only. The server
 * recomputes every amount from the CMS car price + these tables, so a tampered
 * request can never change what a booking is worth.
 */

export const HOLD_MINUTES = 10
export const MAX_RENTAL_DAYS = 90
export const MIN_RENTAL_DAYS = 1

export const ADDON_PRICES = {
  child_seat: 1500,
  extra_driver: 1000,
  photographer: 5000,
  decoration: 2500,
} as const

export const BUNDLES = [
  {
    id: 'wedding_bundle',
    label: 'Wedding Package',
    price: 15000,
    desc: 'Decoration + Photographer + 50km Extra',
  },
  { id: 'family_trip', label: 'Family Trip', price: 3000, desc: 'Child Seat + Extra Driver' },
  {
    id: 'vip_arrival',
    label: 'VIP Arrival',
    price: 10000,
    desc: 'Premium Decor + Champagne + Meet & Greet',
  },
] as const

export type AddonId = keyof typeof ADDON_PRICES
export type BundleId = (typeof BUNDLES)[number]['id']

export class QuoteError extends Error {
  status = 400
}

export type QuoteLine = { id: string; label: string; price: number }

export type Quote = {
  days: number
  base: number
  addonsTotal: number
  addonLines: QuoteLine[]
  discount: number
  total: number
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function rentalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new QuoteError('Invalid booking dates.')
  }

  const diff = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY)
  const days = diff <= 0 ? MIN_RENTAL_DAYS : diff

  if (days > MAX_RENTAL_DAYS) {
    throw new QuoteError(`Rentals are limited to ${MAX_RENTAL_DAYS} days online. Contact concierge for longer charters.`)
  }

  return days
}

/** Resolves the add-on/bundle ids from a checkout request into priced lines. */
export function priceAddons(ids: string[] | undefined): { lines: QuoteLine[]; total: number } {
  const lines: QuoteLine[] = []

  for (const rawId of ids ?? []) {
    const id = String(rawId).trim()
    if (!id) continue

    const addonPrice = ADDON_PRICES[id as AddonId]
    if (typeof addonPrice === 'number') {
      lines.push({ id, label: id.replace(/_/g, ' '), price: addonPrice })
      continue
    }

    const bundle = BUNDLES.find((candidate) => candidate.id === id)
    if (bundle) lines.push({ id: bundle.id, label: bundle.label, price: bundle.price })
    // Unknown ids are silently ignored — never trust client-supplied prices.
  }

  const unique = lines.filter((line, index) => lines.findIndex((l) => l.id === line.id) === index)
  return { lines: unique, total: unique.reduce((sum, line) => sum + line.price, 0) }
}

export function computeQuote(input: {
  pricePerDay: number
  startDate: string
  endDate: string
  addons?: string[]
  discount?: number
}): Quote {
  const days = rentalDays(input.startDate, input.endDate)
  const base = Math.max(0, Number(input.pricePerDay) || 0) * days
  const { lines, total: addonsTotal } = priceAddons(input.addons)

  if (base <= 0) {
    throw new QuoteError('This vehicle is not priced yet. Please contact the concierge.')
  }

  const discount = Math.min(Math.max(0, Number(input.discount) || 0), base + addonsTotal)

  return {
    days,
    base,
    addonsTotal,
    addonLines: lines,
    discount,
    total: Math.round(base + addonsTotal - discount),
  }
}

export function discountForCoupon(
  coupon: { discountType?: string | null; discountValue?: number | null },
  subtotal: number,
): number {
  const value = Math.max(0, Number(coupon.discountValue) || 0)
  if (value <= 0) return 0

  if (coupon.discountType === 'fixed') return Math.min(value, subtotal)
  return Math.round((subtotal * value) / 100)
}
