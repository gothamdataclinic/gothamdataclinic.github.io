import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Global settings for the entire website. Change the donation link, contact email, hero images, and tax information here.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'missionStatement',
              label: 'Mission Statement',
              type: 'textarea',
              admin: { description: 'Shown in the hero section on the homepage.' },
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
              admin: { description: 'Used in the site footer.' },
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
          ],
        },
        {
          label: 'Home Page',
          fields: [
            {
              name: 'heroHeadline',
              label: 'Hero Headline',
              type: 'text',
              admin: { description: 'The large headline at the top of the homepage.' },
            },
            {
              name: 'missionSectionBody',
              label: 'Mission Section Intro',
              type: 'textarea',
              admin: { description: 'The paragraph above the vision quote in the homepage mission section.' },
            },
          ],
        },
        {
          label: 'About Page',
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
          ],
        },
        {
          label: 'Donation',
          fields: [
            {
              name: 'donateHeroHeadline',
              label: 'Donate Page Headline',
              type: 'text',
              admin: { description: 'The large headline at the top of the Donate page.' },
            },
            {
              name: 'donationUrl',
              label: 'Donation Platform URL',
              type: 'text',
              admin: {
                description: 'Paste your full donation link here (PayPal Giving Fund, Donorbox, Stripe, etc.). This updates the "Donate Now" button across the entire website automatically.',
              },
            },
            {
              name: 'donationPlatformName',
              label: 'Platform Name (e.g. PayPal, Donorbox)',
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
          ],
        },
        {
          label: 'Background Images',
          fields: [
            {
              name: 'heroImage',
              label: 'Homepage Hero Background Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Full-width background image on the homepage.' },
            },
            {
              name: 'donateHeroImage',
              label: 'Donate Page Hero Background Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Full-width background image on the Donate page.' },
            },
            {
              name: 'aboutHeroImage',
              label: 'About Page Hero Background Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Background image on the About & Mission page.' },
            },
            {
              name: 'teamHeroImage',
              label: 'Team Page Hero Background Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Background image on the Team page.' },
            },
          ],
        },
        {
          label: 'Tax & Legal',
          fields: [
            {
              name: 'ein',
              label: 'EIN (Employer Identification Number)',
              type: 'text',
              defaultValue: '84-3894797',
            },
            {
              name: 'taxExemptStatus',
              label: 'Tax-Exempt Status',
              type: 'text',
              defaultValue: '501(c)(3) Public Charity',
            },
            {
              name: 'fiscalYear',
              label: 'Fiscal Year',
              type: 'text',
              defaultValue: 'January 1 – December 31',
            },
            {
              name: 'stateOfIncorporation',
              label: 'State of Incorporation',
              type: 'text',
              defaultValue: 'New York',
            },
            {
              name: 'taxDocuments',
              label: 'Tax Documents (Form 990s, Determination Letters, etc.)',
              type: 'array',
              admin: {
                description: 'Upload official tax documents here. They will appear on the Tax Information page.',
              },
              fields: [
                { name: 'label', label: 'Document Label (e.g. Form 990 — 2023)', type: 'text' },
                { name: 'year', label: 'Year', type: 'number' },
                { name: 'file', label: 'PDF File', type: 'upload', relationTo: 'media' },
                { name: 'externalUrl', label: 'Or External URL', type: 'text' },
              ],
            },
            {
              name: 'faqItems',
              label: 'Donor Tax FAQs',
              type: 'array',
              admin: { description: 'The FAQ accordion on the Tax Information page.' },
              fields: [
                { name: 'question', label: 'Question', type: 'text' },
                { name: 'answer', label: 'Answer', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
