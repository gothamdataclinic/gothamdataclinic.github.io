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
      name: 'heroImage',
      label: 'Hero Background Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Full-width background image on the homepage.' },
    },
  ],
}
