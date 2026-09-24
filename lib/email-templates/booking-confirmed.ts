import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface BookingConfirmedEmailProps {
  customerName: string
  reference: string
  carName: string
  serviceType?: string | null
  pickupLocation?: string | null
  startDate?: string | null
  endDate?: string | null
  totalPrice: number
  paymentStatus?: string | null
  upiTransactionId?: string | null
  invoiceUrl: string
}

export function renderBookingConfirmedEmail(props: BookingConfirmedEmailProps) {
  const {
    customerName,
    reference,
    carName,
    serviceType,
    pickupLocation,
    startDate,
    endDate,
    totalPrice,
    paymentStatus,
    upiTransactionId,
    invoiceUrl,
  } = props

  const isVerified = paymentStatus === 'verified'
  const serviceLabel = serviceType === 'selfdrive' ? 'Self Drive Luxury' : serviceType === 'airport' ? 'Airport VIP Transfer' : 'Chauffeur Driven'
  const formattedStart = startDate ? new Date(startDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
  const formattedEnd = endDate ? new Date(endDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  const contentHtml = `
    <h1 class="h1-title">Reservation Confirmed</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>Thank you for choosing DriveIt Luxury Concierge. Your vehicle reservation has been successfully registered under booking reference <strong>${escapeHtml(reference)}</strong>.</p>
    
    <div class="card-panel">
      <table width="100%" style="font-size: 14px;">
        <tr>
          <td style="color: #94a3b8; padding-bottom: 10px;">Vehicle</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding-bottom: 10px;">${escapeHtml(carName)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 10px;">Service Format</td>
          <td style="color: #d4af37; font-weight: 600; text-align: right; padding-bottom: 10px;">${escapeHtml(serviceLabel)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 10px;">Pickup Schedule</td>
          <td style="color: #ffffff; text-align: right; padding-bottom: 10px;">${escapeHtml(formattedStart)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 10px;">Return Schedule</td>
          <td style="color: #ffffff; text-align: right; padding-bottom: 10px;">${escapeHtml(formattedEnd)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 10px;">Pickup Address</td>
          <td style="color: #ffffff; text-align: right; padding-bottom: 10px;">${escapeHtml(pickupLocation || 'Bangalore City Core / Hotel / Airport')}</td>
        </tr>
        <tr style="border-top: 1px solid #282834;">
          <td style="color: #ffffff; font-weight: 700; padding-top: 12px; font-size: 16px;">Total Quotation</td>
          <td style="color: #d4af37; font-weight: 800; text-align: right; padding-top: 12px; font-size: 18px;">₹${Number(totalPrice || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    ${isVerified ? `
      <div style="background-color: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
        <p style="margin: 0; color: #4ade80; font-size: 14px; font-weight: 600;">
          Payment Status: Verified &bull; Your vehicle is 100% secured.
        </p>
      </div>
    ` : `
      <div style="background-color: rgba(212, 175, 55, 0.1); border-left: 3px solid #d4af37; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
        <p style="margin: 0; color: #fde047; font-size: 13px;">
          <strong>Payment Verification Pending:</strong> We have logged your reference (<code>${escapeHtml(upiTransactionId || 'Awaiting entry')}</code>). Our finance desk will verify and dispatch an official payment receipt.
        </p>
      </div>
    `}

    <p style="font-size: 13px; color: #94a3b8;">
      An official PDF tax invoice has been generated and attached to this email. You can also view or print your itinerary anytime directly from your DriveIt Customer Dashboard.
    </p>
  `

  return {
    subject: `Reservation Confirmed: ${carName} — Ref: ${reference}`,
    html: renderBaseEmailLayout({
      title: `Booking Confirmed: ${reference}`,
      preheader: `Your reservation for ${carName} is confirmed with DriveIt Luxury Concierge.`,
      contentHtml,
      actionButton: {
        label: 'View Itinerary & Invoice',
        url: invoiceUrl,
      },
      secondaryButton: {
        label: 'WhatsApp Concierge',
        url: 'https://wa.me/919876543210',
      },
    }),
  }
}
