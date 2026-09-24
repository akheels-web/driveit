import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

import { auth } from '@/auth'
import config from '@/payload.config'
import { PrintButtons } from '@/components/print-buttons'

export const metadata = { title: 'Invoice | DRIVEIT Luxury', robots: { index: false } }

const money = (value: unknown) => `₹${Number(value || 0).toLocaleString('en-IN')}`

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.email) redirect(`/login?redirect=/dashboard/invoices/${id}`)

  const payload = await getPayload({ config })

  // findByID throws for missing/invalid ids — treat that as "not found".
  const booking = (await payload
    .findByID({ collection: 'bookings', id, depth: 0, overrideAccess: true, disableErrors: true })
    .catch(() => null)) as Record<string, any> | null

  if (!booking) notFound()

  // Ownership check against the session (the previous version compared against an
  // undefined `user` object and crashed for every visitor).
  if (String(booking.customerEmail).toLowerCase() !== session.user.email.toLowerCase()) {
    redirect('/dashboard/bookings')
  }

  const reference = `DRV-${String(booking.id).padStart(5, '0')}`
  const subtotal = Number(booking.totalPrice || 0) + Number(booking.discountApplied || 0)

  return (
    <div className="min-h-screen bg-neutral-900/50 text-white">
      <div className="bg-[#111] border-b border-white/10 p-4 print:hidden sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to bookings
          </Link>
          <PrintButtons />
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 sm:p-8 md:py-12">
        <div className="bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden print:bg-white print:text-black print:border-none">
          <div className="p-8 md:p-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="text-3xl font-[family-name:var(--font-playfair)] font-bold tracking-wider mb-2 text-[var(--gold-400)] print:text-black">
                DRIVEIT
              </div>
              <p className="text-sm text-zinc-400 print:text-black/60">Premium luxury car rental</p>
              <div className="mt-4 text-xs text-zinc-500 print:text-black/50 space-y-1">
                <p>123 Jubilee Hills, Road No 36</p>
                <p>Hyderabad, Telangana 500033</p>
                <p>+91 63000 41186 | info@driveit.in</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h1 className="text-4xl font-light tracking-widest uppercase mb-4 opacity-80">Invoice</h1>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-left md:text-right">
                <span className="text-zinc-500">Invoice no:</span>
                <span className="font-mono font-medium">{reference}</span>
                <span className="text-zinc-500">Date:</span>
                <span className="font-medium">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : '—'}
                </span>
                <span className="text-zinc-500">Status:</span>
                <span className="font-semibold uppercase tracking-wider text-[var(--gold-400)] print:text-amber-600">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 border-b border-white/10 pb-2">
                Billed to
              </h3>
              <p className="font-semibold text-lg">{booking.customerName}</p>
              <p className="text-zinc-400 text-sm mt-1">{booking.customerEmail}</p>
              <p className="text-zinc-400 text-sm">{booking.customerPhone}</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 border-b border-white/10 pb-2">
                Service details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service type:</span>
                  <span className="font-medium capitalize">{booking.serviceType || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Start:</span>
                  <span className="font-medium">
                    {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">End:</span>
                  <span className="font-medium">
                    {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">Pickup:</span>
                  <span className="font-medium text-right truncate">{booking.pickupLocation || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 md:px-12 pb-8">
            <div className="w-full border border-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-white/5 p-4 text-xs uppercase tracking-widest font-semibold text-zinc-400">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              <div className="grid grid-cols-12 gap-4 p-4 border-t border-white/10 items-center">
                <div className="col-span-6">
                  <p className="font-bold text-base">{booking.carName}</p>
                  <p className="text-xs text-zinc-500 mt-1 capitalize">
                    {booking.serviceType} service
                    {booking.addons ? ` • ${String(booking.addons).split(',').join(', ')}` : ''}
                  </p>
                </div>
                <div className="col-span-2 text-right text-zinc-400">{booking.days || 1}</div>
                <div className="col-span-4 text-right font-medium">{money(subtotal)}</div>
              </div>

              <div className="bg-[#111] border-t border-white/10 p-6 flex flex-col items-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  {Number(booking.discountApplied) > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount {booking.couponCode ? `(${booking.couponCode})` : ''}</span>
                      <span>-{money(booking.discountApplied)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--gold-400)]">{money(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-8 md:p-12 border-t border-white/10 flex flex-col md:flex-row gap-6 items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--gold-400)]" />
              <span>DRIVEIT secure booking. This is a computer generated invoice.</span>
            </div>
            <p>Thank you for choosing DRIVEIT Luxury.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
