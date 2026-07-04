import type { CollectionConfig } from 'payload'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Publications' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'journal', 'year', 'publicationType'],
    description: 'Add peer-reviewed papers, conference proceedings, and reports. Paste the DOI or PDF link so visitors can access the full paper.',
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
      type: 'array',
      fields: [
        { name: 'name', label: 'Author Name', type: 'text' },
      ],
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
