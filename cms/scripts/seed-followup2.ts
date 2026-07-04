/**
 * Third-pass content fixes per user review:
 * - Rename the Form 1023 PDF to match the renamed local file.
 * - Add the Common Ground symposium website link.
 * - Feature the Nature Reviews Psychology interview so it can surface in a
 *   dedicated Press section on the site.
 */
import config from '../src/payload.config'
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'

const OLD_SITE_PATH =
  process.env.OLD_SITE_PATH ||
  path.resolve(process.cwd(), '../../gothamdataclinic.github.io')

async function seed() {
  const payload = await getPayload({ config })

  // ── Rename Form 1023 PDF ──────────────────────────────────
  const oldMedia = await payload.find({ collection: 'media', where: { alt: { equals: 'Complete Application (Form 1023)' } }, limit: 1 })
  const alreadyRenamed = await payload.find({ collection: 'media', where: { filename: { equals: 'Gotham Data Clinic - Form 1023.pdf' } }, limit: 1 })

  if (alreadyRenamed.docs.length > 0) {
    console.log('Form 1023 already renamed, skipping')
  } else if (oldMedia.docs.length > 0) {
    const filePath = path.join(OLD_SITE_PATH, 'static/financials/Gotham Data Clinic - Form 1023.pdf')
    if (!fs.existsSync(filePath)) {
      console.warn(`Renamed local file not found at ${filePath} — rename it locally first, then re-run`)
    } else {
      const buffer = fs.readFileSync(filePath)
      const newMedia = await payload.create({
        collection: 'media',
        data: { alt: 'Gotham Data Clinic - Form 1023' },
        file: { data: buffer, mimetype: 'application/pdf', name: 'Gotham Data Clinic - Form 1023.pdf', size: buffer.length },
      })

      const settings = await payload.findGlobal({ slug: 'site-settings' })
      const updatedTaxDocs = (settings?.taxDocuments ?? []).map((doc: any) =>
        doc.label === 'Complete Application (Form 1023)'
          ? { ...doc, label: 'Form 1023', file: newMedia.id }
          : doc,
      )
      await payload.updateGlobal({ slug: 'site-settings', data: { taxDocuments: updatedTaxDocs } })
      await payload.delete({ collection: 'media', id: oldMedia.docs[0].id })
      console.log('Renamed Form 1023 PDF and updated tax documents reference')
    }
  } else {
    console.log('No existing Form 1023 media found to rename')
  }

  // ── Common Ground symposium website link ──────────────────
  const event = await payload.find({ collection: 'events', where: { title: { equals: 'The Common Ground' } }, limit: 1 })
  if (event.docs.length > 0 && !event.docs[0].description?.includes('sites.google.com')) {
    await payload.update({
      collection: 'events',
      id: event.docs[0].id,
      data: {
        description: `${event.docs[0].description}\n\nLearn more: https://sites.google.com/view/the-common-ground-symposium/home`,
      },
    })
    console.log('Added Common Ground symposium website link')
  } else {
    console.log('Common Ground link already present or event not found, skipping')
  }

  // ── Feature the press interview ────────────────────────────
  const pub = await payload.find({ collection: 'publications', where: { doi: { equals: 'https://doi.org/10.1038/s44159-025-00452-y' } }, limit: 1 })
  if (pub.docs.length > 0 && !pub.docs[0].featured) {
    await payload.update({ collection: 'publications', id: pub.docs[0].id, data: { featured: true } })
    console.log('Marked press interview as featured')
  } else {
    console.log('Press interview already featured or not found, skipping')
  }

  console.log('Follow-up 2 complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
