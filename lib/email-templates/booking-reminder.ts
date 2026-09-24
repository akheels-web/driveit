import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface BookingReminderEmailProps {
  customerName: string
  reference: string
  carName: string
  serviceType?: string | null
  pickupLocation?: string | null
  startDate?: string | null
  dashboardUrl: string
}

export function renderBookingReminderEmail(props: BookingReminderEmailProps) {
  const { customerName, reference, carName, serviceType, pickupLocation, startDate, dashboardUrl } = props

  const serviceLabel = serviceType === 'selfdrive' ? 'Self Drive Luxury' : serviceType === 'airport' ? 'Airport VIP Transfer' : 'Chauffeur Driven Experience'
  const formattedStart = startDate ? new Date(startDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tomorrow'

  const contentHtml = `
    <h1 class="h1-title">Your DriveIt Experience Begins Tomorrow</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>This is a polite reminder that your luxury reservation <strong>${escapeHtml(reference)}</strong> is scheduled for tomorrow.</p>

    <div class="card-panel">
      <h3 style="margin: 0 0 12px 0; color: #d4af37; font-size: 16px;">Trip Details</h3>
      <table width="100%" style="font-size: 14px;">
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Vehicle</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding-bottom: 8px;">${escapeHtml(carName)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Format</td>
          <td style="color: #ffffff; text-align: right; padding-bottom: 8px;">${escapeHtml(serviceLabel)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Scheduled Time</td>
          <td style="color: #d4af37; font-weight: 700; text-align: right; padding-bottom: 8px;">${escapeHtml(formattedStart)}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding-bottom: 8px;">Pickup Location</td>
          <td style="color: #ffffff; text-align: right; padding-bottom: 8px;">${escapeHtml(pickupLocation || 'Confirmed Address')}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #16161d; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px;">Preparation Checklist:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
        <li>Your vehicle is currently undergoing multi-point mechanical inspection, interior leather conditioning, and thorough sanitization.</li>
        <li><strong>Self-Drive Guests:</strong> Please have your original Driving License and government ID ready for swift mobile verification at handoff.</li>
        <li><strong>Chauffeur Guests:</strong> Your executive chauffeur details and direct contact will be messaged 2 hours prior to arrival.</li>
      </ul>
    </div>
  `

  return {
    subject: `Your Upcoming DriveIt Experience Tomorrow — ${carName} (${reference})`,
    html: renderBaseEmailLayout({
      title: `Upcoming Reservation: ${reference}`,
      preheader: `Your ${carName} is being prepared for your reservation tomorrow.`,
      contentHtml,
      actionButton: {
        label: 'View Reservation Details',
        url: dashboardUrl,
      },
      secondaryButton: {
        label: 'WhatsApp Concierge',
        url: 'https://wa.me/916300041186',
      },
    }),
  }
}
