'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Smartphone, QrCode, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import QRCode from 'qrcode'

interface UpiPaymentProps {
  amount: number
  bookingRef: string
  payeeName?: string
  onPaymentConfirmed: (transactionId: string) => void
  onPayLater: () => void
}

export function UpiPayment({ amount, bookingRef, payeeName, onPaymentConfirmed, onPayLater }: UpiPaymentProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [txnId, setTxnId] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'YOUR_UPI_ID@upi'
  const upiName = payeeName || process.env.NEXT_PUBLIC_UPI_NAME || 'DRIVEIT Luxury'
  const txNote = `DRIVEIT Booking ${bookingRef}`
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(txNote)}&tr=${bookingRef}`

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 220,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [upiUrl])

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Amount Display */}
      <div className="text-center py-4 rounded-xl bg-white/[0.02] border border-white/5">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Amount to Pay</p>
        <p className="text-3xl font-bold text-gradient-gold">₹{amount.toLocaleString('en-IN')}</p>
        <p className="text-xs text-white/30 mt-1">Ref: {bookingRef}</p>
      </div>

      {/* QR Code for Desktop */}
      <div className="text-center">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Scan with any UPI app</p>
        <div className="inline-block p-3 bg-white rounded-xl">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="UPI QR Code" className="w-[200px] h-[200px]" />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-white">
              <QrCode className="w-10 h-10 text-gray-300 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* UPI ID Copy */}
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/5">
        <span className="text-sm text-white/60">UPI ID:</span>
        <span className="text-sm text-white font-mono">{upiId}</span>
        <button
          onClick={copyUpiId}
          className="ml-1 text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors cursor-pointer"
        >
          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Pay with UPI App Buttons (mobile) */}
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider text-center">Or pay directly</p>
        <a
          href={upiUrl}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-semibold text-black cursor-pointer transition-all duration-300 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
          }}
        >
          <Smartphone className="w-4 h-4" />
          Pay ₹{amount.toLocaleString('en-IN')} with UPI App
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-[10px] text-white/20 text-center">
          Opens Google Pay, PhonePe, Paytm, or any installed UPI app
        </p>
      </div>

      {/* Confirmation section */}
      <div className="border-t border-white/5 pt-5">
        <AnimatePresence mode="wait">
          {!showConfirm ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 rounded-xl text-sm font-medium text-[var(--gold-400)] border border-[var(--gold-400)]/30 bg-[var(--gold-400)]/5 hover:bg-[var(--gold-400)]/10 transition-colors cursor-pointer"
              >
                ✓ I have completed the payment
              </button>
              <button
                onClick={onPayLater}
                className="w-full py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors cursor-pointer"
              >
                Pay Later at Pickup →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-xs text-white/50">Enter your UPI transaction ID for verification:</p>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="e.g. 4251234567890"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => txnId.trim() && onPaymentConfirmed(txnId.trim())}
                  disabled={!txnId.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: txnId.trim() ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400))' : 'rgba(255,255,255,0.05)',
                    color: txnId.trim() ? 'black' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
