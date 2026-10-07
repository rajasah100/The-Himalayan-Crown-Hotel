import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from './payload'

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getRoomTypes = cache(async (opts: { featured?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'room-types',
    depth: 1,
    limit: 50,
    sort: 'order',
    where: opts.featured ? { featured: { equals: true } } : undefined,
  })
  return docs
})

export const getRoomTypeBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'room-types',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return docs[0] ?? null
})

export const getDining = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'dining', depth: 1, limit: 20, sort: 'order' })
  return docs
})

export const getActiveOffers = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'offers',
    depth: 1,
    limit: 20,
    where: { active: { equals: true } },
  })
  return docs
})

export const getDishes = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'dishes',
    depth: 1,
    pagination: false,
    sort: 'order',
    where: { available: { equals: true } },
  })
  return docs
})

export const getEventVenues = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'event-venues', depth: 1, limit: 20, sort: 'order' })
  return docs
})

export const getGalleryMedia = cache(async (category?: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 200,
    sort: 'createdAt',
    where: category ? { galleryCategory: { equals: category } } : { galleryCategory: { exists: true } },
  })
  return docs
})

export const getExperiences = cache(async (opts: { featured?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'experiences',
    depth: 1,
    limit: 50,
    sort: 'order',
    where: opts.featured ? { featured: { equals: true } } : undefined,
  })
  return docs
})

export const getTestimonials = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'testimonials',
    depth: 0,
    limit: 12,
    sort: 'order',
    where: { published: { equals: true } },
  })
  return docs
})
