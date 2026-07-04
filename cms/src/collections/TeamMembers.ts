import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'memberType'],
    description: 'Add, edit, or remove team members. Upload headshots and bios here.',
  },
  access: {
    read: () => true, // Public read for the website
  },
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'credentials',
      label: 'Credentials (e.g. Ph.D, MBA, Ed.D)',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Role / Title',
      type: 'text',
      required: true,
    },
    {
      name: 'memberType',
      label: 'Member Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Current Team Member', value: 'current' },
        { label: 'Founding Member', value: 'founding' },
      ],
    },
    {
      name: 'photo',
      label: 'Headshot Photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
    },
    {
      name: 'tags',
      label: 'Expertise Tags (e.g. Data Science, Neuroscience)',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
    },
    {
      name: 'order',
      label: 'Display Order (lower = first)',
      type: 'number',
      defaultValue: 99,
    },
  ],
}
