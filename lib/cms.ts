import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CarDetails, carsData } from './cars'

export const getCarsFromCMS = cache(async (): Promise<CarDetails[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'cars',
      limit: 100,
    })

    if (docs && docs.length > 0) {
      return docs.map((doc: any, index: number) => ({
        id: doc.id?.toString() || (index + 1).toString(),
        slug: doc.slug,
        name: doc.name,
        src: doc.imageSrc || (doc.image && typeof doc.image === 'object' ? doc.image.url : '/sadan/1.jpg'),
        gallery: [doc.imageSrc || '/sadan/1.jpg'],
        brand: doc.brand || 'Luxury',
        category: doc.category,
        price: doc.pricePerDay || doc.price || 15000,
        priceDisplay: `₹${(doc.pricePerDay || doc.price || 15000).toLocaleString('en-IN')}/day`,
        seats: doc.seats || 5,
        transmission: doc.transmission || 'Automatic',
        fuel: doc.fuelType || doc.fuel || 'Petrol',
        services: ['chauffeur'],
        rating: 4.9,
        reviewsCount: 32,
        bookingsCount: 120,
        addedDate: doc.createdAt || new Date().toISOString(),
        specs: {
          bootSpace: '450L',
          acZones: '4-Zone Climate Control',
          year: '2024',
          odometer: '12,000 km',
        },
        cancellationPolicy: 'Free cancellation up to 48 hours before pickup.',
        kmAllowance: '100 km/day included.',
        securityDeposit: '₹25,000',
      }))
    }
  } catch (error) {
    // Return static carsData fallback
  }
  return carsData
})
