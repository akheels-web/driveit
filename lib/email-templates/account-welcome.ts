import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface AccountWelcomeEmailProps {
  customerName: string
  exploreFleetUrl: string
}

export function renderAccountWelcomeEmail(props: AccountWelcomeEmailProps) {
  const { customerName, exploreFleetUrl } = props

  const contentHtml = `
    <h1 class="h1-title">Welcome to the DriveIt Luxury Club</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>It is our distinct pleasure to welcome you to <strong>DriveIt Luxury Concierge</strong> — India's premier bespoke fleet and private mobility service.</p>

    <div class="card-panel" style="border-color: #d4af37;">
      <h3 style="margin: 0 0 12px 0; color: #d4af37; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Your VIP Membership Privileges</h3>
      <table width="100%" style="font-size: 14px; line-height: 2;">
        <tr>
          <td style="color: #d4af37; width: 24px;">&#9733;</td>
          <td style="color: #ffffff;"><strong>Pristine Exotic Fleet:</strong> Hand-curated sedans, SUVs, and supercars.</td>
        </tr>
        <tr>
          <td style="color: #d4af37; width: 24px;">&#9733;</td>
          <td style="color: #ffffff;"><strong>White-Glove Chauffeur Service:</strong> Vetted, suited executive chauffeurs.</td>
        </tr>
        <tr>
          <td style="color: #d4af37; width: 24px;">&#9733;</td>
          <td style="color: #ffffff;"><strong>Loyalty Rewards:</strong> Earn 100 points per ₹10,000 spent towards Gold & Platinum perks.</td>
        </tr>
        <tr>
          <td style="color: #d4af37; width: 24px;">&#9733;</td>
          <td style="color: #ffffff;"><strong>24/7 Dedicated Concierge Desk:</strong> Direct WhatsApp & telephone booking priority.</td>
        </tr>
      </table>
    </div>

    <!-- Onboarding Voucher Gift -->
    <div style="background: linear-gradient(135deg, #1f1d13 0%, #15151b 100%); border: 1px dashed #d4af37; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Welcome Gift For Your First Reservation</p>
      <h2 style="margin: 0; color: #ffffff; font-size: 26px; letter-spacing: 3px;">WELCOME10</h2>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #94a3b8;">Apply at checkout for 10% off your initial booking.</p>
    </div>

    <p style="font-size: 14px; color: #cbd5e1;">
      Whether you require an executive airport escort, a wedding procession, or a weekend self-drive escape, your concierge is at your service.
    </p>
  `

  return {
    subject: `Welcome to the DriveIt Luxury Club, ${customerName}`,
    html: renderBaseEmailLayout({
      title: 'Welcome to DriveIt Luxury',
      preheader: `Welcome to DriveIt Luxury Concierge. Enjoy 10% off your first reservation with code WELCOME10.`,
      contentHtml,
      actionButton: {
        label: 'Explore the Luxury Fleet',
        url: exploreFleetUrl,
      },
      secondaryButton: {
        label: 'Chat with Concierge',
        url: 'https://wa.me/919876543210',
      },
    }),
  }
}
