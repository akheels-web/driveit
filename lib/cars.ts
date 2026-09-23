export interface CarDetails {
  id: string
  slug: string
  name: string
  src: string
  gallery?: string[]
  brand: string
  category: string // sedan, sports, mpv, suv, bus
  price: number
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
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const baseCars = [
  { name: "BMW 520D", src: "/sadan/1.jpg", brand: "BMW", category: "sedan", price: 8000, priceDisplay: "₹8,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Lamborghini Gallardo", src: "/sadan/2.jpg", brand: "Lamborghini", category: "sports", price: 75000, priceDisplay: "₹75,000/day", seats: 2, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Lexus ES 300H", src: "/sadan/3.jpg", brand: "Lexus", category: "sedan", price: 9000, priceDisplay: "₹9,000/day", seats: 5, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport"] },
  { name: "Mercedes S 350", src: "/sadan/4.jpg", brand: "Mercedes", category: "sedan", price: 15000, priceDisplay: "₹15,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Mercedes S 450", src: "/sadan/5.jpg", brand: "Mercedes", category: "sedan", price: 18000, priceDisplay: "₹18,000/day", seats: 5, transmission: "Automatic", fuel: "Petrol", services: ["chauffeur","airport"] },
  { name: "Toyota Camry", src: "/sadan/6.jpg", brand: "Toyota", category: "sedan", price: 6000, priceDisplay: "₹6,000/day", seats: 5, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport","selfdrive"] },
  { name: "Volvo S60 D5", src: "/sadan/7.jpg", brand: "Volvo", category: "sedan", price: 7000, priceDisplay: "₹7,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Audi A6", src: "/sadan/8.jpg", brand: "Audi", category: "sedan", price: 10000, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Audi RS5 Quattro", src: "/sadan/9.jpg", brand: "Audi", category: "sports", price: 25000, priceDisplay: "₹25,000/day", seats: 4, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "KIA Carnival", src: "/suv/1.jpg", brand: "KIA", category: "mpv", price: 7000, priceDisplay: "₹7,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Mercedes GLS 350D", src: "/suv/2.jpg", brand: "Mercedes", category: "suv", price: 20000, priceDisplay: "₹20,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Mini Cooper Countryman", src: "/suv/3.jpg", brand: "Mini", category: "suv", price: 12000, priceDisplay: "₹12,000/day", seats: 5, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Toyota Commuter Custom", src: "/suv/4.jpg", brand: "Toyota", category: "bus", price: 8000, priceDisplay: "₹8,000/day", seats: 14, transmission: "Manual", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Toyota Crysta MT", src: "/suv/5.jpg", brand: "Toyota", category: "mpv", price: 5000, priceDisplay: "₹5,000/day", seats: 7, transmission: "Manual", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Toyota Fortuner", src: "/suv/6.jpg", brand: "Toyota", category: "suv", price: 6500, priceDisplay: "₹6,500/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Toyota Vellfire", src: "/suv/7.jpg", brand: "Toyota", category: "mpv", price: 15000, priceDisplay: "₹15,000/day", seats: 7, transmission: "Automatic", fuel: "Hybrid", services: ["chauffeur","airport"] },
  { name: "Volvo XC60", src: "/suv/8.jpg", brand: "Volvo", category: "suv", price: 9000, priceDisplay: "₹9,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Audi Q7 Quattro", src: "/suv/9.jpg", brand: "Audi", category: "suv", price: 14000, priceDisplay: "₹14,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Mercedes G 350 Wagon", src: "/trending/1.jpg", brand: "Mercedes", category: "suv", price: 35000, priceDisplay: "₹35,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["selfdrive","chauffeur"] },
  { name: "Mercedes GLS 400D", src: "/trending/2.jpg", brand: "Mercedes", category: "suv", price: 22000, priceDisplay: "₹22,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
  { name: "Mercedes V-Class", src: "/trending/3.jpg", brand: "Mercedes", category: "mpv", price: 18000, priceDisplay: "₹18,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "Range Rover Vogue", src: "/trending/4.jpg", brand: "Land Rover", category: "suv", price: 30000, priceDisplay: "₹30,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Volvo S90", src: "/trending/5.jpg", brand: "Volvo", category: "sedan", price: 10000, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "Volvo XC 90", src: "/trending/6.jpg", brand: "Volvo", category: "suv", price: 12000, priceDisplay: "₹12,000/day", seats: 7, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","selfdrive"] },
  { name: "BMW 730 LD", src: "/trending/7.jpg", brand: "BMW", category: "sedan", price: 15000, priceDisplay: "₹15,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport"] },
  { name: "BMW i4", src: "/trending/8.jpg", brand: "BMW", category: "sedan", price: 12000, priceDisplay: "₹12,000/day", seats: 5, transmission: "Automatic", fuel: "Electric", services: ["selfdrive"] },
  { name: "Mercedes C300 Convertible", src: "/trending/9.jpg", brand: "Mercedes", category: "sports", price: 20000, priceDisplay: "₹20,000/day", seats: 4, transmission: "Automatic", fuel: "Petrol", services: ["selfdrive"] },
  { name: "Mercedes E 220D", src: "/trending/10.jpg", brand: "Mercedes", category: "sedan", price: 10000, priceDisplay: "₹10,000/day", seats: 5, transmission: "Automatic", fuel: "Diesel", services: ["chauffeur","airport","selfdrive"] },
]

export const carsData: CarDetails[] = baseCars.map((car, index) => {
  // Deterministic mocking for consistency
  const idStr = (index + 1).toString()
  const rand1 = ((index * 13) % 10) / 10
  const rand2 = ((index * 7) % 50)
  
  const rating = 4.5 + (rand1 * 0.5) // 4.5 to 5.0
  const reviewsCount = 12 + rand2 * 3
  const bookingsCount = 50 + rand2 * 7
  
  // Random date within the last 6 months
  const dateOffset = rand2 * 3 * 24 * 60 * 60 * 1000
  const addedDate = new Date(Date.now() - dateOffset).toISOString()

  return {
    ...car,
    id: idStr,
    slug: generateSlug(car.name),
    gallery: [
      car.src, 
      car.src, // Fallback to same image if we don't have multiple
      car.src
    ],
    rating: Number(rating.toFixed(1)),
    reviewsCount,
    bookingsCount,
    addedDate,
    specs: {
      bootSpace: car.category === 'sedan' ? '450L' : car.category === 'suv' ? '600L' : car.category === 'mpv' ? '700L' : '200L',
      acZones: car.category === 'suv' || car.category === 'mpv' || car.price > 15000 ? '4-Zone Climate Control' : '2-Zone Climate Control',
      year: (2021 + ((index * 3) % 4)).toString(),
      odometer: `${15000 + rand2 * 1000} km`
    },
    cancellationPolicy: "Free cancellation up to 48 hours before pickup.",
    kmAllowance: "100 km/day included. ₹" + Math.round(car.price / 400) + "/km thereafter.",
    securityDeposit: "₹" + (car.price > 20000 ? "50,000" : car.price > 10000 ? "25,000" : "10,000")
  }
})


