import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface PaymentFailedEmailProps {
  customerName: string
  reference: string
  carName: string
  totalPrice: number
  upiTransactionId?: string | null
  checkoutUrl: string
}

export function renderPaymentFailedEmail(props: PaymentFailedEmailProps) {
  const { customerName, reference, carName, totalPrice, upiTransactionId, checkoutUrl } = props

  const contentHtml = `
    <h1 class="h1-title" style="color: #f87171;">Action Required: Payment Verification Issue</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>Our finance desk was unable to match or verify the payment reference (<code>${escapeHtml(upiTransactionId || 'None provided')}</code>) for reservation <strong>${escapeHtml(reference)}</strong>.</p>

    <div class="card-panel" style="border-left: 3px solid #ef4444;">
      <p style="margin: 0 0 10px 0; color: #fca5a5; font-size: 14px; font-weight: 600;">
        Why did this happen?
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
        <li>The 12-digit UPI reference number may contain a typo.</li>
        <li>The bank transfer may still be pending or was declined by your UPI provider.</li>
        <li>The payment was credited under a different account reference.</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #e2e8f0;">
      Your vehicle (<strong>${escapeHtml(carName)}</strong>, ₹${Number(totalPrice || 0).toLocaleString('en-IN')}) is currently placed on temporary courtesy hold. To prevent automatic cancellation and release of your fleet reservation, please update your reference or choose another payment method.
    </p>
  `

  return {
    subject: `Action Required: Payment Issue with Reservation ${reference}`,
    html: renderBaseEmailLayout({
      title: `Payment Issue: ${reference}`,
      preheader: `Action required to secure your reservation for ${carName}.`,
      contentHtml,
      actionButton: {
        label: 'Update Payment Details',
        url: checkoutUrl,
      },
      secondaryButton: {
        label: 'Call Concierge Desk',
        url: 'tel:+916300041186',
      },
    }),
  }
}
