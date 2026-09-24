import { NextResponse } from 'next/server'
import { getCarsFromCMS } from '@/lib/cms'
import { CarDetails } from '@/lib/cars'

export const dynamic = 'force-dynamic'

interface ScoredCar {
  car: CarDetails
  score: number
  matchedTerms: string[]
}

// Common occasion and lifestyle intent dictionaries for luxury fleet search
const OCCASION_VIBE_MAP: Record<string, { categories?: string[]; brands?: string[]; keywords: string[]; minSeats?: number }> = {
  wedding: {
    categories: ['sedan', 'convertible', 'wedding'],
    brands: ['Rolls-Royce', 'Bentley', 'Mercedes-Benz', 'Maybach'],
    keywords: ['maybach', 'phantom', 'ghost', 's-class', 'vintage', 'luxury', 'white'],
  },
  marriage: {
    categories: ['sedan', 'convertible', 'wedding'],
    brands: ['Rolls-Royce', 'Bentley', 'Mercedes-Benz', 'Maybach'],
    keywords: ['maybach', 'phantom', 'ghost', 's-class', 'luxury'],
  },
  corporate: {
    categories: ['sedan', 'suv'],
    brands: ['Mercedes-Benz', 'BMW', 'Audi'],
    keywords: ['s-class', '7-series', 'executive', 'a8', 'e-class', 'maybach'],
  },
  business: {
    categories: ['sedan', 'suv'],
    brands: ['Mercedes-Benz', 'BMW', 'Audi'],
    keywords: ['s-class', '7-series', 'executive', 'a8', 'e-class'],
  },
  executive: {
    categories: ['sedan', 'suv'],
    brands: ['Mercedes-Benz', 'BMW', 'Audi', 'Maybach'],
    keywords: ['s-class', 'maybach', '7-series', 'chauffeur'],
  },
  airport: {
    categories: ['sedan', 'suv', 'mpv'],
    brands: ['Mercedes-Benz', 'Toyota', 'BMW'],
    keywords: ['vellfire', 'v-class', 'e-class', 'gls', 'innova', 'airport'],
  },
  family: {
    categories: ['suv', 'mpv', 'bus'],
    keywords: ['7-seater', 'spacious', 'luggage', 'suv', 'cullinan', 'defender', 'gls'],
    minSeats: 6,
  },
  sports: {
    categories: ['sports', 'convertible'],
    brands: ['Porsche', 'Ferrari', 'Lamborghini', 'Ford'],
    keywords: ['mustang', '911', 'convertible', 'speed', 'turbo'],
  },
  weekend: {
    categories: ['suv', 'sports'],
    keywords: ['defender', 'wrangler', 'thar', 'g-wagon', 'convertible'],
  },
}

