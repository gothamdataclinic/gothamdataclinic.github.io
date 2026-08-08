import type { GlobalConfig } from 'payload'

import { SITE_URL } from '@/lib/siteUrl'
import { triggerRebuild } from '@/lib/triggerRebuild'

export const Donate: GlobalConfig = {
  slug: 'donate',
  label: 'Donate Page',
  hooks: {
    afterChange: [async ({ doc }) => { await triggerRebuild(); return doc }],
  },
  admin: {
    description: 'Content for the Donate page (/donate).',
    group: 'Pages',
    preview: () => `${SITE_URL}/donate`,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'donateHeroHeadline',
      label: 'Hero Headline',
      type: 'text',
      admin: { description: 'The large headline at the top of the Donate page.' },
    },
    {
      name: 'donationUrl',
      label: 'Donation Platform URL',
      type: 'text',
      admin: {
        description: 'Paste your full donation link here (Every.org, PayPal Giving Fund, Stripe, etc.). This updates the "Donate Now" button across the entire website automatically.',
      },
    },
    {
      name: 'donationPlatformName',
      label: 'Platform Name (e.g. Every.org, PayPal)',
      type: 'text',
      admin: {
        description: 'Shown as a small label on the donate page.',
      },
    },
    {
      name: 'donationIntro',
      label: 'Donation Intro Paragraph',
      type: 'textarea',
      admin: { description: 'The "Every contribution makes a difference" paragraph on the Donate page.' },
    },
    {
      name: 'impactBlurbs',
      label: 'Impact Blurbs',
      type: 'array',
      admin: { description: 'The "Where your donation goes" cards on the Donate page.' },
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      name: 'donateHeroImage',
      label: 'Hero Background Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Full-width background image on the Donate page.' },
    },
  ],
}
