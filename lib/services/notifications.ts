// lib/services/notifications.ts

export class NotificationService {
  /**
   * Dispatches all booking notifications asynchronously.
   * This handles Email, SMS, and WhatsApp sending.
   */
  static async sendBookingConfirmation(bookingRef: string, data: any) {
    // We execute these concurrently and catch errors so they don't crash the main process
    Promise.allSettled([
      this.sendEmail(bookingRef, data),
      this.sendSMS(bookingRef, data),
      this.sendWhatsApp(bookingRef, data)
    ]).then(results => {
      // Log failed notification channels for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Notification channel ${index} failed:`, result.reason);
        }
      });
    });
  }

  private static async sendEmail(bookingRef: string, data: any) {
    if (!data.customerEmail) return;
    
    // TODO: Integrate actual Email Provider (e.g., Resend, SendGrid)
    // Stub implementation:
    console.log(`[Email Stub] Sending confirmation to ${data.customerEmail} for booking ${bookingRef}`);
    console.log(`[Email Stub] Content: Dear ${data.customerName}, your DRIVEIT booking for ${data.carName} is confirmed!`);
  }

  private static async sendSMS(bookingRef: string, data: any) {
    if (!data.customerPhone) return;

    // TODO: Integrate actual SMS Provider (e.g., Twilio, Msg91)
    // Stub implementation:
    console.log(`[SMS Stub] Sending text to ${data.customerPhone}`);
    console.log(`[SMS Stub] Content: DRIVEIT: Booking ${bookingRef} confirmed. Car: ${data.carName}. Date: ${data.bookingDate}`);
  }

  private static async sendWhatsApp(bookingRef: string, data: any) {
    if (!data.customerPhone) return;
    const wacrmUrl = process.env.WACRM_WEBHOOK_URL;
    const wacrmSecret = process.env.WACRM_WEBHOOK_SECRET;

    if (!wacrmUrl) {
      console.log(`[WhatsApp Stub] No WACRM_WEBHOOK_URL found. Would send ticket to ${data.customerPhone}`);
      return;
    }

    try {
      await fetch(wacrmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(wacrmSecret ? { 'X-Webhook-Secret': wacrmSecret } : {}),
        },
        body: JSON.stringify({
          event: 'booking.ticket_generated',
          data: {
            booking_ref: bookingRef,
            car_name: data.carName,
            service_type: data.serviceType,
            customer_name: data.customerName,
            customer_phone: data.customerPhone,
            pickup_location: data.pickupLocation,
            booking_date: data.bookingDate,
            booking_time: data.bookingTime,
            total_amount: data.totalAmount,
            ticket_url: `https://driveit.in/dashboard/invoices/${bookingRef}` // Mock URL to view invoice/ticket
          },
        }),
      });
    } catch (e) {
      throw new Error(`WhatsApp API failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}
