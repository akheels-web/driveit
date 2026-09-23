import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer'

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37', // Gold
    paddingBottom: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  brandSub: {
    fontSize: 10,
    color: '#d4af37',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 28,
    color: '#333333',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#555555',
  },
  value: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 9,
    color: '#888888',
  }
})

/** Payload uses numeric ids, so the invoice number is derived from the booking id. */
export function bookingReference(id: unknown): string {
  return `DRV-${String(id ?? '').padStart(5, '0')}`
}

// React-PDF Component
const InvoicePDF = ({ booking }: { booking: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>DRIVEIT</Text>
          <Text style={styles.brandSub}>LUXURY CONCIERGE</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={{ fontSize: 10, color: '#888', textAlign: 'right', marginTop: 8 }}>
            #{bookingReference(booking.id)}
          </Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billed To</Text>
        <Text style={styles.value}>{booking.customerName}</Text>
        <Text style={styles.label}>{booking.customerEmail}</Text>
        <Text style={styles.label}>{booking.customerPhone}</Text>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle</Text>
          <Text style={styles.value}>{booking.carName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Type</Text>
          <Text style={styles.value}>{booking.serviceType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{formatDate(booking.startDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{formatDate(booking.endDate)}</Text>
        </View>
        {Number(booking.days) > 0 ? (
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>
              {Number(booking.days)} {Number(booking.days) === 1 ? 'day' : 'days'}
            </Text>
          </View>
        ) : null}
        {booking.couponCode ? (
          <View style={styles.row}>
            <Text style={styles.label}>Coupon</Text>
            <Text style={styles.value}>{String(booking.couponCode)}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Pickup Location</Text>
          <Text style={styles.value}>{booking.pickupLocation}</Text>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Reference</Text>
          <Text style={styles.value}>{bookingReference(booking.id)}</Text>
        </View>
        {Number(booking.discountApplied) > 0 ? (
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>- Rs. {Number(booking.discountApplied).toLocaleString('en-IN')}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{String(booking.status || 'confirmed').toUpperCase()}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount Paid</Text>
          <Text style={styles.totalValue}>
            Rs. {Number(booking.totalPrice || 0).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for choosing DriveIt Luxury Concierge.</Text>
        <Text style={styles.footerText}>This is a computer-generated invoice and does not require a physical signature.</Text>
      </View>

    </Page>
  </Document>
)

function formatDate(value: unknown): string {
  if (!value) return '—'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN')
}

export async function generateInvoicePDFStream(booking: any) {
  return await renderToStream(<InvoicePDF booking={booking} />)
}

export async function generateInvoicePDFBuffer(booking: any): Promise<Buffer> {
  const stream = await renderToStream(<InvoicePDF booking={booking} />)
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', err => reject(err))
  })
}
