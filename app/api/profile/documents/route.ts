import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { auth } from '@/auth'
import config from '@/payload.config'
import { isPostgresReachable } from '@/lib/db'
import { sanitizeText } from '@/lib/html'
import { upsertCustomer } from '@/lib/customers'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

function matchesMagicBytes(buf: Buffer, ext: string): boolean {
  if (buf.length < 12) return false
  switch (ext) {
    case 'jpg':
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
    case 'png':
      return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
    case 'webp':
      return buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP'
    case 'pdf':
      return buf.subarray(0, 5).toString('ascii') === '%PDF-'
    default:
      return false
  }
}

export async function POST(request: Request) {
  const verdict = await limitRequest(request, 'profile-docs-upload', {
    limit: 10,
    windowMs: 60_000,
    globalLimit: 200,
  })
  if (!verdict.ok) return tooManyRequests(verdict.retryAfterSeconds)

  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const docType = formData.get('docType') as string // 'dl_front' | 'dl_back' | 'id_proof'
    const file = formData.get('file') as File | null
    const dlNumber = formData.get('dlNumber') as string | null
    const aadhaarLast4 = formData.get('aadhaarLast4') as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Please select a valid image file.' }, { status: 400 })
    }

    // Validate size (max 8MB) and type
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 8MB.' }, { status: 400 })
    }

    const MIME_TO_EXT: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    }
    const safeExt = MIME_TO_EXT[file.type]
    if (!safeExt) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP or PDF files are accepted.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    if (!matchesMagicBytes(buffer, safeExt)) {
      return NextResponse.json(
        { error: 'File contents do not match the declared document format.' },
        { status: 400 },
      )
    }

    if (!(await isPostgresReachable())) {
      return NextResponse.json(
        { error: 'Document vault is temporarily offline. Please try again shortly or share via WhatsApp Concierge.' },
        { status: 503 },
      )
    }

    const payload = await getPayload({ config })
    const customer = await upsertCustomer(payload, {
      email: session.user.email,
      name: session.user.name ?? null,
    })

    if (!customer) {
      return NextResponse.json({ error: 'Could not create or find customer profile.' }, { status: 500 })
    }

    const safeDocType = ['dl_front', 'dl_back', 'id_proof'].includes(docType) ? docType : 'id_proof'

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `KYC Document - ${customer.id} - ${safeDocType}`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: `kyc_${customer.id}_${safeDocType}_${Date.now()}.${safeExt}`,
        size: file.size,
      },
      overrideAccess: true,
    })

    const updateData: Record<string, any> = {
      kycStatus: 'pending',
    }

    if (docType === 'dl_front') updateData.drivingLicenseFront = mediaDoc.id
    if (docType === 'dl_back') updateData.drivingLicenseBack = mediaDoc.id
    if (docType === 'id_proof') updateData.idProofDocument = mediaDoc.id

    const cleanDl = dlNumber ? sanitizeText(dlNumber, 30) : ''
    if (cleanDl && /^[A-Za-z0-9\-\s]{4,30}$/.test(cleanDl)) {
      updateData.drivingLicenseNumber = cleanDl.toUpperCase()
    }
    const cleanAadhaar = aadhaarLast4 ? sanitizeText(aadhaarLast4, 4) : ''
    if (cleanAadhaar && /^\d{4}$/.test(cleanAadhaar)) {
      updateData.aadhaarLast4 = cleanAadhaar
    }

    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: updateData,
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully. Our concierge will verify it within 2 hours.',
      kycStatus: 'pending',
      mediaId: mediaDoc.id,
    })
  } catch (error) {
    console.error('[profile/documents] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
