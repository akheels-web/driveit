import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface PaymentVerifiedEmailProps {
  customerName: string
  reference: string
  carName: string
  totalPrice: number
  upiTransactionId?: string | null
  invoiceUrl: string
}

export function renderPaymentVerifiedEmail(props: PaymentVerifiedEmailProps) {
  const { customerName, reference, carName, totalPrice, upiTransactionId, invoiceUrl } = props

  const contentHtml = `
    <h1 class="h1-title" style="color: #4ade80;">Payment Verified &bull; Official Receipt</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>We are delighted to confirm that your payment for reservation <strong>${escapeHtml(reference)}</strong> has been verified by our accounts desk. Your vehicle is officially locked and guaranteed.</p>

    <div class="card-panel" style="border-color: #22c55e;">
      <table width="100%" style="font-size: 14px;">
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Reservation Reference</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding-bottom: 8px;">${escapeHtml(reference)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Vehicle</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding-bottom: 8px;">${escapeHtml(carName)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Payment Reference</td>
          <td style="color: #d4af37; font-weight: 600; text-align: right; padding-bottom: 8px;">${escapeHtml(upiTransactionId || 'UPI Verified')}</td>
        </tr>
        <tr style="border-top: 1px solid #282834;">
          <td style="color: #ffffff; font-weight: 700; padding-top: 12px; font-size: 15px;">Amount Paid in Full</td>
          <td style="color: #4ade80; font-weight: 800; text-align: right; padding-top: 12px; font-size: 18px;">₹${Number(totalPrice || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #16161d; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 8px 0; color: #d4af37; font-size: 14px; text-transform: uppercase;">What Happens Next:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
        <li>Your vehicle will undergo full mechanical inspection and interior sanitization.</li>
        <li>Chauffeur details and live vehicle tracking link will be transmitted via WhatsApp 2 hours prior to arrival.</li>
        <li>Our concierge desk remains on 24/7 standby for any itinerary adjustments.</li>
      </ul>
    </div>
  `

  return {
    subject: `Payment Verified — Official Receipt for ${reference}`,
    html: renderBaseEmailLayout({
      title: `Payment Verified: ${reference}`,
      preheader: `Payment of ₹${Number(totalPrice || 0).toLocaleString('en-IN')} verified for ${carName}.`,
      contentHtml,
      actionButton: {
        label: 'Download Official Receipt',
        url: invoiceUrl,
      },
      secondaryButton: {
        label: 'Concierge WhatsApp',
        url: 'https://wa.me/919876543210',
      },
    }),
  }
}
