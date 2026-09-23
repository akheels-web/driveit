import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import { Car, Heart } from 'lucide-react'

import { auth } from '@/auth'
import config from '@/payload.config'
import { getCarsFromCMS } from '@/lib/cms'
import { SiteHeader } from '@/components/site-header'
import { WishlistButton } from '@/components/wishlist-button'

export const metadata = { title: 'Saved Fleet | DRIVEIT Luxury', robots: { index: false } }

export default async function WishlistPage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/login?redirect=/dashboard/wishlist')

  const email = session.user.email.toLowerCase()
  const payload = await getPayload({ config })

  const [{ docs }, cars] = await Promise.all([
    payload.find({
      collection: 'wishlists',
      where: { userEmail: { equals: email } },
      limit: 100,
      depth: 0,
      overrideAccess: true, // scoped to the session email above
    }),
    getCarsFromCMS(),
  ])

  const savedKeys = (docs as Record<string, any>[]).map((doc) => String(doc.carSlug))
  const savedCars = cars.filter((car) => savedKeys.includes(car.slug) || savedKeys.includes(car.id))

  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold text-[var(--gold-400)]">
                Your saved fleet
              </h1>
              <p className="text-sm text-white/50 mt-1">Easily re-book your favourite vehicles</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/10">
              <Heart className="w-4 h-4 inline-block mr-2 text-[var(--gold-400)] fill-current" />
              {savedCars.length} saved
            </div>
          </div>

          {savedCars.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No cars saved yet</h2>
              <p className="text-white/50 mb-6">
                Browse the fleet and tap the heart to keep cars here for quick access.
              </p>
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 bg-[var(--gold-400)] text-black px-6 py-3 rounded-xl font-semibold"
              >
                <Car className="w-5 h-5" /> Explore fleet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--gold-400)]/30 transition-colors group relative"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton carId={car.slug} initiallySaved />
                  </div>
                  <div className="relative h-48 w-full bg-neutral-900">
                    <Image
                      src={car.src}
                      alt={car.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{car.name}</h3>
                        <p className="text-xs text-[var(--gold-400)] uppercase tracking-wider">{car.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{car.price.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-white/40">/ day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-5">
                      <span>{car.seats} seats</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                    </div>
                    <Link
                      href={`/cars/${car.slug}`}
                      className="block w-full text-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
