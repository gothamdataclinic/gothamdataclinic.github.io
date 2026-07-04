import type { CollectionConfig } from 'payload'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Program', plural: 'Programs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'label', 'order'],
    description: 'Edit program descriptions shown on the homepage and About page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Program Title',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      label: 'Category Label (e.g. Neuroscience, Data Science)',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'order',
      label: 'Display Order (lower = first)',
      type: 'number',
      defaultValue: 99,
    },
  ],
}
