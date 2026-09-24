import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface BookingCancelledEmailProps {
  customerName: string
  reference: string
  carName: string
  cancellationReason?: string | null
  exploreFleetUrl: string
}

export function renderBookingCancelledEmail(props: BookingCancelledEmailProps) {
  const { customerName, reference, carName, cancellationReason, exploreFleetUrl } = props

  const contentHtml = `
    <h1 class="h1-title">Reservation Cancelled</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>This email confirms that your reservation <strong>${escapeHtml(reference)}</strong> for the <strong>${escapeHtml(carName)}</strong> has been cancelled.</p>

    ${cancellationReason ? `
      <div class="card-panel">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8; text-transform: uppercase;">Cancellation Reason:</p>
        <p style="margin: 0; font-size: 14px; color: #ffffff; font-weight: 500;">${escapeHtml(cancellationReason)}</p>
      </div>
    ` : ''}

    <div style="background-color: #16161d; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 8px 0; color: #d4af37; font-size: 14px;">Refund & Security Policy</h4>
      <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.7;">
        If a deposit or payment was verified for this booking, any eligible refund according to our policy will be processed back to the original funding account within 3–5 banking days.
      </p>
    </div>

    <p style="font-size: 14px; color: #94a3b8;">
      We regret any inconvenience caused. Our private concierge desk is always at your service should you wish to select another vehicle from our luxury fleet.
    </p>
  `

  return {
    subject: `Reservation Cancelled: ${carName} — Ref: ${reference}`,
    html: renderBaseEmailLayout({
      title: `Cancelled: ${reference}`,
      preheader: `Confirmation of cancellation for reservation ${reference}.`,
      contentHtml,
      actionButton: {
        label: 'Explore Fleet for Future Dates',
        url: exploreFleetUrl,
      },
      secondaryButton: {
        label: 'Contact Concierge',
        url: 'https://wa.me/916300041186',
      },
    }),
  }
}
