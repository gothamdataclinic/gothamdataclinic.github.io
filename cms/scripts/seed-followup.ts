/**
 * Second-pass content migration, run after the user reviewed the initial
 * seed and specified exactly which remaining old-site assets to bring over:
 * all PDFs, the logo, the non-decorative homepage/about images, the Common
 * Ground event (with its flyer), a Publications entry for the Nature Reviews
 * Psychology interview, and social links + the full org mission statement.
 * Skips anything already present (re-run safe).
 *
 * Usage: npm run seed:followup
 * Requires OLD_SITE_PATH pointing at the gothamdataclinic.github.io checkout.
 */
import config from '../src/payload.config'
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'

const OLD_SITE_PATH =
  process.env.OLD_SITE_PATH ||
  path.resolve(process.cwd(), '../../gothamdataclinic.github.io')

async function uploadMedia(payload: Awaited<ReturnType<typeof getPayload>>, filePath: string, alt: string) {
  const buffer = fs.readFileSync(filePath)
  // Supabase's S3 gateway rejects [ ] in object keys even though they're
  // valid in the S3 spec generally.
  const filename = path.basename(filePath).replace(/[[\]]/g, '')
  const mimetype = filename.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/' + path.extname(filename).slice(1)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
  })
}

async function findMediaByAlt(payload: Awaited<ReturnType<typeof getPayload>>, alt: string) {
  const result = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  return result.docs[0] ?? null
}

async function seed() {
  const payload = await getPayload({ config })

  // ── General assets → Media library ──────────────────────
  const assetsToUpload = [
    { file: 'static/images/gdc_logo.png', alt: 'Gotham Data Clinic logo' },
    { file: 'static/images/app_home.png', alt: 'BrainWaves app home screen' },
    { file: 'static/images/brainwaves_app.png', alt: 'BrainWaves app' },
    { file: 'static/images/brainwaves_app_full_screen.png', alt: 'BrainWaves app full screen' },
    { file: 'static/images/main.jpeg', alt: 'Gotham Data Clinic' },
    { file: 'static/assets/BrainWaves_Designs.pdf', alt: 'BrainWaves Designs' },
    { file: 'static/events/Common_Ground_2026/1_RSVP_CommonGround.pdf', alt: 'The Common Ground RSVP Form' },
  ]
  for (const asset of assetsToUpload) {
    const existing = await findMediaByAlt(payload, asset.alt)
    if (existing) {
      console.log(`Media "${asset.alt}" already exists, skipping`)
      continue
    }
    const filePath = path.join(OLD_SITE_PATH, asset.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Not found, skipping: ${asset.file}`)
      continue
    }
    await uploadMedia(payload, filePath, asset.alt)
    console.log(`Uploaded: ${asset.alt}`)
  }

  // ── Additional tax document ──────────────────────────────
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const existingTaxDocs = settings?.taxDocuments ?? []
  const hasCompleteApplication = existingTaxDocs.some((d: any) => d.label === 'Complete Application (Form 1023)')
  let updatedTaxDocs = existingTaxDocs
  if (!hasCompleteApplication) {
    const filePath = path.join(OLD_SITE_PATH, 'static/financials/Complete Application - Gotham Data Clinic - Final [submitted].pdf')
    if (fs.existsSync(filePath)) {
      const media = await uploadMedia(payload, filePath, 'Complete Application (Form 1023)')
      updatedTaxDocs = [...existingTaxDocs, { label: 'Complete Application (Form 1023)', file: media.id }]
      console.log('Added Complete Application to tax documents')
    }
  } else {
    console.log('Complete Application already in tax documents, skipping')
  }

  // ── Common Ground event ───────────────────────────────────
  const existingEvent = await payload.find({ collection: 'events', where: { title: { equals: 'The Common Ground' } }, limit: 1 })
  if (existingEvent.docs.length === 0) {
    const flyerPath = path.join(OLD_SITE_PATH, 'static/events/Common_Ground_2026/The_Common_Ground.png')
    const flyer = fs.existsSync(flyerPath) ? await uploadMedia(payload, flyerPath, 'The Common Ground flyer') : null
    await payload.create({
      collection: 'events',
      data: {
        title: 'The Common Ground',
        date: '2026-09-15T18:00:00.000Z',
        location: 'New York City, NY',
        description: 'Join us for our upcoming community event bringing together scientists, technologists, and the public in conversation about the future of data science in NYC.',
        registrationUrl: 'https://redcap.ccny.cuny.edu/redcap/surveys/?s=T8LCLTXL3J',
        eventType: 'Community Event',
        featured: true,
        ...(flyer ? { image: flyer.id } : {}),
      },
    })
    console.log('Created The Common Ground event')
  } else {
    console.log('The Common Ground event already exists, skipping')
  }

  // ── Nature Reviews Psychology interview → Publications ────
  const existingPub = await payload.find({ collection: 'publications', where: { doi: { equals: 'https://doi.org/10.1038/s44159-025-00452-y' } }, limit: 1 })
  if (existingPub.docs.length === 0) {
    const pdfPath = path.join(OLD_SITE_PATH, 'static/press/s44159-025-00452-y.pdf')
    const media = fs.existsSync(pdfPath) ? await uploadMedia(payload, pdfPath, 'From the lab to a career in data science') : null
    await payload.create({
      collection: 'publications',
      data: {
        title: 'From the lab to a career in data science',
        authors: [{ name: 'Teon Brooks' }],
        journal: 'Nature Reviews Psychology',
        year: 2026,
        abstract: 'A Q&A interview with Teon Brooks about his journey from postdoctoral scholar to data science consultant and founder of Gotham Data Clinic.',
        doi: 'https://doi.org/10.1038/s44159-025-00452-y',
        pdfUrl: media?.url ?? '',
        publicationType: 'Other',
      },
    })
    console.log('Added Nature Reviews Psychology interview to Publications')
  } else {
    console.log('Publication already exists, skipping')
  }

  // ── Site logo ──────────────────────────────────────────────
  if (!settings?.siteLogo) {
    const logo = await findMediaByAlt(payload, 'Gotham Data Clinic logo')
    if (logo) {
      await payload.updateGlobal({ slug: 'site-settings', data: { siteLogo: logo.id } })
      console.log('Set site logo')
    }
  } else {
    console.log('Site logo already set, skipping')
  }

  // ── Social links + full mission statement ─────────────────
  if (!settings?.socialLinks?.bluesky && !settings?.missionFull) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        socialLinks: {
          bluesky: 'https://bsky.app/profile/gothamdataclinic.org',
          linkedin: 'https://www.linkedin.com/company/gothamdataclinic/',
        },
        missionFull:
          'Gotham Data Clinic is a New York-based nonprofit offering data science education, training, and consulting services, all in the public interest.\n\n' +
          'Our mission at Gotham Data Clinic is to empower New Yorkers to access, understand, and act upon publicly-accessible data that impact their everyday lives.\n\n' +
          'We do this through our workshops, trainings, and consulting work for the greater New York City general public and its community organizations.',
        taxDocuments: updatedTaxDocs,
      },
    })
    console.log('Updated social links and full mission statement')
  } else {
    console.log('Social links / mission already set, applying tax doc update only')
    if (!hasCompleteApplication) {
      await payload.updateGlobal({ slug: 'site-settings', data: { taxDocuments: updatedTaxDocs } })
    }
  }

  console.log('Follow-up seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
