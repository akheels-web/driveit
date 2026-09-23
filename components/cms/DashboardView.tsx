import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function DashboardView() {
  const stats = {
    totalCars: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentBookings: [] as any[],
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const [carsRes, bookingsRes, usersRes] = await Promise.allSettled([
      payload.find({ collection: 'cars', limit: 100 }),
      payload.find({ collection: 'bookings', limit: 100 }),
      payload.find({ collection: 'users', limit: 100 }),
    ])

    if (carsRes.status === 'fulfilled') {
      stats.totalCars = carsRes.value.totalDocs
    }
    if (usersRes.status === 'fulfilled') {
      stats.totalUsers = usersRes.value.totalDocs
    }
    if (bookingsRes.status === 'fulfilled') {
      const bookings = bookingsRes.value
      stats.totalBookings = bookings.totalDocs
      stats.recentBookings = bookings.docs.slice(0, 5)

      bookings.docs.forEach((b: any) => {
        if (b.status === 'confirmed') {
          stats.confirmedBookings++
          stats.totalRevenue += b.totalPrice || 0
        } else if (b.status === 'pending') {
          stats.pendingBookings++
        } else if (b.status === 'completed') {
          stats.completedBookings++
          stats.totalRevenue += b.totalPrice || 0
        }
      })
    }
  } catch (e) {
    console.error('Dashboard metrics error:', e)
  }

  return (
    <div style={{ padding: '2.5rem', backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#d4af37', fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '0.03em' }}>
            DRIVEIT EXECUTIVE PORTAL
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '1rem' }}>
            Real-time Fleet Operations, Customer Reservations & Revenue Metrics
          </p>
        </div>
        <Link
          href="/admin/globals/site-settings"
          style={{
            background: 'linear-gradient(135deg, #f0d060, #d4af37)',
            color: '#000',
            fontWeight: 700,
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          ⚙️ Site Settings
        </Link>
      </div>

      {/* KPI Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            background: '#121215',
            border: '1px solid #1f1f23',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            💰 Total Revenue
          </div>
          <div style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>From confirmed bookings</div>
        </div>

        <div
          style={{
            background: '#121215',
            border: '1px solid #1f1f23',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            📋 Live Bookings
          </div>
          <div style={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {stats.confirmedBookings} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {stats.totalBookings} total</span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
            {stats.pendingBookings} pending approval
          </div>
        </div>

        <div
          style={{
            background: '#121215',
            border: '1px solid #1f1f23',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            🚗 Total Fleet Vehicles
          </div>
          <div style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {stats.totalCars} <span style={{ fontSize: '1rem', color: '#10b981' }}>Active</span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Luxury fleet inventory</div>
        </div>

        <div
          style={{
            background: '#121215',
            border: '1px solid #1f1f23',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
            👑 System Admins
          </div>
          <div style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {stats.totalUsers}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Executive Portal users</div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h2 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem' }}>
        🚀 Direct Website Management
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.2rem',
          marginBottom: '3rem',
        }}
      >
        <Link
          href="/admin/collections/cars"
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '14px',
            padding: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>🚗 Fleet Catalog</div>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Manage Cars & Pricing</div>
          <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
            Updates /cars, /cars/[slug], and Homepage slider.
          </div>
        </Link>

        <Link
          href="/admin/collections/bookings"
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '14px',
            padding: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📋 Reservations</div>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Live Customer Bookings</div>
          <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
            View checkout bookings and update status.
          </div>
        </Link>

        <Link
          href="/admin/collections/blogs"
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '14px',
            padding: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📰 Editorial Blogs</div>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Publish Blog Posts</div>
          <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
            Updates /blog list and article detail pages.
          </div>
        </Link>

        <Link
          href="/admin/collections/services"
          style={{
            background: '#121215',
            border: '1px solid #27272a',
            borderRadius: '14px',
            padding: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>🛠️ Services Catalog</div>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Chauffeur & Rental Services</div>
          <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
            Updates /services catalog and landing pages.
          </div>
        </Link>
      </div>

      {/* Recent Bookings Live Feed */}
      <h2 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem' }}>
        ⏱️ Recent Live Customer Bookings
      </h2>

      <div style={{ background: '#121215', border: '1px solid #1f1f23', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#18181b', color: '#d4af37', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              <th style={{ padding: '14px 18px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '14px 18px', textAlign: 'left' }}>Car Rented</th>
              <th style={{ padding: '14px 18px', textAlign: 'left' }}>Service Type</th>
              <th style={{ padding: '14px 18px', textAlign: 'left' }}>Amount</th>
              <th style={{ padding: '14px 18px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No customer bookings recorded yet. New checkout bookings will appear here instantly!
                </td>
              </tr>
            ) : (
              stats.recentBookings.map((b: any) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #1f1f23' }}>
                  <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 600 }}>{b.customerName}</td>
                  <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{b.carName}</td>
                  <td style={{ padding: '14px 18px', color: '#cbd5e1', textTransform: 'capitalize' }}>{b.serviceType}</td>
                  <td style={{ padding: '14px 18px', color: '#10b981', fontWeight: 700 }}>₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor:
                          b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: b.status === 'confirmed' ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
