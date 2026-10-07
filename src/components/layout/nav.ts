export const NAV_LINKS = [
  { href: '/rooms', label: 'Rooms & Suites' },
  { href: '/dining', label: 'Dining' },
  { href: '/menu', label: 'Menu' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/gallery', label: 'Gallery' },
] as const

/** Extra links shown in the mobile menu and footer only. */
export const SECONDARY_LINKS = [
  { href: '/offers', label: 'Offers' },
  { href: '/contact', label: 'Contact' },
] as const

export const HOTEL_NAME = 'The Himalayan Crown'
