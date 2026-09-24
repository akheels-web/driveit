/**
 * Cloudinary storage for the Media collection.
 *
 * Design notes (why it looks like this):
 *
 *  • It builds on Payload's **official** `@payloadcms/plugin-cloud-storage`, so
 *    the wiring for uploads, deletes, `url` fields and image sizes stays in
 *    Payload's hands. We only supply the four adapter actions it asks for.
 *  • Uploads go to Cloudinary and the document's `url` (and each size's `url`)
 *    is the Cloudinary CDN URL — the database stores links, not binary files.
 *  • Payload still runs `sharp` and produces the derived sizes, but we do *not*
 *    upload them: Cloudinary derives every size from the original with a
 *    transformation, so the same photo is stored once and delivered at whatever
 *    size each placement needs. That is both cheaper and faster than N uploads.
 *  • `public_id` is deterministic (`<folder>/<filename-without-extension>`), so a
 *    URL can be rebuilt from the filename alone. Payload already guarantees
 *    unique filenames per collection (it checks the database), so this cannot
 *    silently overwrite someone else's photo. The upload response's `public_id`,
 *    `resource_type`, `format` and `version` are stored on the document for
 *    exactness — including cache-busting when a file is replaced.
 *  • Nothing here runs unless all three credentials are present. Without them
 *    the plugin is disabled and Media falls back to local disk, which is what
 *    development and `next build` use.
 */
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import type { FileData, TypeWithID } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

const DEFAULT_FOLDER = 'driveit'

export type CloudinarySettings = {
  cloudName: string
  apiKey: string
  apiSecret: string
  folder: string
}

/**
 * Reads the credentials, or returns null when the feature is not configured.
 *
 * Deliberately returns null rather than throwing: the app must still build and
 * run without Cloudinary (local disk). `requireSettings()` is what throws, and
 * it is only reachable on the Cloudinary code path.
 */
export function cloudinarySettings(): CloudinarySettings | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  // All three are needed to sign an upload; a partial set is a misconfiguration.
  if (!cloudName || !apiKey || !apiSecret) return null

  const folder = (process.env.CLOUDINARY_FOLDER?.trim() || DEFAULT_FOLDER).replace(/^\/+|\/+$/g, '')

  return { cloudName, apiKey, apiSecret, folder }
}

export function isCloudinaryConfigured(): boolean {
  return cloudinarySettings() !== null
}

function requireSettings(): CloudinarySettings {
  const settings = cloudinarySettings()
  if (!settings) {
    throw new Error(
      '[cloudinary] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must all be set.',
    )
  }
  return settings
}

/** The SDK keeps global config; set it once per process. */
let sdkConfigured = false

function sdk(settings: CloudinarySettings) {
  if (!sdkConfigured) {
    cloudinary.config({
      cloud_name: settings.cloudName,
      api_key: settings.apiKey,
      api_secret: settings.apiSecret,
      secure: true,
      // The SDK otherwise appends an `?_a=` analytics token to every URL it
      // builds. These URLs are rendered into cached pages, so they must be
      // stable and clean rather than carry a per-process token.
      analytics: false,
    })
    sdkConfigured = true
  }
  return cloudinary
}

/** `photo-400x300.jpg` → `{ width: 400, height: 300 }`. Payload's size naming. */
export function sizeFromFilename(filename: string): { width: number; height: number } | null {
  const match = /-(\d+)x(\d+)(?=\.[a-z0-9]+$)/i.exec(filename)
  if (!match) return null

  const width = Number(match[1])
  const height = Number(match[2])
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null

  return { width, height }
}

/** The deterministic Cloudinary public id for an upload. */
export function publicIdFor(filename: string, folder: string): string {
  const base = path.basename(filename, path.extname(filename))
  return `${folder}/${base}`
}

type MediaDoc = Record<string, any> | null | undefined

/** Formats Cloudinary serves without an extension; everything else needs one. */
const EXTENSIONLESS_FORMATS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp', 'ico'])

/**
 * Builds the delivery URL for a document (or for one of its sizes).
 *
 * `filename` is what Payload asked for — the original or a size file — and the
 * document carries the exact Cloudinary identifiers. If the metadata write ever
 * did not land, we fall back to the deterministic public id.
 */
export function deliveryUrl(args: {
  settings: CloudinarySettings
  data: MediaDoc
  filename: string
  transformation?: Record<string, unknown>
}): string {
  const { settings, data, filename, transformation } = args

  const publicId =
    (typeof data?.cloudinaryPublicId === 'string' && data.cloudinaryPublicId) ||
    publicIdFor(filename, settings.folder)

  const resourceType =
    (typeof data?.cloudinaryResourceType === 'string' && data.cloudinaryResourceType) || 'image'

  const format = typeof data?.cloudinaryFormat === 'string' ? data.cloudinaryFormat : undefined
  const version = Number(data?.cloudinaryVersion)

  return sdk(settings).url(publicId, {
    secure: true,
    resource_type: resourceType,
    // A size is delivered as a derived transformation of the original.
    ...(transformation ? { transformation } : {}),
    // Payload's sized filenames differ from the original; the asset does not.
    ...(format && !EXTENSIONLESS_FORMATS.has(format.toLowerCase()) ? { format } : {}),
    // The exact uploaded version when we know it (cache-busting on replace).
    // Without it the SDK emits `v1`, which Cloudinary documents as "the asset's
    // original version" and still serves the current upload — only reachable if
    // the metadata write did not land.
    ...(Number.isFinite(version) && version > 0 ? { version } : {}),
  })
}

