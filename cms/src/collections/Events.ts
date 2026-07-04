import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'eventType', 'featured'],
    description: 'Add upcoming workshops, lectures, and community events. Toggle "Feature on Homepage" to highlight an event.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Event Title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: 'Date & Start Time',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'endDate',
      label: 'End Date & Time (optional)',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'location',
      label: 'Location / Venue',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Event Description',
      type: 'textarea',
    },
    {
      name: 'registrationUrl',
      label: 'Registration Link (URL)',
      type: 'text',
    },
    {
      name: 'websiteUrl',
      label: 'Event Website (URL)',
      type: 'text',
      admin: { description: 'Optional link to a dedicated event website, separate from registration.' },
    },
    {
      name: 'image',
      label: 'Event Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      options: ['Workshop', 'Lecture', 'Community Event', 'Conference', 'Webinar', 'Other'],
    },
    {
      name: 'featured',
      label: 'Feature on Homepage?',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
