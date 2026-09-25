import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { auth } from '@/auth'
import config from '@/payload.config'
import { findCustomerByEmail } from '@/lib/customers'
import { limitRequest, tooManyRequests } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

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

    const payload = await getPayload({ config })
    const customer = await findCustomerByEmail(payload, session.user.email)

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found.' }, { status: 404 })
    }

    // Convert file to buffer for Payload media creation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

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
    if (dlNumber) updateData.drivingLicenseNumber = dlNumber
    if (aadhaarLast4) updateData.aadhaarLast4 = aadhaarLast4

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
