import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  let booking: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    booking = await payload.findByID({
      collection: 'bookings',
      id,
    })
  } catch (e) {}

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Invoice Not Found</h1>
          <p className="text-zinc-400 mb-6">We couldn't locate the invoice for this booking ID.</p>
          <Link href="/dashboard/bookings" className="text-[var(--gold-400)] underline">Return to Dashboard</Link>
        </div>
      </div>
    )
  }

  // Ensure the user owns this booking
  if (booking.user_id !== user.id) {
    redirect('/dashboard/bookings')
  }

  const invoiceNumber = `INV-${booking.booking_ref}`
  const dateStr = new Date(booking.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-neutral-900/50 text-white selection:bg-[var(--gold-400)]/30">
      {/* Top action bar - Hidden during print */}
      <div className="bg-[#111] border-b border-white/10 p-4 print:hidden sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/bookings" className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button 
              onClick="window.print()" 
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button 
              onClick="window.print()" 
              className="flex items-center gap-2 bg-[var(--gold-400)] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              <Download className="w-4 h-4" /> Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 md:py-12">
        <div className="bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:border-none print:bg-white print:text-black">
          
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-white/10 print:border-black/10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="text-3xl font-[family-name:var(--font-playfair)] font-bold tracking-wider mb-2 text-[var(--gold-400)] print:text-black">
                DRIVEIT<span className="text-white text-xs align-top print:text-black/50">®</span>
              </div>
              <p className="text-sm text-zinc-400 print:text-black/60">Premium Luxury Car Rental</p>
              <div className="mt-4 text-xs text-zinc-500 print:text-black/50 space-y-1">
                <p>123 Jubilee Hills, Road No 36</p>
                <p>Hyderabad, Telangana 500033</p>
                <p>+91 83413 41186 | info@driveit.in</p>
                <p>GSTIN: 36ABCDE1234F1Z5</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h1 className="text-4xl font-light tracking-widest uppercase mb-4 opacity-80 print:opacity-100">Invoice</h1>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-left md:text-right">
                <span className="text-zinc-500 print:text-black/50">Invoice No:</span>
                <span className="font-mono font-medium">{invoiceNumber}</span>
                
                <span className="text-zinc-500 print:text-black/50">Date:</span>
                <span className="font-medium">{dateStr}</span>
                
                <span className="text-zinc-500 print:text-black/50">Status:</span>
                <span className={`font-semibold uppercase tracking-wider ${booking.payment_status === 'paid' ? 'text-emerald-400 print:text-emerald-600' : 'text-[var(--gold-400)] print:text-amber-600'}`}>
                  {booking.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Booking Details */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 print:text-black/50 mb-3 border-b border-white/10 print:border-black/10 pb-2">Billed To</h3>
              <p className="font-semibold text-lg">{booking.first_name} {booking.last_name}</p>
              <p className="text-zinc-400 print:text-black/70 text-sm mt-1">{booking.email}</p>
              <p className="text-zinc-400 print:text-black/70 text-sm">{booking.phone}</p>
              {booking.special_requests && (
                <div className="mt-4 p-3 bg-white/5 print:bg-black/5 rounded-lg border border-white/5 print:border-black/5">
                  <p className="text-xs text-zinc-500 print:text-black/50 mb-1">Notes</p>
                  <p className="text-sm italic text-zinc-300 print:text-black/80">"{booking.special_requests}"</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 print:text-black/50 mb-3 border-b border-white/10 print:border-black/10 pb-2">Service Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-black/60">Service Type:</span>
                  <span className="font-medium capitalize">{booking.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-black/60">Pickup Date:</span>
                  <span className="font-medium">{booking.booking_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-black/60">Pickup Time:</span>
                  <span className="font-medium">{booking.booking_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-black/60">Pickup Location:</span>
                  <span className="font-medium text-right max-w-[200px] truncate" title={booking.pickup_location}>{booking.pickup_location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="px-8 md:px-12 pb-8">
            <div className="w-full border border-white/10 print:border-black/20 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-white/5 print:bg-black/5 p-4 text-xs uppercase tracking-widest font-semibold text-zinc-400 print:text-black/60">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>
              
              <div className="grid grid-cols-12 gap-4 p-4 border-t border-white/10 print:border-black/10 items-center">
                <div className="col-span-6">
                  <p className="font-bold text-base">{booking.car_name}</p>
                  <p className="text-xs text-zinc-500 print:text-black/50 mt-1">{booking.service_type} service</p>
                </div>
                <div className="col-span-2 text-right text-zinc-400 print:text-black/60">
                  1
                </div>
                <div className="col-span-4 text-right font-medium">
                  ₹{booking.total_amount?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-[#111] print:bg-black/5 border-t border-white/10 print:border-black/10 p-6 flex flex-col items-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-sm text-zinc-400 print:text-black/60">
                    <span>Subtotal</span>
                    <span>₹{booking.total_amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400 print:text-black/60">
                    <span>GST (0%)</span>
                    <span>₹0</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 print:border-black/20 flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--gold-400)] print:text-black">₹{booking.total_amount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="bg-[#111] print:bg-transparent p-8 md:p-12 border-t border-white/10 print:border-t-2 print:border-black/10 flex flex-col md:flex-row gap-6 items-center justify-between text-xs text-zinc-500 print:text-black/50 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="w-4 h-4 text-[var(--gold-400)] print:text-black/50" />
              <span>DRIVEIT Secure Booking. This is a computer generated invoice.</span>
            </div>
            <p>Thank you for choosing DRIVEIT Luxury.</p>
          </div>

        </div>
      </main>

      {/* Script for printing via React buttons without hydration errors on `onClick="window.print()"` */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('button').forEach(btn => {
          if(btn.getAttribute('onClick') === 'window.print()') {
            btn.onclick = () => window.print();
            btn.removeAttribute('onClick');
          }
        });
      `}} />
    </div>
  )
}
