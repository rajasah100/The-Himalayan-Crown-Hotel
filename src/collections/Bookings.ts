import type { CollectionConfig } from 'payload'

import { canManageBookings } from '../access'

export const BOOKING_HOLD_MINUTES = 15

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'guestName', 'roomType', 'checkIn', 'checkOut', 'status', 'paymentStatus'],
    group: 'Guests',
  },
  // Public booking creation goes through /api/bookings/hold (server-side, with locking),
  // never directly through the REST API.
  access: {
    create: canManageBookings,
    read: canManageBookings,
    update: canManageBookings,
    delete: canManageBookings,
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          index: true,
          options: [
            { label: 'Pending (on hold)', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Expired', value: 'expired' },
          ],
        },
        {
          name: 'paymentStatus',
          type: 'select',
          required: true,
          defaultValue: 'unpaid',
          options: [
            { label: 'Unpaid', value: 'unpaid' },
            { label: 'Paid', value: 'paid' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Pay at hotel', value: 'pay-at-hotel' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'eSewa', value: 'esewa' },
            { label: 'Khalti', value: 'khalti' },
            { label: 'Card', value: 'card' },
            { label: 'At hotel', value: 'hotel' },
          ],
        },
      ],
    },
    { name: 'roomType', type: 'relationship', relationTo: 'room-types', required: true, index: true },
    {
      type: 'row',
      fields: [
        {
          name: 'checkIn',
          type: 'date',
          required: true,
          index: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'checkOut',
          type: 'date',
          required: true,
          index: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        { name: 'rooms', type: 'number', required: true, defaultValue: 1, min: 1 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'adults', type: 'number', required: true, defaultValue: 2, min: 1 },
        { name: 'children', type: 'number', defaultValue: 0, min: 0 },
      ],
    },
    {
      type: 'collapsible',
      label: 'Guest',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'guestName', type: 'text', required: true },
            { name: 'guestEmail', type: 'email', required: true },
            { name: 'guestPhone', type: 'text' },
            { name: 'guestCountry', type: 'text' },
          ],
        },
        { name: 'specialRequests', type: 'textarea' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'totalAmount', type: 'number', required: true, min: 0 },
        { name: 'currency', type: 'select', required: true, defaultValue: 'USD', options: ['USD', 'NPR'] },
      ],
    },
    {
      name: 'holdExpiresAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: `Pending bookings hold inventory for ${BOOKING_HOLD_MINUTES} minutes while the guest pays.`,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
