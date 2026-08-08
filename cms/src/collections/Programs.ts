import type { CollectionConfig } from 'payload'

import { triggerRebuild } from '@/lib/triggerRebuild'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Program', plural: 'Programs' },
  hooks: {
    afterChange: [async ({ doc }) => { await triggerRebuild(); return doc }],
    afterDelete: [async ({ doc }) => { await triggerRebuild(); return doc }],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'label', 'order'],
    description: 'Edit program descriptions shown on the homepage and About page.',
    group: 'Content',
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
