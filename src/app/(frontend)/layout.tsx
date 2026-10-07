import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import React from 'react'

import { MobileBookBar } from '@/components/booking/MobileBookBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HOTEL_NAME } from '@/components/layout/nav'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { IntroLoader } from '@/components/motion/IntroLoader'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { introSeenScript } from '@/lib/intro'
import { mediaUrl } from '@/lib/media'
import { getSiteSettings } from '@/lib/queries'

import './styles.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogImage = mediaUrl(settings.heroImage, 'card')
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${HOTEL_NAME} · Luxury Hotel in Kathmandu`, template: `%s · ${HOTEL_NAME}` },
    description:
      'A five-star sanctuary in Kathmandu — heritage suites, Himalayan views, fine dining and spa. Book direct for the best rate.',
    openGraph: { siteName: HOTEL_NAME, type: 'website', images: ogImage ? [ogImage] : undefined },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  // schema.org Hotel — helps Google show the hotel's details in search and Maps.
  const hotelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: HOTEL_NAME,
    url: SITE_URL,
    image: mediaUrl(settings.heroImage, 'card') ? new URL(mediaUrl(settings.heroImage, 'card')!, SITE_URL).href : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    starRating: { '@type': 'Rating', ratingValue: 5 },
    priceRange: '$$$$',
    address: settings.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address.split('\n')[0], addressLocality: 'Kathmandu', addressCountry: 'NP' }
      : undefined,
    geo:
      settings.latitude && settings.longitude
        ? { '@type': 'GeoCoordinates', latitude: settings.latitude, longitude: settings.longitude }
        : undefined,
    aggregateRating:
      settings.ratingValue && settings.ratingCount
        ? { '@type': 'AggregateRating', ratingValue: settings.ratingValue, reviewCount: settings.ratingCount, bestRating: 5 }
        : undefined,
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        <script
          type="application/ld+json"
          // Escape "<" so CMS text can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <IntroLoader />
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton number={settings.whatsapp} />
        <MobileBookBar phone={settings.phone} whatsapp={settings.whatsapp} />
      </body>
    </html>
  )
}
