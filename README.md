# The Himalayan Crown

Five-star hotel website: Next.js 16 · Payload CMS 3 (admin + API) · PostgreSQL · Tailwind CSS 4 · GSAP + Lenis.

## Getting started

```bash
cp .env.example .env          # set PAYLOAD_SECRET to a long random string
docker compose up -d          # Postgres on localhost:5433
pnpm install
pnpm seed                     # demo rooms, dining, offers, photos + admin user (password printed once)
pnpm dev                      # http://localhost:3000  ·  admin at /admin
```

In development Payload pushes schema changes to the database automatically. For production, create migrations with `pnpm payload migrate:create` and run `pnpm payload migrate` on deploy.

## Structure

```
src/
  app/(frontend)/             public site: home, rooms, dining, menu, experiences, weddings, gallery, offers, contact, book
  app/(frontend)/actions.ts   server actions: enquiries, booking hold, newsletter
  app/(frontend)/template.tsx page-transition curtain
  app/sitemap.ts, robots.ts   SEO
  app/(payload)/              Payload admin + REST/GraphQL API (generated, don't edit)
  collections/                RoomTypes, Dining, Dishes, Experiences, EventVenues, Offers, Media, Bookings,
                              Enquiries, Testimonials, Subscribers, Users
  globals/SiteSettings        home, menu, weddings, contact/location, social
  components/home/            hero (day/night, live time + weather), benefits, rooms, weddings, experiences,
                              reviews, gallery marquee, location
  components/motion/          IntroLoader, SmoothScroll (Lenis), Reveal, ParallaxImage, Cursor
  lib/availability.ts         rooms left per room type for a date range
  lib/booking.ts              createBookingHold — transaction + advisory lock, prevents overbooking
  lib/weather.ts              Open-Meteo current weather (cached 30 min)
  seed/                       demo content (pnpm seed / pnpm seed:fresh)
```

## Admin dashboard

`/admin` opens on a hotel dashboard (`src/components/admin/Dashboard.tsx`): today's arrivals and departures,
rooms in-house, occupancy, bookings on hold, revenue this month, a 14-night occupancy chart, latest bookings,
new enquiries and quick links. Booking figures are shown only to the **admin** and **reservations** roles.
`pnpm seed:bookings` adds demo bookings (guest emails `demo-*@example.com`) so the dashboard has data.

## Media storage (Cloudinary)

Uploads go to Cloudinary when these are set in `.env`; otherwise they are stored in `./media`:

```
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
CLOUDINARY_FOLDER=himalayan-crown
```

Images are served with `f_auto,q_auto` (WebP/AVIF, smart compression). To move existing local files,
run `pnpm media:cloudinary` once after adding the keys — URLs are derived from filenames, so no database
changes are needed. The adapter lives in `src/lib/cloudinary.ts`.

## Content notes

- Gallery: set **Gallery category** on any media item to show it on /gallery.
- Guest reviews marked **Sample** are placeholders — replace with genuine reviews before launch.
- The rating badge only appears when *Site Settings → Home → Guest rating* is filled in.
- Evening hero (6 PM–6 AM Kathmandu time) uses *Hero night image* when set.

## Booking model

- `RoomTypes.totalRooms` is the inventory sold online.
- A guest's booking is created as `pending` with `holdExpiresAt` = now + 15 min. Pending holds count against inventory until they expire.
- Payment confirmation (phase 2) flips the booking to `confirmed` / `paid`.
- `createBookingHold` takes a Postgres advisory lock per room type, so concurrent guests can't take the same last room.

## Staff roles

| Role | Can do |
| --- | --- |
| admin | everything, manages users |
| editor | rooms, dining, offers, media, site settings |
| reservations | bookings and enquiries |

## Roadmap

- **Phase 2:** eSewa / Khalti / card gateway, payment verification, booking emails (Resend) and SMS (Sparrow), cron to expire holds, rate limiting on forms.
- **Phase 3:** channel manager / PMS sync, seasonal rates and promo codes, multi-language (next-intl), Spa & Experiences pages, SEO schema (`Hotel` JSON-LD), cloud media storage (S3/R2).
