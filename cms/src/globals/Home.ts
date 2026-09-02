import type { GlobalConfig } from 'payload'

import { SITE_URL } from '@/lib/siteUrl'
import { globalAfterChangeRebuildHook } from '@/lib/triggerRebuild'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  hooks: {
    afterChange: [globalAfterChangeRebuildHook],
  },
  admin: {
    description: 'Content for the homepage (/).',
    group: 'Pages',
    preview: () => `${SITE_URL}/`,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroHeadline',
      label: 'Hero Headline',
      type: 'text',
      admin: { description: 'The large headline at the top of the homepage.' },
    },
    {
      name: 'missionStatement',
      label: 'Mission Statement',
      type: 'textarea',
      admin: { description: 'Shown in the hero section on the homepage.' },
    },
    {
      name: 'missionSectionBody',
      label: 'Mission Section Intro',
      type: 'textarea',
      admin: { description: 'The paragraph above the vision quote in the homepage mission section.' },
    },
    {
      name: 'heroSkylinePlate',
      label: 'Hero Skyline Plate',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional. Replaces the New York skyline in the homepage hero. The sky MUST be cut out and saved as a transparent PNG or WebP — the hero renders its own sky behind this image, so a normal photo will just cover it. Leave empty to use the plate that ships with the site.',
      },
    },
    {
      name: 'heroPhotoCredit',
      label: 'Hero Photo Credit',
      type: 'group',
      admin: { description: 'Attribution shown in the corner of the hero.' },
      fields: [
        {
          name: 'text',
          type: 'text',
          admin: { description: 'Leave empty to hide the credit entirely.' },
        },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'heroDefaultLook',
      label: 'Hero Time of Day',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: "Auto — match the visitor's local time", value: 'auto' },
        { label: 'Always night', value: 'night' },
        { label: 'Always day', value: 'day' },
        { label: 'Always sunrise', value: 'sunrise' },
      ],
      admin: {
        description:
          'Which sky the hero opens with. Auto picks sunrise between 5am and 8am, day until 6pm, night after that. Visitors can always switch it themselves, and their choice is remembered.',
      },
    },
  ],
}
