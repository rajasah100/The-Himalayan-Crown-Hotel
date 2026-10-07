import type { UploadField } from 'payload'

/** Upload field restricted to MP4/WebM files in the media library. */
export const videoField = (name: string, description?: string): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { in: ['video/mp4', 'video/webm'] } },
  admin: { description: description ?? 'Optional MP4/WebM. Shown muted on loop; the image is used as its poster.' },
})
