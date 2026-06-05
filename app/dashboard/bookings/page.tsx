'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays, Car, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'
import type { Booking } from '@/lib/types'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setBookings(data)
      setLoading(false)
    }
    load()
  }, [router])

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const statusColors: Record<string, string> = {
    pending: 'bg-[var(--gold-400)]/10 text-[var(--gold-400)] border-[var(--gold-400)]/20',
    confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    completed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
  }

  const paymentColors: Record<string, string> = {
    unpaid: 'text-white/30',
    pending: 'text-yellow-400',
    paid: 'text-emerald-400',
    refunded: 'text-red-400',
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-[family-name:var(--font-playfair)] font-bold">Your Bookings</h1>
                  <p className="text-xs text-white/40">{bookings.length} total bookings</p>
                </div>
              </div>
              <Link
                href="/cars"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-black cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400))' }}
              >
                <Car className="w-3.5 h-3.5" /> New Booking
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    filter === f
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'bg-white/[0.02] text-white/30 border border-white/5 hover:text-white/50'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[var(--gold-400)]/30 border-t-[var(--gold-400)] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl p-12 text-center" style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">
                  {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((b, i) => (
                  <motion.div
                    key={b.id}
                    className="rounded-xl p-5"
                    style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--gold-400)]">{b.booking_ref}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[b.status]}`}>
                            {b.status}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-white mt-1">{b.car_name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--gold-400)]">₹{b.total_amount?.toLocaleString('en-IN')}</p>
                        <p className={`text-[10px] ${paymentColors[b.payment_status]}`}>
                          Payment: {b.payment_status}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                      <div>
                        <p className="text-white/30">Date</p>
                        <p className="text-white/70">{b.booking_date}</p>
                      </div>
                      <div>
                        <p className="text-white/30">Time</p>
                        <p className="text-white/70">{b.booking_time}</p>
                      </div>
                      <div>
                        <p className="text-white/30">Pickup</p>
                        <p className="text-white/70">{b.pickup_location}</p>
                      </div>
                      <div>
                        <p className="text-white/30">Service</p>
                        <p className="text-white/70">{b.service_type}</p>
                      </div>
                    </div>

                    {/* Timeline & Actions */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                        <span className={b.status !== 'pending' ? 'text-[var(--gold-400)]' : 'text-white'}>Pending</span>
                        <span>→</span>
                        <span className={b.status === 'confirmed' || b.status === 'completed' ? 'text-[var(--gold-400)]' : ''}>Confirmed</span>
                        <span>→</span>
                        <span className={b.status === 'completed' ? 'text-[var(--gold-400)]' : ''}>Completed</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link href={`/dashboard/invoices/${b.id}`} target="_blank" className="flex-1 sm:flex-none text-center text-xs text-zinc-400 hover:text-[var(--gold-400)] transition flex items-center justify-center gap-1 border border-white/10 rounded-lg px-4 py-2 hover:border-[var(--gold-400)]/30 bg-white/5">
                          View Invoice
                        </Link>
                        <Link href={`/cars?rebook=${b.car_id}`} className="flex-1 sm:flex-none text-center text-xs bg-[var(--gold-400)] text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                          Re-Book
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
