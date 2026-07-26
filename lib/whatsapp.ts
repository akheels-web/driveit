export async function sendWhatsAppConfirmation(booking: any) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn('WhatsApp API credentials not found. Skipping WhatsApp notification.')
    return false
  }

  // Ensure the number is formatted correctly (e.g. must include country code without + or 00)
  let toPhone = booking.whatsappNumber || booking.customerPhone
  toPhone = toPhone.replace(/\D/g, '') // strip non-numeric
  if (toPhone.length === 10) {
    toPhone = `91${toPhone}` // Default to India if 10 digits
  }

  const messageData = {
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'template',
    template: {
      name: 'booking_confirmation_luxury', // You must create and approve this template in Meta Business Manager
      language: {
        code: 'en_US'
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: booking.customerName },
            { type: 'text', text: booking.carName },
            { type: 'text', text: new Date(booking.startDate).toLocaleDateString() },
            { type: 'text', text: booking.pickupLocation }
          ]
        }
      ]
    }
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    })

    const result = await response.json()
    if (result.error) {
      console.error('WhatsApp API Error:', result.error)
      return false
    }
    
    console.log(`WhatsApp confirmation sent to ${toPhone}`)
    return true
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
    return false
  }
}
