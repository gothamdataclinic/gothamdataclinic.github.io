import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media File', plural: 'Media Files' },
  admin: {
    description: 'Upload images, PDFs, and other files here. These are used by team member photos, event images, and tax documents.',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text (describe the image for accessibility)',
      type: 'text',
    },
  ],
}
