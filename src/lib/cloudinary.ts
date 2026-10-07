import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import path from 'path'

/**
 * Payload storage adapter for Cloudinary (there is no official one).
 *
 * Files keep their Payload filename; Cloudinary public IDs are `<folder>/<name-without-extension>`,
 * so a URL can always be derived from a filename alone — no extra DB columns needed.
 * Images are served with f_auto,q_auto (WebP/AVIF + smart compression from the CDN).
 */

export const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
)

const FOLDER = (process.env.CLOUDINARY_FOLDER || 'himalayan-crown').replace(/\/+$/, '')
const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v'])

let configured = false
function client() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      analytics: false,
      secure: true,
    })
    configured = true
  }
  return cloudinary
}

const parts = (filename: string, prefix?: string) => {
  const ext = path.extname(filename).slice(1).toLowerCase()
  const base = path.basename(filename, path.extname(filename))
  const folder = [FOLDER, prefix].filter(Boolean).join('/')
  return {
    ext,
    folder,
    publicId: `${folder}/${base}`,
    resourceType: (VIDEO_EXT.has(ext) ? 'video' : 'image') as 'video' | 'image',
  }
}

export function cloudinaryUrl(filename: string, prefix?: string) {
  const { ext, publicId, resourceType } = parts(filename, prefix)
  return client().url(publicId, {
    resource_type: resourceType,
    format: ext,
    secure: true,
    transformation: resourceType === 'image' ? [{ fetch_format: 'auto', quality: 'auto' }] : [{ quality: 'auto' }],
  })
}

/** Uploads a buffer under the deterministic public ID for `filename`. Also used by the migration script. */
export function uploadToCloudinary(buffer: Buffer, filename: string, prefix?: string): Promise<UploadApiResponse> {
  const { publicId, resourceType } = parts(filename, prefix)
  return new Promise((resolve, reject) => {
    const stream = client().uploader.upload_stream(
      { public_id: publicId, resource_type: resourceType, overwrite: true, invalidate: true },
      (error, result) => (error || !result ? reject(error ?? new Error('Empty Cloudinary response')) : resolve(result)),
    )
    stream.end(buffer)
  })
}

export const cloudinaryAdapter: Adapter = ({ prefix }) => ({
  name: 'cloudinary',

  async handleUpload({ file, data }) {
    const filePrefix = (data?.prefix as string | undefined) ?? prefix
    const buffer = file.buffer?.length ? file.buffer : await import('fs/promises').then((fs) => fs.readFile(file.tempFilePath!))
    await uploadToCloudinary(buffer, file.filename, filePrefix)
  },

  async handleDelete({ filename, doc }) {
    const { publicId, resourceType } = parts(filename, doc.prefix ?? prefix)
    await client().uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })
  },

  generateURL: ({ filename, prefix: filePrefix }) => cloudinaryUrl(filename, filePrefix ?? prefix),

  // Requests to /api/media/file/<name> (e.g. old links) are redirected to the CDN.
  staticHandler: (_req, { params }) => Response.redirect(cloudinaryUrl(params.filename, params.prefix ?? prefix), 302),
})
