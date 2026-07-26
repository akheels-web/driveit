import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'carName', 'totalPrice', 'serviceType', 'status', 'createdAt'],
    description: '📋 Customer Reservations: Live car bookings placed by customers on /checkout appear here automatically. You can review customer details, track payment statuses, and mark bookings as Confirmed or Completed.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        // Loyalty Logic: When a booking is marked as 'completed'
        if (operation === 'update' && doc.status === 'completed' && previousDoc.status !== 'completed') {
          try {
            // Count how many completed bookings this user has
            const { totalDocs } = await req.payload.find({
              collection: 'bookings',
              where: {
                customerEmail: { equals: doc.customerEmail },
                status: { equals: 'completed' },
              },
              limit: 1, // We just need the count, but Payload returns totalDocs
            });

            // If this is their 5th, 10th, 15th, etc. booking
            if (totalDocs > 0 && totalDocs % 5 === 0) {
              const code = `VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
              
              // Create the coupon
              await req.payload.create({
                collection: 'coupons',
                data: {
                  code,
                  discountType: 'percentage',
                  discountValue: 20, // 20% off for loyalty
                  usageLimit: 1,
                  isActive: true,
                  customerEmail: doc.customerEmail,
                },
              });

              // Send the email with the coupon
              await req.payload.sendEmail({
                to: doc.customerEmail,
                subject: 'Your Exclusive DriveIt Concierge Reward! 🎉',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #c99339;">Thank you for your loyalty!</h2>
                    <p>Dear ${doc.customerName},</p>
                    <p>You have just completed your ${totalDocs}th booking with DriveIt Luxury Concierge. As a token of our appreciation, we are thrilled to offer you a 20% discount on your next reservation.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                      <p style="font-size: 14px; margin-bottom: 5px;">Your VIP Promo Code:</p>
                      <h1 style="margin: 0; color: #000; letter-spacing: 2px;">${code}</h1>
                    </div>
                    <p>We look forward to serving you again soon.</p>
                    <p>Best regards,<br><strong>DriveIt Luxury Concierge Team</strong></p>
                  </div>
                `,
              });
              
              req.payload.logger.info(`Loyalty coupon ${code} generated and emailed to ${doc.customerEmail}`);
            }
          } catch (error) {
            req.payload.logger.error(`Error in loyalty coupon hook: ${error}`);
          }
        }
        return doc;
      }
    ],
  },
  fields: [
    { name: 'customerName', type: 'text', required: true, label: 'Customer Full Name' },
    { name: 'customerEmail', type: 'text', required: true, label: 'Customer Email' },
    { name: 'customerPhone', type: 'text', required: true, label: 'Customer Phone Number' },
    { name: 'carName', type: 'text', required: true, label: 'Car Rented' },
    { name: 'carSlug', type: 'text', label: 'Car Slug' },
    { name: 'pickupLocation', type: 'text', label: 'Pickup Location Address' },
    { name: 'dropoffLocation', type: 'text', label: 'Dropoff Location Address' },
    { name: 'totalPrice', type: 'number', required: true, label: 'Total Booking Amount (₹)' },
    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'chauffeur',
      options: [
        { label: 'Chauffeur Driven', value: 'chauffeur' },
        { label: 'Self Drive', value: 'selfdrive' },
        { label: 'Airport Transfer', value: 'airport' },
      ],
      label: 'Service Type',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'confirmed',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed / Closed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Booking Status',
    },
    { name: 'startDate', type: 'date', label: 'Booking Start Date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'endDate', type: 'date', label: 'Booking End Date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'couponCode', type: 'text', label: 'Applied Coupon Code' },
    { name: 'discountApplied', type: 'number', label: 'Discount Applied (₹)', defaultValue: 0 },
    { name: 'holdExpiresAt', type: 'date', label: 'Hold Expiration Time', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'If a user is checking out, this locks the car for 10 minutes to prevent double-booking.' } },
    { name: 'whatsappNumber', type: 'text', label: 'WhatsApp Number' },
  ],
}
