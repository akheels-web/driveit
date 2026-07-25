import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { CarDetails, carsData } from './cars'

export async function getCarsFromCMS(): Promise<CarDetails[]> {
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
        brand: doc.brand,
        category: doc.category,
        price: doc.price,
        priceDisplay: doc.priceDisplay || `₹${doc.price.toLocaleString('en-IN')}/day`,
        seats: doc.seats,
        transmission: doc.transmission,
        fuel: doc.fuel,
        services: doc.services || ['chauffeur'],
        rating: 4.8,
        reviewsCount: 24,
        bookingsCount: 85,
        addedDate: doc.createdAt || new Date().toISOString(),
        specs: {
          bootSpace: doc.bootSpace || '450L',
          acZones: doc.acZones || '4-Zone Climate Control',
          year: doc.year || '2024',
          odometer: doc.odometer || '15,000 km',
        },
        cancellationPolicy: doc.cancellationPolicy || 'Free cancellation up to 48 hours before pickup.',
        kmAllowance: doc.kmAllowance || '100 km/day included.',
        securityDeposit: doc.securityDeposit || '₹25,000',
      }))
    }
  } catch (error) {
    // Return static carsData fallback
  }
  return carsData
}
