/**
 * Seed-time media pipeline: downloads free Mixkit clips (Mixkit License — free for commercial use,
 * no attribution), re-encodes them for the web with ffmpeg and grabs poster frames.
 * Everything is cached in the OS temp dir so re-seeding is fast.
 */
import { execFile } from 'child_process'
import ffmpegPath from 'ffmpeg-static'
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'
import { promisify } from 'util'

const run = promisify(execFile)
const CACHE = path.join(os.tmpdir(), 'himalayan-crown-seed')

async function ffmpeg(args: string[]) {
  if (!ffmpegPath) throw new Error('ffmpeg-static binary not found — run `pnpm rebuild ffmpeg-static`.')
  await run(ffmpegPath, ['-y', '-loglevel', 'error', ...args], { maxBuffer: 1 << 26 })
}

async function cached(name: string, make: (file: string) => Promise<void>) {
  await mkdir(CACHE, { recursive: true })
  const file = path.join(CACHE, name)
  if (!existsSync(file)) await make(file)
  return file
}

/** Original Mixkit clip (1080p when available, else 720p). */
export const mixkit = (id: number) =>
  cached(`mixkit-${id}.mp4`, async (file) => {
    for (const q of [1080, 720]) {
      const res = await fetch(`https://assets.mixkit.co/videos/${id}/${id}-${q}.mp4`)
      if (res.ok) return writeFile(file, Buffer.from(await res.arrayBuffer()))
    }
    throw new Error(`Mixkit clip ${id} unavailable`)
  })

const WEB_H264 = ['-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an']

/** Optional colour grade for flat or over-exposed source footage. */
const GRADE = 'eq=contrast=1.12:brightness=-0.05:saturation=1.2:gamma=0.92'

/** Muted background loop: 720p, ~1–3 MB. */
export async function webLoop(id: number, { start = 0, duration = 12, grade = false } = {}) {
  const src = await mixkit(id)
  const vf = ['scale=-2:720', 'fps=25', grade && GRADE].filter(Boolean).join(',')
  return cached(`loop-${id}-${start}-${duration}${grade ? '-g' : ''}.mp4`, (out) =>
    ffmpeg(['-ss', String(start), '-t', String(duration), '-i', src, '-vf', vf, ...WEB_H264, '-crf', '27', out]),
  )
}

/** Still frame at full source resolution, used as poster / photo. */
export async function frame(id: number, at = 1, { grade = false } = {}) {
  const src = await mixkit(id)
  const vf = grade ? ['-vf', GRADE] : []
  return cached(`frame-${id}-${at}${grade ? '-g' : ''}.jpg`, (out) =>
    ffmpeg(['-ss', String(at), '-i', src, ...vf, '-frames:v', '1', '-q:v', '2', out]),
  )
}

/** Brand film: short segments with fades, joined into one 720p MP4. */
export async function brandFilm(segments: { id: number; start: number; duration: number }[]) {
  const key = segments.map((s) => `${s.id}_${s.start}_${s.duration}`).join('-')
  return cached(`film-${key.length > 80 ? key.slice(0, 80) : key}.mp4`, async (out) => {
    const parts: string[] = []
    for (const s of segments) {
      const src = await mixkit(s.id)
      const part = path.join(CACHE, `seg-${s.id}-${s.start}-${s.duration}.mp4`)
      const fade = `fade=t=in:st=0:d=0.6,fade=t=out:st=${s.duration - 0.6}:d=0.6`
      await ffmpeg(['-ss', String(s.start), '-t', String(s.duration), '-i', src, '-vf', `scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=25,${fade}`, ...WEB_H264, '-crf', '23', part])
      parts.push(part)
    }
    const list = path.join(CACHE, 'film-list.txt')
    await writeFile(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'))
    await ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out])
  })
}

/** Remote image (e.g. Unsplash) cached locally. */
export const remoteImage = (key: string, url: string) =>
  cached(`img-${key}.jpg`, async (file) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Image ${url} → ${res.status}`)
    await writeFile(file, Buffer.from(await res.arrayBuffer()))
  })

export const fileData = async (file: string) => {
  const data = await readFile(file)
  const ext = path.extname(file).slice(1)
  return { data, size: data.length, mimetype: ext === 'mp4' ? 'video/mp4' : 'image/jpeg' }
}

/** Minimal Lexical rich-text document from plain paragraphs. */
export const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
    })),
  },
})
