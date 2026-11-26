import type { EngineType } from './engine-audio'
import type { StudioHotspotConfig } from './home-config'

export interface CarDetails {
  id: string
  slug: string
  name: string
  src: string
  imageAlt?: string
  gallery?: string[]
  galleryAlts?: string[]
  featuredInStudioStage?: boolean
  tagline?: string
  powerHp?: number
  zeroToHundred?: string
  topSpeed?: string
  acousticNote?: string
  engineAudioProfile?: EngineType
  studioHotspots?: StudioHotspotConfig[]
  updatedAt?: string
  brand: string
  category: string // sedan, sports, mpv, suv, bus
  price: number // Chauffeur / with driver rate
  selfDrivePrice?: number // Self-drive / without driver rate
  priceDisplay: string
  seats: number
  transmission: string
  fuel: string
  services: string[] // chauffeur, selfdrive, airport
  /** Optional long-form copy from the CMS. */
  description?: string
  // Sorting & Display metrics
  rating: number
  reviewsCount: number
  bookingsCount: number
  addedDate: string
  // Specs for detail page
  specs: {
    bootSpace: string
    acZones: string
    year: string
    odometer: string
  }
  cancellationPolicy: string
  kmAllowance: string
  securityDeposit: string
  securityDepositAmount?: number
  fuelPolicy?: string
  fastTagEquipped?: boolean
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export function formatBrandAndModel(brand: string, name: string) {
  const cleanBrand =
    brand.toUpperCase() === 'MERCEDES' ? 'MERCEDES-BENZ' : brand.toUpperCase()
  const regex = new RegExp(`^${brand.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s-]+`, 'i')
  const modelOnly = name
    .replace(regex, '')
    .replace(/^Mercedes-Benz\s+/i, '')
    .replace(/^Mercedes-AMG\s+/i, 'AMG ')
    .replace(/^Mercedes-Maybach\s+/i, 'Maybach ')
    .trim()
  return {
    brandLabel: cleanBrand,
    modelLabel: modelOnly || name,
  }
}

const baseCars = [
  // Flagship Light-Grey Studio Collection (Exact Hype.luxury 3/4 Front-Left Cyclorama)
  { name: "Rolls-Royce Phantom", src: "/studio/rolls-royce-phantom.webp?v=5", brand: "Rolls-Royce", category: "sedan", price: 185000, selfDrivePrice: 160000, priceDisplay: "₹1,85,000/day", seats: 4, transmission: "Automatic", fuel: "Petrol", services: ["chauffeur","airport"] },
  { name: "Aston Martin DB12", src: "/studio/aston-martin-db12.webp?v=5", brand: "Aston Martin", category: "sports", price: 145000, selfDrivePrice: 125000, priceDisplay: "₹1,45,000/day", seats: 2, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive","chauffeur"] },
  { name: "Ferrari SF90 Stradale", src: "/studio/ferrari-sf90-stradale.webp?v=5", brand: "Ferrari", category: "sports", price: 165000, selfDrivePrice: 145000, priceDisplay: "₹1,65,000/day", seats: 2, transmission: "Automatic", fuel: "Hybrid", services: ["selfdrive","chauffeur"] },
  { name: "Mercedes-AMG G 63", src: "/studio/mercedes-amg-g63.webp?v=5", brand: "Mercedes-Benz", category: "suv", price: 65000, selfDrivePrice: 55000, priceDisplay: "₹65,000/day", seats: 5, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive","chauffeur"] },
  { name: "Lamborghini Huracán Evo", src: "/studio/lamborghini-huracan-evo.webp?v=5", brand: "Lamborghini", category: "sports", price: 125000, selfDrivePrice: 105000, priceDisplay: "₹1,25,000/day", seats: 2, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Mercedes-Benz GLS 400d", src: "/studio/mercedes-benz-gls-400d.webp?v=5", brand: "Mercedes-Benz", category: "suv", price: 22000, selfDrivePrice: 18000, priceDisplay: "₹22,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },

  // Executive & Luxury Studio Fleet
  { name: "BMW 520D", src: "/studio/bmw-520d.webp?v=5", brand: "BMW", category: "sedan", price: 8000, selfDrivePrice: 6500, priceDisplay: "₹8,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Lamborghini Gallardo", src: "/studio/lamborghini-huracan-evo.webp?v=5", brand: "Lamborghini", category: "sports", price: 75000, selfDrivePrice: 65000, priceDisplay: "₹75,000/day", seats: 2, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Lexus ES 300H", src: "/studio/toyota-camry.webp?v=5", brand: "Lexus", category: "sedan", price: 9000, selfDrivePrice: 7500, priceDisplay: "₹9,000/day", seats: 5, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport"] },
  { name: "Mercedes S 350", src: "/studio/rolls-royce-phantom.webp?v=5", brand: "Mercedes-Benz", category: "sedan", price: 15000, selfDrivePrice: 12500, priceDisplay: "₹15,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Mercedes S 450", src: "/studio/rolls-royce-phantom.webp?v=5", brand: "Mercedes-Benz", category: "sedan", price: 18000, selfDrivePrice: 15000, priceDisplay: "₹18,000/day", seats: 5, transmission: "Automatic", fuel: "Petrol", services: ["chauffeur","airport"] },
  { name: "Toyota Camry", src: "/studio/toyota-camry.webp?v=5", brand: "Toyota", category: "sedan", price: 6000, selfDrivePrice: 4800, priceDisplay: "₹6,000/day", seats: 5, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport","selfdrive"] },
  { name: "Volvo S60 D5", src: "/studio/volvo-s60-d5.webp?v=5", brand: "Volvo", category: "sedan", price: 7000, selfDrivePrice: 5800, priceDisplay: "₹7,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Audi A6", src: "/studio/volvo-s60-d5.webp?v=5", brand: "Audi", category: "sedan", price: 10000, selfDrivePrice: 8500, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Audi RS5 Quattro", src: "/studio/aston-martin-db12.webp?v=5", brand: "Audi", category: "sports", price: 25000, selfDrivePrice: 21000, priceDisplay: "₹25,000/day", seats: 4, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "KIA Carnival", src: "/studio/kia-carnival.webp?v=5", brand: "KIA", category: "mpv", price: 7000, selfDrivePrice: 5800, priceDisplay: "₹7,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Mercedes GLS 350D", src: "/studio/mercedes-benz-gls-400d.webp?v=5", brand: "Mercedes-Benz", category: "suv", price: 20000, selfDrivePrice: 16500, priceDisplay: "₹20,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Mini Cooper Countryman", src: "/studio/volvo-xc90.webp?v=5", brand: "Mini", category: "suv", price: 12000, selfDrivePrice: 9800, priceDisplay: "₹12,000/day", seats: 5, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Toyota Commuter Custom", src: "/studio/toyota-vellfire.webp?v=5", brand: "Toyota", category: "bus", price: 8000, selfDrivePrice: 7000, priceDisplay: "₹8,000/day", seats: 14, transmission: "Manual", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Toyota Crysta MT", src: "/studio/kia-carnival.webp?v=5", brand: "Toyota", category: "mpv", price: 5000, selfDrivePrice: 4000, priceDisplay: "₹5,000/day", seats: 7, transmission: "Manual", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Toyota Fortuner", src: "/studio/toyota-fortuner.webp?v=5", brand: "Toyota", category: "suv", price: 6500, selfDrivePrice: 5200, priceDisplay: "₹6,500/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Toyota Vellfire", src: "/studio/toyota-vellfire.webp?v=5", brand: "Toyota", category: "mpv", price: 15000, selfDrivePrice: 12500, priceDisplay: "₹15,000/day", seats: 7, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport"] },
  { name: "Volvo XC60", src: "/studio/volvo-xc90.webp?v=5", brand: "Volvo", category: "suv", price: 9000, selfDrivePrice: 7500, priceDisplay: "₹9,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Audi Q7 Quattro", src: "/studio/mercedes-benz-gls-400d.webp?v=5", brand: "Audi", category: "suv", price: 14000, selfDrivePrice: 11500, priceDisplay: "₹14,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Mercedes G 350 Wagon", src: "/studio/mercedes-amg-g63.webp?v=5", brand: "Mercedes-Benz", category: "suv", price: 35000, selfDrivePrice: 29000, priceDisplay: "₹35,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["selfdrive","chauffeur"] },
  { name: "Mercedes V-Class", src: "/studio/toyota-vellfire.webp?v=5", brand: "Mercedes-Benz", category: "mpv", price: 18000, selfDrivePrice: 15000, priceDisplay: "₹18,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Range Rover Vogue", src: "/studio/mercedes-amg-g63.webp?v=5", brand: "Land Rover", category: "suv", price: 30000, selfDrivePrice: 25000, priceDisplay: "₹30,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Volvo S90", src: "/studio/volvo-s60-d5.webp?v=5", brand: "Volvo", category: "sedan", price: 10000, selfDrivePrice: 8500, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Volvo XC 90", src: "/studio/volvo-xc90.webp?v=5", brand: "Volvo", category: "suv", price: 12000, selfDrivePrice: 10000, priceDisplay: "₹12,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "BMW 730 LD", src: "/studio/bmw-520d.webp?v=5", brand: "BMW", category: "sedan", price: 15000, selfDrivePrice: 12500, priceDisplay: "₹15,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "BMW i4", src: "/studio/aston-martin-db12.webp?v=5", brand: "BMW", category: "sedan", price: 12000, selfDrivePrice: 9800, priceDisplay: "₹12,000/day", seats: 5, transmission: "Automatic", fuel: "Electric", services: ["selfdrive"] },
  { name: "Mercedes C300 Convertible", src: "/studio/ferrari-sf90-stradale.webp?v=5", brand: "Mercedes-Benz", category: "sports", price: 20000, selfDrivePrice: 17000, priceDisplay: "₹20,000/day", seats: 4, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Mercedes E 220D", src: "/studio/bmw-520d.webp?v=5", brand: "Mercedes-Benz", category: "sedan", price: 10000, selfDrivePrice: 8500, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
]

export const carsData: CarDetails[] = baseCars.map((car, index) => {
  const idStr = (index + 1).toString()
  const rand1 = ((index * 13) % 10) / 10
  const rand2 = ((index * 7) % 50)

  const rating = 4.7 + (rand1 * 0.3)
  const reviewsCount = 18 + rand2 * 2
  const bookingsCount = 60 + rand2 * 5

  const dateOffset = rand2 * 3 * 24 * 60 * 60 * 1000
  const addedDate = new Date(Date.now() - dateOffset).toISOString()

  const selfDrivePrice = car.selfDrivePrice ?? Math.round(car.price * 0.85)

  return {
    ...car,
    id: idStr,
    slug: generateSlug(car.name),
    selfDrivePrice,
    gallery: [car.src, car.src, car.src],
    rating: Number(rating.toFixed(1)),
    reviewsCount,
    bookingsCount,
    addedDate,
    specs: {
      bootSpace: car.category === 'sedan' ? '450L' : car.category === 'suv' ? '600L' : car.category === 'mpv' ? '700L' : '220L',
      acZones: '4-Zone Climate Control',
      year: '2025',
      odometer: `${4000 + rand2 * 200} km`,
    },
    cancellationPolicy: "Complimentary rescheduling & cancellation up to 24 hours prior.",
    kmAllowance: "100 km/day included.",
    securityDeposit: "₹" + (car.price > 50000 ? "1,00,000" : car.price > 20000 ? "50,000" : "25,000"),
    securityDepositAmount: car.price > 50000 ? 100000 : car.price > 20000 ? 50000 : 25000,
    fuelPolicy: "Full-to-Full Fuel",
    fastTagEquipped: true,
  }
})