export type UploadedAsset = {
  public_id: string
  resource_type: string
  format?: string
  version?: number
  bytes?: number
  secure_url?: string
}

/** Uploads a buffer to Cloudinary and resolves with the API's response. */
export async function uploadBuffer(
  buffer: Buffer,
  options: { publicId: string; mimeType?: string },
): Promise<UploadedAsset> {
  const settings = requireSettings()

  return new Promise<UploadedAsset>((resolve, reject) => {
    const stream = sdk(settings).uploader.upload_stream(
      {
        public_id: options.publicId,
        resource_type: 'auto',
        overwrite: true,
        invalidate: true,
        // Keep the original bytes: our own sharp pipeline already made the
        // sizes, and re-encoding here would double-compress every upload.
        transformation: undefined,
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(`[cloudinary] upload failed: ${error?.message ?? 'no result'}`))
          return
        }
        resolve(result as unknown as UploadedAsset)
      },
    )

    stream.end(buffer)
  })
}

/** Removes an asset (and every derived transformation of it) from Cloudinary. */
export async function destroyAsset(publicId: string, resourceType = 'image'): Promise<void> {
  const settings = requireSettings()
  await sdk(settings).uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  })
}

/**
 * The adapter Handed to `cloudStoragePlugin`.
 *
 * Every action resolves credentials at call time, never at config time, so the
 * same config works with or without Cloudinary configured.
 */
export function cloudinaryAdapter(): Adapter {
  return () => ({
    name: 'cloudinary',

    /**
     * Exact identifiers, written back onto the document by the plugin right
     * after `handleUpload` returns them. Hidden from the admin UI — they are
     * implementation detail, not content.
     */
    fields: [
      { name: 'cloudinaryPublicId', type: 'text', admin: { hidden: true, readOnly: true } },
      { name: 'cloudinaryResourceType', type: 'text', admin: { hidden: true, readOnly: true } },
      { name: 'cloudinaryFormat', type: 'text', admin: { hidden: true, readOnly: true } },
      { name: 'cloudinaryVersion', type: 'number', admin: { hidden: true, readOnly: true } },
    ],

    // Only called when `disablePayloadAccessControl` is on, i.e. Cloudinary mode.
    generateURL: ({ data, filename }) => {
      const settings = requireSettings()
      const data_ = data as MediaDoc
      const size = sizeFromFilename(filename)

      // A derived size becomes a Cloudinary transformation of the original.
      const isSizeFile = Boolean(
        size &&
          data_?.sizes &&
          Object.values(data_.sizes as Record<string, any>).some(
            (entry) => entry?.filename && entry.filename === filename,
          ),
      )

      return deliveryUrl({
        settings,
        data: data_,
        filename,
        transformation:
          isSizeFile && size ? { width: size.width, height: size.height, crop: 'fill' } : undefined,
      })
    },

    handleUpload: async ({ data, file }): Promise<Partial<FileData & TypeWithID>> => {
      const settings = requireSettings()

      // Payload runs sharp and computes every image size, then calls us once per
      // resulting file. We want the original only — Cloudinary derives the rest.
      // An empty object means "no extra metadata", which the plugin ignores.
      const isDerivedSize = Object.values((data?.sizes ?? {}) as Record<string, any>).some(
        (entry) => entry?.filename && entry.filename === file.filename,
      )
      if (isDerivedSize) return {}

      const asset = await uploadBuffer(file.buffer, {
        publicId: publicIdFor(file.filename, settings.folder),
        mimeType: file.mimeType,
      })

      // Payload merges whatever this returns into the document. Its type only
      // declares FileData/TypeWithID keys, so the cast covers the four fields we
      // declared above — the same pattern the official adapters use.
      return {
        cloudinaryPublicId: asset.public_id,
        cloudinaryResourceType: asset.resource_type,
        cloudinaryFormat: asset.format,
        cloudinaryVersion: asset.version,
      } as unknown as Partial<FileData & TypeWithID>
    },

    handleDelete: async ({ doc }) => {
      const record = doc as MediaDoc
      const publicId =
        typeof record?.cloudinaryPublicId === 'string' && record.cloudinaryPublicId
          ? record.cloudinaryPublicId
          : typeof record?.filename === 'string'
            ? publicIdFor(record.filename, requireSettings().folder)
            : null

      if (!publicId) return

      const resourceType =
        typeof record?.cloudinaryResourceType === 'string' && record.cloudinaryResourceType
          ? record.cloudinaryResourceType
          : 'image'

      await destroyAsset(publicId, resourceType)
    },

    /**
     * Only reachable if access control over file URLs is re-enabled; with
     * Cloudinary the file route is bypassed entirely and this just points at the
     * CDN instead of proxying bytes through the app server.
     */
    staticHandler: (_req, { params }) => {
      const settings = requireSettings()
      return Response.redirect(
        deliveryUrl({ settings, data: null, filename: params.filename }),
        302,
      )
    },
  })
}
