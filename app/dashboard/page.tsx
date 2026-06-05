'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, CalendarDays, User, LogOut, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'
import type { Profile, Booking } from '@/lib/types'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profileData) setProfile(profileData)

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      if (bookingsData) setBookings(bookingsData)

      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <section className="bg-[var(--luxury-bg)] text-white min-h-screen flex items-center justify-center pt-20">
          <div className="w-8 h-8 border-2 border-[var(--gold-400)]/30 border-t-[var(--gold-400)] rounded-full animate-spin" />
        </section>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4">

          {/* Welcome Header */}
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-white/40">Dashboard</span>
              <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] font-bold text-white mt-1">
                Welcome, <span className="text-gradient-gold">{profile?.full_name || user?.email?.split('@')[0] || 'Guest'}</span>
              </h1>
              <p className="text-sm text-white/40 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white/40 border border-white/10 hover:border-red-400/30 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              { icon: CalendarDays, label: 'Total Bookings', value: stats.total, color: 'var(--gold-400)' },
              { icon: Clock, label: 'Upcoming', value: stats.upcoming, color: '#60a5fa' },
              { icon: CheckCircle, label: 'Completed', value: stats.completed, color: '#34d399' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 text-center"
                style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/cars"
              className="flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:border-[var(--gold-400)]/20"
              style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-[var(--gold-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Book a Car</p>
                <p className="text-[10px] text-white/30">Browse our luxury fleet</p>
              </div>
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:border-[var(--gold-400)]/20"
              style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">View Bookings</p>
                <p className="text-[10px] text-white/30">All booking history</p>
              </div>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:border-[var(--gold-400)]/20"
              style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Edit Profile</p>
                <p className="text-[10px] text-white/30">Update your details</p>
              </div>
            </Link>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
              <Link href="/dashboard/bookings" className="text-xs text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors">
                View All →
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Car className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">No bookings yet</p>
                <Link href="/cars" className="text-xs text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors mt-2 inline-block">
                  Book Your First Ride →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-xs font-mono text-[var(--gold-400)]">
                        {booking.booking_ref.replace('DRV-', '')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{booking.car_name}</p>
                        <p className="text-[10px] text-white/30">{booking.booking_date} • {booking.booking_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        booking.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                        booking.status === 'completed' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                        booking.status === 'cancelled' ? 'bg-red-400/10 text-red-400 border border-red-400/20' :
                        'bg-[var(--gold-400)]/10 text-[var(--gold-400)] border border-[var(--gold-400)]/20'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-sm font-medium text-[var(--gold-400)]">₹{booking.total_amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
