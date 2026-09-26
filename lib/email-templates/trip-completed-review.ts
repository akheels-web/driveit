import { escapeHtml } from '@/lib/html'
import { renderBaseEmailLayout } from './base-layout'

export interface TripCompletedReviewEmailProps {
  customerName: string
  reference: string
  carName: string
  pointsEarned: number
  currentTier?: string | null
  feedbackUrl: string
}

export function renderTripCompletedReviewEmail(props: TripCompletedReviewEmailProps) {
  const { customerName, reference, carName, pointsEarned, currentTier, feedbackUrl } = props

  const tierLabel = currentTier ? currentTier.toUpperCase() : 'SILVER'

  const contentHtml = `
    <h1 class="h1-title">Thank You for Riding with DriveIt</h1>
    <p style="margin-top: 0;">Dear ${escapeHtml(customerName)},</p>
    <p>Your recent journey with the <strong>${escapeHtml(carName)}</strong> (Ref: <strong>${escapeHtml(reference)}</strong>) has concluded. We sincerely hope your experience was nothing short of extraordinary.</p>

    <!-- Points Card -->
    <div class="card-panel" style="text-align: center; border-color: #d4af37;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">Loyalty Rewards Credited</p>
      <h2 style="margin: 0; color: #ffffff; font-size: 32px;">+${Number(pointsEarned || 0).toLocaleString('en-IN')} Points</h2>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8;">
        Your current membership status: <strong style="color: #ffffff;">${escapeHtml(tierLabel)} MEMBER</strong>
      </p>
    </div>

    <!-- Rating stars widget -->
    <div style="background-color: #16161d; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
      <h3 style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px;">How was your overall experience?</h3>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8;">Your feedback allows us to refine every bespoke detail of our white-glove service.</p>
      <div style="font-size: 28px; letter-spacing: 6px; color: #d4af37; margin-bottom: 12px;">
        &#9733; &#9733; &#9733; &#9733; &#9733;
      </div>
      <a href="${escapeHtml(feedbackUrl)}" style="color: #d4af37; font-size: 13px; font-weight: 600; text-decoration: underline;">
        Click here to leave a brief review
      </a>
    </div>

    <p style="font-size: 13px; color: #94a3b8;">
      We look forward to curating your next journey.
    </p>
  `

  return {
    subject: `How Was Your Drive? — Points Credited for Reservation ${reference}`,
    html: renderBaseEmailLayout({
      title: `Trip Completed: ${reference}`,
      preheader: `Thank you for riding with DriveIt. You earned +${pointsEarned} loyalty points!`,
      contentHtml,
      actionButton: {
        label: 'Leave a 5-Star Review',
        url: feedbackUrl,
      },
      secondaryButton: {
        label: 'Book Your Next Ride',
        url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://driveitluxury.in',
      },
    }),
  }
}
