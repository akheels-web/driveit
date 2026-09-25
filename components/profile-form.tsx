'use client'

import { useState } from 'react'
import {
  Mail,
  Phone,
  Save,
  User,
  Building2,
  Receipt,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Upload,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react'

import type { CustomerProfile } from '@/lib/types'

export function ProfileForm({ email, initial }: { email: string; initial: CustomerProfile | null }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    homeAddress: initial?.homeAddress ?? '',
    officeAddress: initial?.officeAddress ?? '',
    airportAddress: initial?.airportAddress ?? '',
    companyName: initial?.companyName ?? '',
    gstin: initial?.gstin ?? '',
    drivingLicenseNumber: initial?.drivingLicenseNumber ?? '',
    aadhaarLast4: initial?.aadhaarLast4 ?? '',
  })

  const [kycStatus, setKycStatus] = useState<string>(initial?.kycStatus ?? 'unverified')
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const update = (field: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }))

  async function save() {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile changes saved successfully! Your details will be pre-filled on your next reservation.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Could not save profile details. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network connection error. Please verify your internet and try again.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 6000)
    }
  }

  async function handleFileUpload(docType: 'dl_front' | 'dl_back' | 'id_proof', file: File) {
    setUploadingDoc(docType)
    setUploadMsg(null)

    try {
      const formData = new FormData()
      formData.append('docType', docType)
      formData.append('file', file)
      if (form.drivingLicenseNumber) formData.append('dlNumber', form.drivingLicenseNumber)
      if (form.aadhaarLast4) formData.append('aadhaarLast4', form.aadhaarLast4)

      const response = await fetch('/api/profile/documents', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        setUploadMsg({ type: 'success', text: data.message || 'Document uploaded successfully.' })
        setKycStatus('pending')
      } else {
        setUploadMsg({ type: 'error', text: data.error || 'Upload failed. Please try again.' })
      }
    } catch {
      setUploadMsg({ type: 'error', text: 'Network error during upload.' })
    } finally {
      setUploadingDoc(null)
      setTimeout(() => setUploadMsg(null), 5000)
    }
  }

  const addressFields: { key: 'homeAddress' | 'officeAddress' | 'airportAddress'; label: string; placeholder: string }[] = [
    { key: 'homeAddress', label: 'Home address', placeholder: 'e.g. Flat 201, Jubilee Hills, Hyderabad' },
    { key: 'officeAddress', label: 'Office address', placeholder: 'e.g. Tech Park, Madhapur, Hyderabad' },
    { key: 'airportAddress', label: 'Airport preference', placeholder: 'e.g. RGIA Shamshabad (Terminal 1)' },
  ]

  return (
    <div className="space-y-6">
      {/* 1. VIP Document Vault & KYC Status */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,22,1), rgba(12,12,14,1))',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center text-[var(--gold-400)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">VIP Document Vault</h3>
              <p className="text-[11px] text-white/50">Mandatory for self-drive sports & luxury car bookings</p>
            </div>
          </div>

          <div>
            {kycStatus === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck2 className="w-3.5 h-3.5" /> Verified VIP
              </span>
            )}
            {kycStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" /> Under Review
              </span>
            )}
            {kycStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Re-upload Needed
              </span>
            )}
            {kycStatus === 'unverified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                Unverified
              </span>
            )}
          </div>
        </div>

        {kycStatus === 'verified' ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>
              Your Driving License is verified. Enjoy a <strong>60-second express key handover</strong> with zero paperwork at pickup.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-white/60 leading-relaxed">
              Upload your documents once. Once verified by our concierge, you can book any self-drive vehicle instantly without re-uploading.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                  Driving License Number
                </label>
                <input
                  value={form.drivingLicenseNumber}
                  placeholder="e.g. TS09 20210001234"
                  onChange={(e) => update('drivingLicenseNumber', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                  Aadhaar (Last 4 digits) / Passport
                </label>
                <input
                  value={form.aadhaarLast4}
                  placeholder="e.g. 8492 or Passport No."
                  onChange={(e) => update('aadhaarLast4', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* DL Front */}
              <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition text-center group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('dl_front', e.target.files[0])
                  }}
                  disabled={uploadingDoc !== null}
                />
                <Upload className="w-4 h-4 text-white/40 group-hover:text-[var(--gold-400)] mb-1 transition" />
                <span className="text-[11px] font-medium text-white/80">DL Front Photo</span>
                <span className="text-[9px] text-white/40 mt-0.5">
                  {uploadingDoc === 'dl_front' ? 'Uploading…' : 'Tap to select'}
                </span>
              </label>

              {/* DL Back */}
              <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition text-center group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('dl_back', e.target.files[0])
                  }}
                  disabled={uploadingDoc !== null}
                />
                <Upload className="w-4 h-4 text-white/40 group-hover:text-[var(--gold-400)] mb-1 transition" />
                <span className="text-[11px] font-medium text-white/80">DL Back Photo</span>
                <span className="text-[9px] text-white/40 mt-0.5">
                  {uploadingDoc === 'dl_back' ? 'Uploading…' : 'Tap to select'}
                </span>
              </label>

              {/* ID Proof */}
              <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition text-center group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('id_proof', e.target.files[0])
                  }}
                  disabled={uploadingDoc !== null}
                />
                <Upload className="w-4 h-4 text-white/40 group-hover:text-[var(--gold-400)] mb-1 transition" />
                <span className="text-[11px] font-medium text-white/80">Aadhaar / Passport</span>
                <span className="text-[9px] text-white/40 mt-0.5">
                  {uploadingDoc === 'id_proof' ? 'Uploading…' : 'Tap to select'}
                </span>
              </label>
            </div>

            {uploadMsg && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                  uploadMsg.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {uploadMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-medium">{uploadMsg.text}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Personal & Corporate Billing Profile */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(13,13,13,1))',
          border: '1px solid rgba(212, 175, 55, 0.1)',
        }}
      >
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/90">Contact details</h3>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Full name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                value={email}
                disabled
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white/40 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1">Email is managed by your Google sign-in.</p>
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Corporate Invoicing */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white/90">Corporate & GST Billing</h3>
              <p className="text-[11px] text-white/40 mt-0.5">
                Automatically included on your PDF tax invoices for business expense claims.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    value={form.companyName}
                    placeholder="e.g. Acme Tech Pvt Ltd"
                    onChange={(event) => update('companyName', event.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                  GSTIN (Tax ID)
                </label>
                <div className="relative">
                  <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    value={form.gstin}
                    placeholder="e.g. 36AABCU9603R1ZM"
                    onChange={(event) => update('gstin', event.target.value.toUpperCase())}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/40 focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Saved addresses</h3>
            {addressFields.map((field) => (
              <div key={field.key}>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                  {field.label}
                </label>
                <input
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
                message.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {message.type === 'success' ? 'Profile Updated' : 'Action Failed'}
                </p>
                <p className="mt-0.5 text-white/80">{message.text}</p>
              </div>
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-black disabled:opacity-50 transition cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' }}
          >
            {saving ? 'Saving…' : (
              <>
                <Save className="w-4 h-4" /> Save all changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
