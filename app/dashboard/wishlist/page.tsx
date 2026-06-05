import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Heart, Car } from 'lucide-react'
import { carsData } from '@/lib/cars'
import { SiteHeader } from '@/components/site-header'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('car_id')
    .eq('user_id', user.id)

  const savedCarIds = wishlists?.map(w => w.car_id) || []
  const savedCars = carsData.filter(car => savedCarIds.includes(car.id))

  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] min-h-screen text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold text-[var(--gold-400)]">Your Saved Fleet</h1>
              <p className="text-sm text-white/50 mt-1">Easily re-book your favorite vehicles</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/10">
              <Heart className="w-4 h-4 inline-block mr-2 text-[var(--gold-400)] fill-current" />
              {savedCars.length} Saved
            </div>
          </div>

          {savedCars.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No cars saved yet</h2>
              <p className="text-white/50 mb-6">Browse our fleet and click the heart icon to save cars here for quick access.</p>
              <Link href="/cars" className="inline-flex items-center gap-2 bg-[var(--gold-400)] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[var(--gold-500)] transition">
                <Car className="w-5 h-5" /> Explore Fleet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCars.map(car => (
                <div key={car.id} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--gold-400)]/30 transition-colors group">
                  <div className="relative h-48 w-full bg-neutral-900">
                    <img src={car.src} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{car.name}</h3>
                        <p className="text-xs text-[var(--gold-400)] uppercase tracking-wider">{car.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{car.price.toLocaleString()}</p>
                        <p className="text-[10px] text-white/40">/ day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-5">
                      <span>{car.seats} Seats</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                    </div>
                    <Link href={`/cars/${car.slug}`} className="block w-full text-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition">
                      View Details
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
