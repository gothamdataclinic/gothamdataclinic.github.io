import type { GlobalConfig } from 'payload'

import { SITE_URL } from '@/lib/siteUrl'
import { globalAfterChangeRebuildHook } from '@/lib/triggerRebuild'

export const TaxInfo: GlobalConfig = {
  slug: 'tax-info',
  label: 'Tax & Legal Page',
  hooks: {
    afterChange: [globalAfterChangeRebuildHook],
  },
  admin: {
    description: 'Content for the Tax Information page (/tax-info).',
    group: 'Pages',
    preview: () => `${SITE_URL}/tax-info`,
  },
  access: {
    read: () => true,
  },
  fields: [
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
}
