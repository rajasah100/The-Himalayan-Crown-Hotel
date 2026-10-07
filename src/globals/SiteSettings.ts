import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '../access'
import { videoField } from '../fields/video'
import { revalidateGlobal } from '../hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  hooks: { afterChange: [revalidateGlobal] },
  access: { read: anyone, update: canManageContent },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home',
          fields: [
            {
              type: 'collapsible',
              label: 'Hero',
              fields: [
                { name: 'heroEyebrow', type: 'text', defaultValue: 'Kathmandu · Nepal' },
                { name: 'heroTitle', type: 'text', required: true, defaultValue: 'Where the Himalaya comes to rest' },
                { name: 'heroSubtitle', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { description: 'Poster / fallback image.' } },
                    videoField('heroVideo', 'Plays muted behind the hero. 10–20 s loop, under 5 MB.'),
                  ],
                },
                videoField('filmVideo', 'Full brand film opened by "Watch the film" (plays with controls).'),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heroNightImage',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Evening hero (6 PM – 6 AM Kathmandu time). Leave empty to always use the day hero.' },
                    },
                    videoField('heroNightVideo', 'Optional evening loop.'),
                  ],
                },
              ],
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Book-direct benefits',
              maxRows: 4,
              admin: { description: 'Short strip under the hero, e.g. “Best rate guarantee”.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'text', type: 'text' },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Guest rating',
              admin: { description: 'Shown above reviews only when filled in. Use your real, current public rating.' },
              fields: [
                {
                  name: 'reviewsImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Background photo behind the “Guest stories” section.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'ratingValue', type: 'number', min: 0, max: 5, admin: { step: 0.1 } },
                    { name: 'ratingCount', type: 'number', min: 0 },
                    { name: 'ratingSource', type: 'text', admin: { placeholder: 'TripAdvisor' } },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Welcome',
              fields: [
                { name: 'introHeading', type: 'text' },
                { name: 'introBody', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'introImage', type: 'upload', relationTo: 'media' },
                    videoField('introVideo'),
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Quote band',
              fields: [
                { name: 'quoteText', type: 'text', defaultValue: 'Atithi Devo Bhava — the guest is god.' },
                { name: 'quoteCaption', type: 'text', defaultValue: 'Our promise since day one' },
                {
                  type: 'row',
                  fields: [{ name: 'quoteImage', type: 'upload', relationTo: 'media' }, videoField('quoteVideo')],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Closing call-to-action',
              fields: [
                {
                  type: 'row',
                  fields: [{ name: 'ctaImage', type: 'upload', relationTo: 'media' }, videoField('ctaVideo')],
                },
              ],
            },
          ],
        },
        {
          label: 'Menu',
          fields: [
            { name: 'menuIntro', type: 'textarea' },
            {
              type: 'row',
              fields: [{ name: 'menuImage', type: 'upload', relationTo: 'media' }, videoField('menuVideo')],
            },
            {
              name: 'menuNote',
              type: 'text',
              defaultValue: 'Prices in Nepalese Rupees, subject to 10% service charge and 13% VAT.',
            },
          ],
        },
        {
          label: 'Weddings & Events',
          fields: [
            {
              type: 'collapsible',
              label: 'Hero & introduction',
              fields: [
                { name: 'eventsIntro', type: 'textarea', admin: { description: 'Short line under the page title.' } },
                {
                  type: 'row',
                  fields: [{ name: 'eventsImage', type: 'upload', relationTo: 'media' }, videoField('eventsVideo')],
                },
                { name: 'weddingStoryHeading', type: 'text' },
                { name: 'weddingStory', type: 'textarea' },
                { name: 'weddingStoryImage', type: 'upload', relationTo: 'media' },
                {
                  name: 'weddingStats',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'value', type: 'text', required: true, admin: { placeholder: '800' } },
                        { name: 'label', type: 'text', required: true, admin: { placeholder: 'Guests' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'ceremonies',
              type: 'array',
              labels: { singular: 'Ceremony', plural: 'Ceremonies' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              type: 'collapsible',
              label: 'Video band',
              fields: [
                { name: 'weddingQuote', type: 'text' },
                {
                  type: 'row',
                  fields: [{ name: 'weddingBandImage', type: 'upload', relationTo: 'media' }, videoField('weddingBandVideo')],
                },
              ],
            },
            {
              name: 'weddingPackages',
              type: 'array',
              labels: { singular: 'Package', plural: 'Packages' },
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'priceFrom', type: 'text', required: true, admin: { placeholder: 'NPR 4,500 per guest' } },
                    { name: 'guests', type: 'text', admin: { placeholder: '50–150 guests' } },
                  ],
                },
                { name: 'inclusions', type: 'textarea', admin: { description: 'One inclusion per line.' } },
                { name: 'highlight', type: 'checkbox', label: 'Highlight as most popular' },
              ],
            },
            {
              type: 'collapsible',
              label: 'Wedding planner',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'plannerName', type: 'text' },
                    { name: 'plannerPhone', type: 'text' },
                    { name: 'plannerEmail', type: 'email' },
                  ],
                },
                { name: 'plannerImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text' },
            { name: 'whatsapp', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'textarea' },
            { name: 'mapUrl', type: 'text', admin: { description: 'Google Maps link for “Get directions”.' } },
            {
              type: 'row',
              fields: [
                { name: 'latitude', type: 'number', admin: { step: 0.0001 } },
                { name: 'longitude', type: 'number', admin: { step: 0.0001 } },
              ],
            },
            { name: 'locationImage', type: 'upload', relationTo: 'media' },
            {
              name: 'distances',
              type: 'array',
              admin: { description: 'Travel times shown in the home page location section.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'place', type: 'text', required: true },
                    { name: 'time', type: 'text', required: true, admin: { placeholder: '20 min' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'tripadvisor', type: 'text' },
          ],
        },
      ],
    },
  ],
}
