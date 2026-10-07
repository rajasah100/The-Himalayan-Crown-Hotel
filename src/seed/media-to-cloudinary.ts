/**
 * One-time migration: uploads every file in ./media (originals and generated sizes) to Cloudinary
 * under the same public IDs the storage adapter uses. Database rows need no changes, because
 * URLs are derived from filenames.
 *
 *   pnpm media:cloudinary
 */
import { readdir, readFile } from 'fs/promises'
import path from 'path'

import { cloudinaryEnabled, cloudinaryUrl, uploadToCloudinary } from '../lib/cloudinary'

if (!cloudinaryEnabled) {
  console.error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env first.')
  process.exit(1)
}

const dir = path.resolve(process.cwd(), 'media')
const files = (await readdir(dir)).filter((f) => !f.startsWith('.'))
console.log(`Uploading ${files.length} files from ${dir}…`)

let done = 0
let failed = 0
// Small batches keep us well inside Cloudinary's rate limits.
for (let i = 0; i < files.length; i += 4) {
  await Promise.all(
    files.slice(i, i + 4).map(async (file) => {
      try {
        await uploadToCloudinary(await readFile(path.join(dir, file)), file)
        done++
      } catch (error) {
        failed++
        console.error(`  ✗ ${file}: ${(error as Error).message}`)
      }
    }),
  )
  process.stdout.write(`\r  ${done + failed}/${files.length}`)
}

console.log(`\nDone: ${done} uploaded, ${failed} failed.`)
if (files[0]) console.log(`Example URL: ${cloudinaryUrl(files[0])}`)
process.exit(failed ? 1 : 0)
