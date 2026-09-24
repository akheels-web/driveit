import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface VehicleReturnReminderEmailProps {
  customerName: string
  reference: string
  carName: string
  endDate?: string | null
  dropoffLocation?: string | null
  dashboardUrl: string
}

export function renderVehicleReturnReminderEmail(props: VehicleReturnReminderEmailProps) {
  const { customerName, reference, carName, endDate, dropoffLocation, dashboardUrl } = props

  const formattedEnd = endDate ? new Date(endDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '2 Hours'

  const contentHtml = `
    <h1 class="h1-title">Scheduled Vehicle Return Reminder</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>We hope you are enjoying your journey with the <strong>${escapeHtml(carName)}</strong>. This is a gentle reminder that your reservation (Ref: <strong>${escapeHtml(reference)}</strong>) is scheduled for return today at <strong>${escapeHtml(formattedEnd)}</strong>.</p>

    <div class="card-panel">
      <h3 style="margin: 0 0 10px 0; color: #d4af37; font-size: 15px;">Drop-off Details</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;">
        <strong>Return Location:</strong> ${escapeHtml(dropoffLocation || 'Original Pickup / Specified Return Address')}
      </p>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">
        Our concierge representative will meet you at the scheduled location to perform the swift closing vehicle handover.
      </p>
    </div>

    <div style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid #d4af37; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 6px 0; color: #d4af37; font-size: 14px;">Need More Time With The Car?</h4>
      <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
        If you wish to extend your reservation by hours or days, please tap the WhatsApp button below immediately. Extensions are subject to vehicle availability.
      </p>
    </div>
  `

  return {
    subject: `Scheduled Return Reminder: ${carName} — Ref: ${reference}`,
    html: renderBaseEmailLayout({
      title: `Return Reminder: ${reference}`,
      preheader: `Scheduled vehicle return for ${carName} at ${formattedEnd}.`,
      contentHtml,
      actionButton: {
        label: 'Request Extension on WhatsApp',
        url: 'https://wa.me/916300041186?text=Hello%2C%20I%20would%20like%20to%20request%20an%20extension%20for%20reservation%20' + encodeURIComponent(reference),
      },
      secondaryButton: {
        label: 'View Reservation',
        url: dashboardUrl,
      },
    }),
  }
}
