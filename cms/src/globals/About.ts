import type { GlobalConfig } from 'payload'

import { SITE_URL } from '@/lib/siteUrl'
import { triggerRebuild } from '@/lib/triggerRebuild'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  hooks: {
    afterChange: [async ({ doc }) => { await triggerRebuild(); return doc }],
  },
  admin: {
    description: 'Content for the About & Mission page (/about).',
    group: 'Pages',
    preview: () => `${SITE_URL}/about`,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'visionIntro',
      label: 'Vision Section Body',
      type: 'textarea',
      admin: { description: 'The paragraph below the vision quote on the About page.' },
    },
    {
      name: 'missionFull',
      label: 'Full Mission Statement',
      type: 'textarea',
      admin: { description: 'The official, full mission statement (org description + mission + how we do it) — shown as its own section on the About page.' },
    },
    {
      name: 'pillars',
      label: 'Mission Pillars',
      type: 'array',
      admin: { description: 'The "three pillars" cards on the About page.' },
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      name: 'historyTimeline',
      label: 'History Timeline',
      type: 'array',
      admin: { description: 'The "Our History" timeline steps on the About page.' },
      fields: [
        { name: 'label', label: 'Step Label (e.g. The Beginning)', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      name: 'aboutHeroImage',
      label: 'Hero Background Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Background image on the About & Mission page.' },
    },
    {
      name: 'brainwavesImage',
      label: 'BrainWaves Program Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image in the BrainWaves program box on the About page. Left blank, the box renders without an image.' },
    },
  ],
}
