import type { GlobalConfig } from 'payload'

export const General: GlobalConfig = {
  slug: 'general',
  label: 'General / Site-wide',
  admin: {
    description: 'Settings shared across multiple pages: branding, contact info, and copy that appears on more than one page.',
    group: 'Site-wide',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      defaultValue: 'info@gothamdataclinic.org',
    },
    {
      name: 'siteLogo',
      label: 'Site Logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Used in the site header and footer.' },
    },
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'group',
      fields: [
        { name: 'bluesky', label: 'Bluesky URL', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      ],
    },
    {
      name: 'ein',
      label: 'EIN (Employer Identification Number)',
      type: 'text',
      defaultValue: '84-3894797',
      admin: { description: 'Shown on both the Donate page and the Tax Information page.' },
    },
    {
      name: 'visionQuote',
      label: 'Vision Quote',
      type: 'textarea',
      admin: { description: 'The pulled-quote shown on both the Homepage mission section and the About page vision section.' },
    },
    {
      name: 'orgStats',
      label: 'Organization Stats',
      type: 'array',
      admin: { description: 'The stat blocks (e.g. "30+ / NYC High Schools Reached") shown on both the Homepage and About page.' },
      fields: [
        { name: 'value', label: 'Value (e.g. 30+, NYC, 2019)', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' },
      ],
    },
    {
      name: 'missionVisualImage',
      label: 'Mission Section Visual',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image next to the mission/vision copy on the Home and About pages. Left blank, the section renders without an image.' },
    },
    {
      name: 'teamHeroImage',
      label: 'Team Page Hero Background Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image on the Team page.' },
    },
  ],
}
