/**
 * Demo content so the site renders end-to-end before the hotel's real content arrives.
 *
 *   pnpm seed           seed an empty database
 *   pnpm seed:fresh     wipe rooms, dining, offers, media and bookings first (dev only!)
 *
 * Photos and clips are stock placeholders (Unsplash / Mixkit) — replace them with the hotel's own
 * photography and film in /admin.
 */
import config from '@payload-config'
import { randomBytes } from 'crypto'
import path from 'path'
import { getPayload } from 'payload'

import { brandFilm, fileData, frame, remoteImage, richText, webLoop } from './assets'

const payload = await getPayload({ config })
const fresh = process.argv.includes('--fresh') || process.env.SEED_FRESH === '1'

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=80`

async function upload(file: string, alt: string, caption?: string) {
  const { data, size, mimetype } = await fileData(file)
  const doc = await payload.create({
    collection: 'media',
    data: { alt, caption },
    file: { data, size, mimetype, name: path.basename(file) },
  })
  payload.logger.info(`  ${mimetype.startsWith('video') ? 'video' : 'image'}: ${alt} (${Math.round(size / 1024)} KB)`)
  return doc.id
}

async function wipe() {
  if (process.env.NODE_ENV === 'production') throw new Error('Refusing to wipe content in production.')
  payload.logger.warn('--fresh: deleting bookings, rooms, dining, dishes, venues, experiences, reviews, offers and media…')
  for (const collection of [
    'bookings',
    'dishes',
    'event-venues',
    'experiences',
    'testimonials',
    'room-types',
    'dining',
    'offers',
    'media',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
  }
}

async function seed() {
  if (fresh) await wipe()

  const existing = await payload.count({ collection: 'room-types' })
  if (existing.totalDocs > 0) {
    payload.logger.info('Content already exists — skipping seed (use `pnpm seed:fresh` to rebuild).')
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@himalayancrown.com'
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'Hotel Admin', roles: ['admin'] } })
    payload.logger.info(`Admin user: ${email} / ${password}  (change this password after first login)`)
  }

  payload.logger.info('Preparing video (first run downloads ~400 MB of source clips and encodes them)…')
  const vid = {
    hero: await upload(await webLoop(45413, { duration: 12 }), 'Annapurna massif under a clear sky'),
    intro: await upload(await webLoop(7837, { duration: 13, grade: true }), 'Boudhanath Stupa, Kathmandu', 'Boudhanath Stupa · 15 minutes from the hotel'),
    quote: await upload(await webLoop(3461, { start: 1, duration: 11 }), 'Butter lamps being lit'),
    cta: await upload(await webLoop(15919, { duration: 13 }), 'Himalayan river valley from above'),
    events: await upload(await webLoop(51655, { start: 1, duration: 12 }), 'Candlelit celebration table'),
    grill: await upload(await webLoop(15642, { duration: 10 }), 'Breakfast service at Annapurna Grill'),
    premier: await upload(await webLoop(4196, { start: 2, duration: 10 }), 'Premier room at dawn'),
    royal: await upload(await webLoop(4046, { duration: 8 }), 'Royal Crown Suite living room'),
    deluxe: await upload(await webLoop(4029, { start: 4, duration: 10 }), 'Deluxe room interior'),
    film: await upload(
      await brandFilm([
        { id: 16130, start: 0, duration: 6 },
        { id: 45414, start: 2, duration: 5 },
        { id: 7837, start: 1, duration: 5 },
        { id: 3461, start: 2, duration: 4 },
        { id: 4196, start: 2, duration: 4 },
        { id: 51655, start: 2, duration: 4 },
        { id: 52167, start: 2, duration: 4 },
        { id: 4641, start: 2, duration: 4 },
        { id: 15919, start: 3, duration: 6 },
      ]),
      'The Himalayan Crown — brand film',
    ),
  }

  payload.logger.info('Preparing photography…')
  const img = {
    hero: await upload(await frame(45413, 0.2), 'Annapurna massif under a clear sky'),
    intro: await upload(await frame(7837, 3, { grade: true }), 'Boudhanath Stupa, Kathmandu'),
    quote: await upload(await frame(3461, 1.2), 'Butter lamps being lit'),
    cta: await upload(await frame(15919, 0.2), 'Himalayan river valley from above'),
    events: await upload(await frame(51655, 1.2), 'Candlelit celebration table'),
    deluxe: await upload(await frame(4029, 4.2), 'Deluxe room with king bed'),
    premier: await upload(await frame(4196, 2.2), 'Premier room at dawn'),
    royal: await upload(await frame(4046, 0.2), 'Royal Crown Suite living room and terrace'),
    suite: await upload(await remoteImage('suite', unsplash('photo-1611892440504-42a792e24d32')), 'Heritage Suite bedroom'),
    roomAlt1: await upload(await remoteImage('room-alt1', unsplash('photo-1590490360182-c33d57733427')), 'Bedroom detail'),
    roomAlt2: await upload(await remoteImage('room-alt2', unsplash('photo-1582719478250-c89cae4dc85b')), 'Sitting area'),
    corridor: await upload(await frame(34613, 1), 'Guest corridor'),
    pool: await upload(await frame(4641, 2), 'Indoor heated pool'),
    spa: await upload(await frame(52167, 2), 'Signature Himalayan massage'),
    bhojan: await upload(await remoteImage('dine1', unsplash('photo-1414235077428-338989a2e8c0')), 'Plated course at Bhojan Ghar'),
    grill: await upload(await frame(15642, 0.5), 'Annapurna Grill dining room'),
    bar: await upload(await remoteImage('dine3', unsplash('photo-1470337458703-46ad1756a187')), 'Signature cocktail at the rooftop bar'),
  }

  payload.logger.info('Preparing weddings & events media…')
  const wedVid = {
    hero: await upload(await webLoop(40627, { duration: 12 }), 'Newlyweds in the garden'),
    ballroom: await upload(await webLoop(5213, { duration: 10 }), 'Floral ceiling installation in the Crown Ballroom'),
    courtyard: await upload(await webLoop(5224, { duration: 10 }), 'Table styling in the Durbar Courtyard'),
    lawn: await upload(await webLoop(5227, { duration: 10 }), 'Reception marquee on the Garden Lawn'),
    band: await upload(await webLoop(40584, { duration: 12 }), 'Couple walking through the gardens'),
    ceremony: await upload(await webLoop(5217, { duration: 10 }), 'Wedding ceremony'),
  }
  const wed = {
    hero: await upload(await frame(40627, 1), 'Newlyweds in the garden'),
    bride: await upload(await frame(40599, 2), 'Bride in the garden'),
    bouquet: await upload(await frame(18204, 2), 'Bridal bouquet of white roses'),
    ceremony: await upload(await frame(5217, 2), 'Wedding ceremony'),
    courtyard: await upload(await frame(5224, 2), 'Table styling in the Durbar Courtyard'),
    ballroom: await upload(await frame(5213, 2), 'Floral ceiling installation in the Crown Ballroom'),
    lawn: await upload(await frame(5227, 2), 'Reception marquee on the Garden Lawn'),
    walk: await upload(await frame(40584, 3), 'Couple walking through the gardens'),
  }

  payload.logger.info('Preparing menu photography…')
  const food = {
    momoPlatter: await upload(await remoteImage('momo-platter', unsplash('photo-1534422298391-e4f8c172dddb')), 'Momo platter — steamed, fried and spinach'),
    momo: await upload(await remoteImage('momo', unsplash('photo-1694923450868-b432a8ee52aa')), 'Steamed buff momo with tomato achar'),
    kothey: await upload(await remoteImage('kothey', unsplash('photo-1687068283776-fd69669beab8')), 'Pan-seared kothey momo'),
    thakali: await upload(await remoteImage('thakali', unsplash('photo-1588644525273-f37b60d78512')), 'Thakali thali'),
    dalBhat: await upload(await remoteImage('dal-bhat', unsplash('photo-1756821753226-c0fc88056cf7')), 'Dal bhat with saag'),
    newariThali: await upload(await remoteImage('newari-thali', unsplash('photo-1589778655375-3e622a9fc91c')), 'Newari feast thali'),
    curry: await upload(await remoteImage('curry', unsplash('photo-1652021979353-2288f1835b65')), 'Himalayan curries'),
    feast: await upload(await remoteImage('feast', unsplash('photo-1682862279256-b2a9e4f3d22c')), 'A feast of small plates'),
    spread: await upload(await remoteImage('spread', unsplash('photo-1738291422837-85761f82a10e')), 'Shared table spread'),
    kitchen: await upload(await frame(15875, 2), 'Our kitchen brigade at work'),
    flambe: await upload(await frame(4118, 2), 'Tableside flambé'),
    wok: await upload(await frame(47555, 2), 'Seasonal vegetables in the wok'),
  }
  const menuVideo = await upload(await webLoop(47555, { duration: 10 }), 'Cooking over open flame')

  payload.logger.info('Preparing experiences & location photography…')
  const exp = {
    patan: await upload(await remoteImage('patan', unsplash('photo-1585597800810-07a63ea8e983')), 'Patan Durbar Square at dusk'),
    bhaktapur: await upload(await remoteImage('bhaktapur', unsplash('photo-1550642249-6e5605421172')), 'Nyatapola Temple, Bhaktapur'),
    festival: await upload(await remoteImage('jatra', unsplash('photo-1620830634203-a92da9e0aab8')), 'Chariot festival in the valley'),
    everest: await upload(await remoteImage('everest-flight', unsplash('photo-1728271524932-af1af1ccda0b')), 'The Himalaya from a mountain flight'),
    heli: await upload(await remoteImage('heli', unsplash('photo-1601062196432-0e267ba1e1eb')), 'Helicopter over the Annapurna range'),
    bowl: await upload(await remoteImage('singing-bowl', unsplash('photo-1593811167562-9cef47bfc4d7')), 'Singing bowl sound healing'),
    yoga: await upload(await remoteImage('meditation', unsplash('photo-1593810451410-8fbb422cc15e')), 'Morning meditation'),
    night: await upload(await remoteImage('bhaktapur-night', unsplash('photo-1586100345684-a135906ef03c')), 'Nyatapola Temple under the night sky'),
    rooftops: await upload(await remoteImage('rooftops', unsplash('photo-1623492701902-47dc207df5dc')), 'Pagoda roofs across the valley'),
    courtyard: await upload(await remoteImage('newari-courtyard', unsplash('photo-1699204121879-f7d805d3bc41')), 'Carved Newari courtyard'),
  }
  const spaVideo = await upload(await webLoop(52167, { start: 1, duration: 10 }), 'Signature Himalayan massage')

  // Gallery categories
  const gallery = async (category: 'hotel' | 'rooms' | 'dining' | 'weddings' | 'wellness' | 'nepal', ids: number[]) => {
    for (const id of ids) {
      await payload.update({ collection: 'media', id, data: { galleryCategory: category } })
    }
  }
  await gallery('weddings', [wed.hero, wed.bride, wed.courtyard, wed.bouquet, wed.ballroom, wed.ceremony, wed.lawn, wed.walk, wedVid.ceremony])
  await gallery('rooms', [img.royal, img.suite, img.premier, img.deluxe, img.roomAlt1, img.roomAlt2, vid.premier])
  await gallery('dining', [food.momoPlatter, food.thakali, img.bhojan, food.newariThali, img.grill, food.feast, img.bar, food.kitchen, food.flambe, vid.grill])
  await gallery('wellness', [img.spa, img.pool])
  await gallery('hotel', [img.corridor, img.events, vid.film])
  await gallery('nepal', [img.hero, exp.patan, img.intro, exp.night, exp.bhaktapur, img.cta, exp.everest, exp.festival, img.quote, exp.rooftops, vid.intro])
  await gallery('wellness', [exp.bowl, exp.yoga])
  await gallery('weddings', [exp.courtyard])

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      heroEyebrow: 'Kathmandu · Nepal',
      heroTitle: 'Where the Himalaya comes to rest',
      heroSubtitle: 'A five-star sanctuary of Newari craftsmanship, mountain light and heartfelt hospitality.',
      heroImage: img.hero,
      heroVideo: vid.hero,
      filmVideo: vid.film,
      heroNightImage: exp.night,
      reviewsImage: img.suite,
      benefits: [
        { title: 'Best rate guarantee', text: 'Our lowest price is always on this website.' },
        { title: 'Breakfast included', text: 'Daily Himalayan breakfast for two.' },
        { title: 'Airport transfer', text: 'Complimentary on stays of 3 nights or more.' },
        { title: 'Flexible cancellation', text: 'Free cancellation up to 48 hours before arrival.' },
      ],
      latitude: 27.7226,
      longitude: 85.3197,
      mapUrl: 'https://maps.google.com/?q=27.7226,85.3197',
      locationImage: exp.rooftops,
      distances: [
        { place: 'Tribhuvan International Airport', time: '20 min' },
        { place: 'Thamel', time: '10 min' },
        { place: 'Kathmandu Durbar Square', time: '15 min' },
        { place: 'Boudhanath Stupa', time: '20 min' },
        { place: 'Patan Durbar Square', time: '30 min' },
      ],
      introHeading: 'A quiet kingdom above the valley',
      introBody:
        'Set amid terraced gardens on the edge of Kathmandu, The Himalayan Crown pairs hand-carved heritage architecture with the comforts of a modern grand hotel. Wake to the snow peaks, dine on royal Newari feasts, and let the city’s ancient rhythm slow you down.',
      introImage: img.intro,
      introVideo: vid.intro,
      quoteText: 'Atithi Devo Bhava — the guest is god.',
      quoteCaption: 'Our promise since day one',
      quoteImage: img.quote,
      quoteVideo: vid.quote,
      ctaImage: img.cta,
      ctaVideo: vid.cta,
      menuIntro: 'Royal Newari feasts, hand-folded momo and Thakali thali — alongside the world’s classics.',
      menuImage: food.wok,
      menuVideo,
      eventsIntro:
        'Candlelit courtyards, a pillar-less ballroom and garden lawns for celebrations of every size — planned by our dedicated wedding team.',
      eventsImage: wed.hero,
      eventsVideo: wedVid.hero,
      weddingStoryHeading: 'Rituals honoured, every detail considered',
      weddingStory:
        'From the swayambar to the final bidaai, our planners and priests guide every ritual with care — while our chefs prepare a feast your families will talk about for years. Mehendi in the courtyard, a sangeet under the stars, the ceremony beneath carved Newari windows: it all happens here.',
      weddingStoryImage: wed.bride,
      weddingStats: [
        { value: '800', label: 'Guests' },
        { value: '3', label: 'Venues' },
        { value: '1', label: 'Dedicated planner' },
        { value: '24h', label: 'Reply time' },
      ],
      ceremonies: [
        {
          title: 'Hindu & Newari',
          text: 'Mandap, priests and every ritual from tilak to saptapadi, with traditional Newari music and a royal bhoj.',
          image: img.quote,
        },
        {
          title: 'Buddhist blessings',
          text: 'A lama-led blessing ceremony with butter lamps and khata scarves, inspired by Boudhanath’s calm.',
          image: img.intro,
        },
        {
          title: 'Destination weddings',
          text: 'For couples from abroad: visas, guest rooms, Himalayan excursions and a ceremony in the gardens.',
          image: wed.walk,
        },
      ],
      weddingQuote: 'Two families, one celebration, the Himalaya as witness.',
      weddingBandImage: wed.walk,
      weddingBandVideo: wedVid.band,
      weddingPackages: [
        {
          name: 'Intimate',
          priceFrom: 'From NPR 4,500 / guest',
          guests: '50 – 150 guests',
          inclusions: 'Durbar Courtyard for one evening\nNepali or international buffet\nFloral mandap & stage\nBridal suite for one night\nDedicated planner',
        },
        {
          name: 'Grand',
          priceFrom: 'From NPR 6,500 / guest',
          guests: '150 – 400 guests',
          inclusions: 'Crown Ballroom or Garden Lawn\nRoyal Newari bhoj or live counters\nMandap, stage & entrance décor\nHeritage Suite for two nights\nMehendi or sangeet evening\nDedicated planner & on-day team',
          highlight: true,
        },
        {
          name: 'Royal',
          priceFrom: 'From NPR 9,500 / guest',
          guests: '400 – 800 guests',
          inclusions: 'Full-venue buyout across three days\nBespoke menus by our executive chef\nDesigner décor & lighting\nRoyal Crown Suite for three nights\nGuest room block at preferred rates\nPhotography & film partners',
        },
      ],
      plannerName: 'The Wedding Desk',
      plannerPhone: '+977 1 4XX XXXX (ext. 7)',
      plannerEmail: 'weddings@himalayancrown.com',
      phone: '+977 1 4XX XXXX',
      whatsapp: '+977 98XXXXXXXX',
      email: 'reservations@himalayancrown.com',
      address: 'Lazimpat, Kathmandu 44600\nNepal',
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
    },
  })

  const amenities = ['Rain shower', 'Nespresso machine', 'Smart TV', 'Fast Wi-Fi', 'Daily turndown', 'Bathrobe & slippers', 'In-room safe', 'Pashmina throw']
  const rooms = [
    {
      name: 'Deluxe Room',
      category: 'room' as const,
      tagline: 'Garden view',
      summary: 'Warm timber, handwoven Dhaka textiles and a private balcony over the courtyard gardens.',
      description: richText(
        'Our Deluxe Rooms open onto the inner courtyard, where jasmine and marigold climb the carved brick walls. Mornings begin with masala tea on your balcony; evenings with the soft glow of brass lamps.',
        'Each room is finished with locally woven Dhaka fabric, hand-knotted Tibetan rugs and a writing desk carved by craftsmen from Bhaktapur.',
      ),
      heroImage: img.deluxe,
      video: vid.deluxe,
      gallery: [img.roomAlt1, img.corridor, img.roomAlt2],
      sizeSqm: 38,
      maxAdults: 2,
      maxChildren: 1,
      bed: 'King or twin',
      view: 'Garden view',
      baseRateUSD: 220,
      baseRateNPR: 29500,
      totalRooms: 40,
      order: 1,
    },
    {
      name: 'Premier Room',
      category: 'room' as const,
      tagline: 'Himalayan view',
      summary: 'Higher floors framing the Langtang range, with a deep soaking tub and reading nook.',
      description: richText(
        'On clear mornings the Langtang and Ganesh Himal ranges fill the window. Premier Rooms sit on our upper floors, with a deep soaking tub positioned for the view and a cushioned reading nook.',
        'Guests enjoy access to the Crown Lounge for evening canapés and a curated selection of Himalayan teas.',
      ),
      heroImage: img.premier,
      video: vid.premier,
      gallery: [img.roomAlt2, img.pool, img.roomAlt1],
      sizeSqm: 45,
      maxAdults: 3,
      maxChildren: 1,
      bed: 'King',
      view: 'Himalayan view',
      baseRateUSD: 290,
      baseRateNPR: 38900,
      totalRooms: 24,
      order: 2,
    },
    {
      name: 'Heritage Suite',
      category: 'suite' as const,
      tagline: 'Newari craft',
      summary: 'Carved peacock windows, a separate living room and butler service in a restored Rana-era wing.',
      description: richText(
        'Housed in the restored Rana-era wing, each Heritage Suite is a living museum of Newari craft: peacock windows carved over six months, terracotta floors and antique thangka paintings.',
        'A dedicated butler arranges everything from a private puja at dawn to a heritage walk through Patan Durbar Square.',
      ),
      heroImage: img.suite,
      gallery: [img.corridor, img.roomAlt1, img.spa],
      sizeSqm: 78,
      maxAdults: 3,
      maxChildren: 2,
      bed: 'King',
      view: 'Courtyard & mountains',
      baseRateUSD: 520,
      baseRateNPR: 69700,
      totalRooms: 8,
      order: 3,
    },
    {
      name: 'Royal Crown Suite',
      category: 'suite' as const,
      tagline: 'The pinnacle',
      summary: 'A two-bedroom residence with private plunge pool, dining room and panoramic Himalayan terrace.',
      description: richText(
        'The crown of the hotel: a two-bedroom residence spanning the top floor, with a private terrace and heated plunge pool facing the full sweep of the Himalaya.',
        'Includes airport transfers by private car, a personal butler, in-suite dining for up to ten guests and a daily spa ritual for two.',
      ),
      heroImage: img.royal,
      video: vid.royal,
      gallery: [img.pool, img.spa, img.roomAlt2],
      sizeSqm: 180,
      maxAdults: 4,
      maxChildren: 2,
      bed: 'Two kings',
      view: 'Panoramic Himalaya',
      baseRateUSD: 1450,
      baseRateNPR: 194300,
      totalRooms: 2,
      order: 4,
    },
  ]
  for (const room of rooms) {
    await payload.create({
      collection: 'room-types',
      data: { ...room, featured: true, amenities: amenities.map((label) => ({ label })) },
    })
  }

  const dining = [
    {
      name: 'Bhojan Ghar',
      cuisine: 'Royal Newari',
      summary: 'A 22-course traditional bhoj served in a lamp-lit heritage hall, with cultural performances nightly.',
      image: img.bhojan,
      hours: '7:00 PM – 10:30 PM',
      dressCode: 'Smart casual',
      order: 1,
    },
    {
      name: 'Annapurna Grill',
      cuisine: 'Himalayan & International',
      summary: 'Wood-fired yak steaks, river trout and seasonal tasting menus from our kitchen garden.',
      image: img.grill,
      video: vid.grill,
      hours: '6:30 AM – 11:00 PM',
      order: 2,
    },
    {
      name: 'Crown Rooftop Bar',
      cuisine: 'Cocktails & small plates',
      summary: 'Sundowners and Himalayan-botanical cocktails with the whole valley at your feet.',
      image: img.bar,
      hours: '4:00 PM – 12:00 AM',
      order: 3,
    },
  ]
  const diningIds: number[] = []
  for (const venue of dining) diningIds.push((await payload.create({ collection: 'dining', data: venue })).id)
  const [bhojan, grill, bar] = diningIds

  type DishSeed = {
    name: string
    localName?: string
    description: string
    category: 'newari' | 'momo' | 'nepali' | 'grill' | 'international' | 'desserts' | 'drinks'
    priceNPR: number
    restaurant: number
    tags?: ('signature' | 'vegetarian' | 'vegan' | 'spicy' | 'gluten-free')[]
    image?: number
  }
  const dishes: DishSeed[] = [
    { name: 'Samay Baji', localName: 'समय बजि', description: 'The Newari ceremonial platter: beaten rice, choila, bara, black soybeans, boiled egg and Newari pickles.', category: 'newari', priceNPR: 1450, restaurant: bhojan, tags: ['signature'], image: food.newariThali },
    { name: 'Buff Choila', localName: 'छोयला', description: 'Flame-grilled buffalo marinated in mustard oil, timur pepper and fenugreek.', category: 'newari', priceNPR: 950, restaurant: bhojan, tags: ['spicy'] },
    { name: 'Bara', localName: 'बारा', description: 'Black-lentil patties cooked on a cast-iron griddle, plain or with egg.', category: 'newari', priceNPR: 650, restaurant: bhojan, tags: ['vegetarian', 'gluten-free'] },
    { name: 'Yomari', localName: 'योमरी', description: 'Steamed rice-flour dumplings filled with chaku and sesame — a winter festival treat.', category: 'newari', priceNPR: 550, restaurant: bhojan, tags: ['vegetarian'] },
    { name: 'Momo Platter', localName: 'मःमः', description: 'Twelve hand-folded momo — steamed buff, spinach-paneer and pan-fried chicken — with three achars.', category: 'momo', priceNPR: 1250, restaurant: grill, tags: ['signature'], image: food.momoPlatter },
    { name: 'Steamed Buff Momo', description: 'Our classic, with roasted tomato and sesame achar.', category: 'momo', priceNPR: 750, restaurant: grill, image: food.momo },
    { name: 'Kothey Momo', description: 'Half-steamed, half-crisped in the pan; chicken or vegetable.', category: 'momo', priceNPR: 800, restaurant: grill, image: food.kothey },
    { name: 'Jhol Momo', description: 'Floating in a warm, tangy sesame-tomato broth.', category: 'momo', priceNPR: 820, restaurant: grill, tags: ['spicy'] },
    { name: 'Thakali Thali', localName: 'थकाली खाना', description: 'Jimbu-tempered black dal, Mustang-style rice, gundruk, mutton curry and seasonal saag — refilled until you are happy.', category: 'nepali', priceNPR: 1650, restaurant: grill, tags: ['signature'], image: food.thakali },
    { name: 'Dal Bhat Tarkari', localName: 'दाल भात', description: 'Yellow lentils, steamed rice, seasonal vegetables and pickle — Nepal on a plate.', category: 'nepali', priceNPR: 1150, restaurant: grill, tags: ['vegetarian', 'gluten-free'], image: food.dalBhat },
    { name: 'Gundruk Sadeko', description: 'Fermented greens tossed with soybeans, chilli and lime.', category: 'nepali', priceNPR: 550, restaurant: grill, tags: ['vegan', 'spicy'] },
    { name: 'Sekuwa Platter', localName: 'सेकुवा', description: 'Charcoal-grilled lamb, chicken and pork skewers with beaten rice and radish pickle.', category: 'grill', priceNPR: 1850, restaurant: grill, tags: ['spicy'] },
    { name: 'Yak Tenderloin', description: 'Wood-fired yak fillet, Himalayan herb butter, roasted potatoes and jus.', category: 'grill', priceNPR: 3400, restaurant: grill, tags: ['signature', 'gluten-free'], image: food.feast },
    { name: 'Trishuli River Trout', description: 'Whole trout grilled with timur, lemon and wild garlic.', category: 'grill', priceNPR: 2600, restaurant: grill, tags: ['gluten-free'] },
    { name: 'Butter Chicken', description: 'Tandoor-smoked chicken in a velvet tomato-fenugreek sauce, with garlic naan.', category: 'international', priceNPR: 1550, restaurant: grill, image: food.curry },
    { name: 'Wild Mushroom Risotto', description: 'Carnaroli rice, Himalayan morels and aged parmesan.', category: 'international', priceNPR: 1750, restaurant: grill, tags: ['vegetarian'] },
    { name: 'Club Sandwich', description: 'Roast chicken, bacon, egg and tomato on toasted brioche, with fries.', category: 'international', priceNPR: 1250, restaurant: grill },
    { name: 'Juju Dhau', localName: 'जुजु धौ', description: 'Bhaktapur’s “king of curds”, set in a clay pot.', category: 'desserts', priceNPR: 450, restaurant: bhojan, tags: ['vegetarian', 'gluten-free'] },
    { name: 'Sel Roti & Kheer', description: 'Crisp rice-flour rings with cardamom rice pudding.', category: 'desserts', priceNPR: 520, restaurant: bhojan, tags: ['vegetarian'] },
    { name: 'Himalayan Mule', description: 'Local vodka, ginger, lime and timur pepper.', category: 'drinks', priceNPR: 950, restaurant: bar, tags: ['signature'] },
    { name: 'Ilam Tea Ceremony', description: 'First-flush Ilam tea served in brass, for two.', category: 'drinks', priceNPR: 650, restaurant: bar, tags: ['vegan'] },
    { name: 'Lassi', description: 'Sweet, salted or mango.', category: 'drinks', priceNPR: 380, restaurant: grill, tags: ['vegetarian'] },
  ]
  for (const [i, dish] of dishes.entries()) {
    await payload.create({ collection: 'dishes', data: { ...dish, order: i, available: true } })
  }

  const venues = [
    {
      name: 'Durbar Courtyard',
      setting: 'both' as const,
      summary: 'An open-sky courtyard framed by carved Newari windows — made for mehendi, sangeet and candlelit dinners.',
      image: exp.courtyard,
      areaSqm: 900,
      banquet: 350,
      reception: 500,
    },
    {
      name: 'Crown Ballroom',
      setting: 'indoor' as const,
      summary: 'A pillar-less ballroom with 7-metre ceilings, a private foyer and its own kitchen.',
      image: wed.ballroom,
      video: wedVid.ballroom,
      areaSqm: 1200,
      banquet: 600,
      theatre: 900,
      reception: 1000,
    },
    {
      name: 'Himalaya Garden Lawn',
      setting: 'outdoor' as const,
      summary: 'Terraced lawns facing the mountains, for receptions of up to 800 under marquee or stars.',
      image: wed.lawn,
      video: wedVid.lawn,
      areaSqm: 2200,
      banquet: 800,
      reception: 1200,
    },
  ]
  for (const [i, venue] of venues.entries()) {
    await payload.create({ collection: 'event-venues', data: { ...venue, order: i } })
  }

  const offers = [
    {
      title: 'Stay Longer, Save More',
      summary: 'Stay three nights or more and save 20% on our best available rate, with daily breakfast.',
      image: img.pool,
      discountPercent: 20,
    },
    {
      title: 'Himalayan Honeymoon',
      summary: 'Champagne on arrival, a couples’ spa ritual and a private candlelit dinner on the terrace.',
      image: img.events,
    },
    {
      title: 'Wellness Retreat',
      summary: 'Daily yoga, a signature Himalayan herbal massage and nourishing farm-to-table cuisine.',
      image: img.spa,
      discountPercent: 15,
    },
  ]
  for (const offer of offers) await payload.create({ collection: 'offers', data: { ...offer, active: true } })

  type ExperienceSeed = {
    title: string
    category: 'culture' | 'adventure' | 'wellness'
    duration: string
    priceFrom?: string
    summary: string
    image: number
    video?: number
    highlights: string[]
    featured?: boolean
  }
  const experiences: ExperienceSeed[] = [
    {
      title: 'Everest Mountain Flight',
      category: 'adventure',
      duration: '1 hour · Sunrise',
      priceFrom: 'From USD 250 per person',
      summary: 'Fly along the roof of the world at dawn, with a window seat for every guest and a cockpit view of Everest.',
      image: exp.everest,
      highlights: ['Private car to and from the airport', 'Guaranteed window seat', 'Flight certificate and breakfast box'],
      featured: true,
    },
    {
      title: 'Patan by Lamplight',
      category: 'culture',
      duration: 'Half day · Evening',
      priceFrom: 'From USD 85 per person',
      summary: 'Wander Patan’s courtyards as the lamps are lit, with a historian guide and supper in a Newari home.',
      image: exp.patan,
      highlights: ['Krishna Mandir and the Golden Temple', 'Visit to a metal-casting workshop', 'Newari home-cooked supper'],
      featured: true,
    },
    {
      title: 'Singing Bowl Sound Healing',
      category: 'wellness',
      duration: '60 minutes',
      priceFrom: 'NPR 6,500',
      summary: 'A deeply restorative ritual of Himalayan singing bowls, breathwork and warm herbal compresses.',
      image: exp.bowl,
      highlights: ['Private treatment suite', 'Hand-hammered bowls from Patan', 'Herbal tea ceremony to close'],
      featured: true,
    },
    {
      title: 'Bhaktapur Heritage Day',
      category: 'culture',
      duration: 'Full day',
      priceFrom: 'From USD 120 per person',
      summary: 'The best-preserved of the valley’s royal cities: pottery square, the five-tiered Nyatapola and juju dhau in a clay pot.',
      image: exp.bhaktapur,
      highlights: ['Private guide and car', 'Pottery-wheel session', 'Lunch with a view of Nyatapola'],
      featured: true,
    },
    {
      title: 'Himalayan Helicopter Breakfast',
      category: 'adventure',
      duration: '5 hours',
      priceFrom: 'From USD 1,100 per person',
      summary: 'Lift off from Kathmandu for breakfast with a front-row view of the Himalaya, then return in time for lunch.',
      image: exp.heli,
      highlights: ['Private charter for up to five', 'Champagne breakfast at altitude', 'Oxygen and warm layers provided'],
      featured: true,
    },
    {
      title: 'Festival Season in the Valley',
      category: 'culture',
      duration: 'Seasonal',
      priceFrom: 'Price on request',
      summary: 'Indra Jatra, Tihar, Bisket — our concierge secures the best vantage points for the valley’s living festivals.',
      image: exp.festival,
      highlights: ['Festival calendar shared on booking', 'Local host for each festival', 'Rooftop viewing where possible'],
    },
    {
      title: 'Signature Himalayan Massage',
      category: 'wellness',
      duration: '90 minutes',
      priceFrom: 'NPR 9,500',
      summary: 'Warm mustard and herbal oils, long flowing strokes and pressure points drawn from Ayurvedic tradition.',
      image: img.spa,
      video: spaVideo,
      highlights: ['Choice of oil blends', 'Steam and plunge pool access', 'Ideal after a mountain flight'],
    },
    {
      title: 'Sunrise Yoga & Meditation',
      category: 'wellness',
      duration: 'Daily · 6:30 AM',
      priceFrom: 'Complimentary for hotel guests',
      summary: 'Begin the day on the garden terrace with a gentle Hatha flow and guided meditation as the peaks catch the light.',
      image: exp.yoga,
      highlights: ['Mats and blankets provided', 'All levels welcome', 'Followed by herbal tea'],
    },
  ]
  for (const [i, e] of experiences.entries()) {
    await payload.create({
      collection: 'experiences',
      data: { ...e, highlights: e.highlights.map((text) => ({ text })), order: i, featured: e.featured ?? false },
    })
  }

  // Sample reviews — clearly flagged; replace with genuine guest reviews before launch.
  const reviews = [
    {
      quote: 'The kind of quiet luxury you remember for years. Waking to the mountains from our suite was simply magical.',
      guestName: 'Sample guest',
      origin: 'United Kingdom',
      source: 'tripadvisor' as const,
    },
    {
      quote: 'Our wedding for 400 guests ran flawlessly — the planners thought of every ritual and every detail.',
      guestName: 'Sample couple',
      origin: 'Kathmandu',
      source: 'google' as const,
    },
    {
      quote: 'Bhojan Ghar was the highlight of our trip. A feast, a performance and a lesson in Newari culture all at once.',
      guestName: 'Sample guest',
      origin: 'Australia',
      source: 'booking' as const,
    },
    {
      quote: 'The concierge arranged a sunrise Everest flight at a day’s notice. Service here is in a league of its own.',
      guestName: 'Sample guest',
      origin: 'United States',
      source: 'direct' as const,
    },
  ]
  for (const [i, r] of reviews.entries()) {
    await payload.create({ collection: 'testimonials', data: { ...r, rating: 5, isSample: true, published: true, order: i } })
  }

  payload.logger.info('Seed complete.')
}

await seed()
process.exit(0)
