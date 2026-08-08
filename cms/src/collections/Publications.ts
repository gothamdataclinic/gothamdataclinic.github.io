import type { CollectionConfig } from 'payload'

import { triggerRebuild } from '@/lib/triggerRebuild'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Publications' },
  hooks: {
    afterChange: [async ({ doc }) => { await triggerRebuild(); return doc }],
    afterDelete: [async ({ doc }) => { await triggerRebuild(); return doc }],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'journal', 'year', 'publicationType'],
    description: 'Add peer-reviewed papers, conference proceedings, and reports. Paste the DOI or PDF link so visitors can access the full paper. Shown on the /press page.',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Paper Title',
      type: 'text',
      required: true,
    },
    {
      name: 'authors',
      label: 'Authors',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'journal',
      label: 'Journal / Conference Name',
      type: 'text',
    },
    {
      name: 'year',
      label: 'Year Published',
      type: 'number',
    },
    {
      name: 'abstract',
      label: 'Abstract',
      type: 'textarea',
    },
    {
      name: 'doi',
      label: 'DOI or Paper URL',
      type: 'text',
      admin: {
        description: 'e.g. https://doi.org/10.xxxx/xxxxx or a direct link to the paper',
      },
    },
    {
      name: 'pdfUrl',
      label: 'PDF Download Link (optional)',
      type: 'text',
    },
    {
      name: 'publicationType',
      label: 'Publication Type',
      type: 'select',
      options: ['Journal Article', 'Conference Paper', 'Preprint', 'Book Chapter', 'Report', 'Interview', 'Other'],
    },
    {
      name: 'featured',
      label: 'Feature on Homepage?',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