function calculateCarRelevance(car: CarDetails, queryTokens: string[], rawQuery: string): ScoredCar {
  let score = 0
  const matchedTerms: string[] = []

  const carNameLower = car.name.toLowerCase()
  const carBrandLower = car.brand.toLowerCase()
  const carCatLower = car.category.toLowerCase()
  const carDescLower = (car.description || '').toLowerCase()
  const carServices = car.services.map((s) => s.toLowerCase())
  const specText = `${car.transmission} ${car.fuel} ${car.specs?.bootSpace || ''} ${car.specs?.acZones || ''}`.toLowerCase()

  // 1. Exact raw query substring match (Highest weight)
  if (carNameLower.includes(rawQuery)) {
    score += 50
    matchedTerms.push('exact_name_match')
  } else if (carBrandLower.includes(rawQuery)) {
    score += 40
    matchedTerms.push('brand_match')
  }

  // 2. Individual token matching
  for (const token of queryTokens) {
    if (token.length <= 1) continue

    // Direct name match
    if (carNameLower.includes(token)) {
      score += 20
      matchedTerms.push(token)
    }

    // Brand match
    if (carBrandLower.includes(token)) {
      score += 15
      matchedTerms.push(token)
    }

    // Category match
    if (carCatLower.includes(token)) {
      score += 15
      matchedTerms.push(token)
    }

    // Service match (chauffeur, selfdrive)
    if (carServices.some((s) => s.includes(token))) {
      score += 12
      matchedTerms.push(`service:${token}`)
    }

    // Specs / Fuel / Transmission match
    if (specText.includes(token)) {
      score += 10
      matchedTerms.push(`spec:${token}`)
    }

    // Description match
    if (carDescLower.includes(token)) {
      score += 5
      matchedTerms.push(`desc:${token}`)
    }

    // 3. Occasion / lifestyle semantic intent
    const vibe = OCCASION_VIBE_MAP[token]
    if (vibe) {
      if (vibe.categories && vibe.categories.includes(car.category.toLowerCase())) {
        score += 25
        matchedTerms.push(`vibe_category:${token}`)
      }
      if (vibe.brands && vibe.brands.some((b) => b.toLowerCase() === carBrandLower)) {
        score += 20
        matchedTerms.push(`vibe_brand:${token}`)
      }
      if (vibe.keywords && vibe.keywords.some((kw) => carNameLower.includes(kw) || carDescLower.includes(kw))) {
        score += 15
        matchedTerms.push(`vibe_keyword:${token}`)
      }
      if (vibe.minSeats && car.seats >= vibe.minSeats) {
        score += 15
        matchedTerms.push(`vibe_seats:${token}`)
      }
    }
  }

  return { car, score, matchedTerms: Array.from(new Set(matchedTerms)) }
}

/**
 * Intelligent Fleet Search Endpoint
 *
 * GET /api/fleet/search?q=rolls+royce+wedding&category=sedan&maxPrice=50000
 *
 * Combines full-text query matching, semantic occasion parsing (wedding, airport, corporate),
 * and hard filters (category, service, seats, price).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').trim()
  const categoryFilter = searchParams.get('category')?.toLowerCase().trim()
  const serviceFilter = searchParams.get('service')?.toLowerCase().trim()
  const maxPrice = Number(searchParams.get('maxPrice')) || 0
  const minSeats = Number(searchParams.get('seats')) || 0
  const sortBy = searchParams.get('sort') || 'relevance'

  const allCars = await getCarsFromCMS()

  // 1. Filter out inactive cars
  let filtered = allCars

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((car) => car.category.toLowerCase() === categoryFilter)
  }

  if (serviceFilter && serviceFilter !== 'all') {
    filtered = filtered.filter((car) =>
      car.services.some((s) => s.toLowerCase() === serviceFilter),
    )
  }

  if (maxPrice > 0) {
    filtered = filtered.filter((car) => car.price <= maxPrice)
  }

  if (minSeats > 0) {
    filtered = filtered.filter((car) => car.seats >= minSeats)
  }

  // 2. If no text query was provided, return sorted filtered list
  if (!query) {
    let sorted = [...filtered]
    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(
      { query: '', total: sorted.length, cars: sorted },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    )
  }

  // 3. Multi-token semantic search & scoring
  const cleanQuery = query.toLowerCase()
  const tokens = cleanQuery.split(/[\s,+-]+/).filter((t) => t.length > 0)

  const scoredCars: ScoredCar[] = filtered.map((car) =>
    calculateCarRelevance(car, tokens, cleanQuery),
  )

  // Keep cars with at least one match, or fallback to all if query had general terms
  let matchingCars = scoredCars.filter((sc) => sc.score > 0)

  // Sort by relevance score descending
  matchingCars.sort((a, b) => {
    if (sortBy === 'price-low') return a.car.price - b.car.price
    if (sortBy === 'price-high') return b.car.price - a.car.price
    return b.score - a.score
  })

  // Format response
  const results = matchingCars.map(({ car, score, matchedTerms }) => ({
    ...car,
    _searchMeta: {
      score,
      matchedTerms,
    },
  }))

  return NextResponse.json(
    {
      query,
      total: results.length,
      cars: results,
      suggestions: results.length === 0 ? ['Mercedes-Benz S-Class', 'Rolls-Royce Ghost', 'Range Rover Autobiography'] : undefined,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
