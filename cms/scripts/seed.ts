/**
 * One-off content migration: ports real org content from the old
 * gothamdataclinic.github.io site (team headshots/bios, tax PDFs) plus the
 * redesign's authored marketing copy into Payload, so the CMS isn't blank on
 * first deploy. Safe to re-run — it skips any collection that already has
 * documents rather than creating duplicates.
 *
 * Usage: tsx scripts/seed.ts
 * Requires OLD_SITE_PATH pointing at the gothamdataclinic.github.io checkout,
 * and a working DATABASE_URL / Supabase storage config in .env.
 */
import config from '../src/payload.config'
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'

const OLD_SITE_PATH =
  process.env.OLD_SITE_PATH ||
  path.resolve(process.cwd(), '../../gothamdataclinic.github.io')

const TEAM_MEMBERS = [
  {
    slug: 'teon',
    name: 'Teon Brooks, Ph.D',
    credentials: 'Ph.D',
    role: 'Co-Founder & President',
    memberType: 'founding' as const,
    bio: 'Teon is the co-founder and President of Gotham Data Clinic. A trained cognitive scientist with extensive experience in data science and research software engineering, he has over a decade of open-source software contribution, primarily in brain imaging research.',
    tags: ['Cognitive Science', 'Data Science', 'Brain Imaging', 'Open Source'],
  },
  {
    slug: 'mya',
    name: 'Mya Doelling, MBA',
    credentials: 'MBA',
    role: 'Founding Member',
    memberType: 'founding' as const,
    bio: 'Mya joined GDC while serving as a Manager of Global Partnerships at the International Olympic Committee. Prior to her current role, Mya began her career as Director of Operations for the Michael Phelps Foundation.',
    tags: ['Global Partnerships', 'Operations', 'Nonprofit Leadership'],
  },
  {
    slug: 'steve',
    name: 'Steven Azeka, Ed.D',
    credentials: 'Ed.D',
    role: 'Founding Member',
    memberType: 'founding' as const,
    bio: 'Steve joined Gotham Data Clinic while serving as a Program Lead for Responsible Computing at Mozilla and an Adjunct at the College of Staten Island. He taught STEM at the elementary and high school levels in California and New York.',
    tags: ['Responsible Computing', 'Mozilla', 'Education', 'BrainWaves'],
  },
  {
    slug: 'eric',
    name: 'Eric Chen, Ph.D',
    credentials: 'Ph.D',
    role: 'Lead, Community Engagement',
    memberType: 'current' as const,
    bio: "Eric is a Brooklyn native who joined GDC while performing computational chemistry research at NYU. He recently led the development of the Chemistry department's first STEM outreach program with local high schools.",
    tags: ['Computational Chemistry', 'STEM Outreach', 'NYU'],
  },
  {
    slug: 'nico',
    name: 'Nicolas Bustamente',
    credentials: '',
    role: 'Software Developer',
    memberType: 'current' as const,
    bio: 'Nicholas is from Queens, New York, and graduated as a Computer Engineer from Binghamton University in 2024. He is now an ETL Developer for MUFG Securities, joining the Gotham Data Clinic team in 2025.',
    tags: ['Computer Engineering', 'ETL Development', 'Data Engineering'],
  },
]

const PROGRAMS = [
  { title: 'BrainWaves', label: 'Neuroscience', description: "Our flagship program connecting EEG hardware to students' computers, letting them observe their own brain activity and run real neuroscience experiments — the same way researchers do.", order: 1 },
  { title: 'Data Science Education', label: 'Data Science', description: 'Hands-on workshops and curriculum teaching Python, machine learning, and AI to the next generation of NYC scientists and technologists.', order: 2 },
  { title: 'Public Engagement', label: 'Community', description: 'We bring computational science to the broader public through lectures, events, and scholarly publications that make complex ideas accessible.', order: 3 },
  { title: 'Open Curriculum', label: 'Curriculum', description: "We develop and freely share next-generation educational content and platforms for computing and data science, built for NYC's diverse student population.", order: 4 },
]

const TAX_DOCUMENTS = [
  { file: 'Gotham Data - Letter 947.pdf', label: 'IRS Determination Letter' },
  { file: 'Gotham Data Clinic - Description of Activities.pdf', label: 'Description of Activities' },
]

async function uploadMedia(payload: Awaited<ReturnType<typeof getPayload>>, filePath: string, alt: string) {
  const buffer = fs.readFileSync(filePath)
  const filename = path.basename(filePath)
  const mimetype = filename.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
  })
  return doc
}

async function seed() {
  const payload = await getPayload({ config })

  // ── Team members + headshots ──────────────────────────────
  const existingTeam = await payload.find({ collection: 'team-members', limit: 1 })
  if (existingTeam.docs.length === 0) {
    for (const [i, member] of TEAM_MEMBERS.entries()) {
      const headshotPath = path.join(OLD_SITE_PATH, 'static/images/headshots', `${member.slug}.jpg`)
      let photoId: string | undefined
      if (fs.existsSync(headshotPath)) {
        const photo = await uploadMedia(payload, headshotPath, `${member.name} headshot`)
        photoId = photo.id
      } else {
        console.warn(`No headshot found for ${member.slug}, skipping photo`)
      }
      await payload.create({
        collection: 'team-members',
        data: {
          name: member.name,
          credentials: member.credentials,
          role: member.role,
          memberType: member.memberType,
          bio: member.bio,
          tags: member.tags.map((tag) => ({ tag })),
          order: i,
          ...(photoId ? { photo: photoId } : {}),
        },
      })
    }
    console.log(`Seeded ${TEAM_MEMBERS.length} team members`)
  } else {
    console.log('Team members already exist, skipping')
  }

  // ── Programs ───────────────────────────────────────────────
  const existingPrograms = await payload.find({ collection: 'programs', limit: 1 })
  if (existingPrograms.docs.length === 0) {
    for (const program of PROGRAMS) {
      await payload.create({ collection: 'programs', data: program })
    }
    console.log(`Seeded ${PROGRAMS.length} programs`)
  } else {
    console.log('Programs already exist, skipping')
  }

  // ── Tax documents + Site Settings ─────────────────────────
  const taxDocuments = []
  for (const doc of TAX_DOCUMENTS) {
    const filePath = path.join(OLD_SITE_PATH, 'static/financials', doc.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Tax document not found: ${doc.file}, skipping`)
      continue
    }
    const media = await uploadMedia(payload, filePath, doc.label)
    taxDocuments.push({ label: doc.label, file: media.id })
  }

  const existingSettings = await payload.findGlobal({ slug: 'site-settings' })
  if (!existingSettings?.missionStatement) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        missionStatement:
          'Gotham Data Clinic is a New York City-based nonprofit whose mission is to train the next generation of scientists and technologists in computing and data science — and to engage the public in these vital conversations.',
        visionQuote:
          'We wanted to find a home for this research platform and its curriculum after the grant period ended — so we established this nonprofit to be the stewards of the program.',
        orgStats: [
          { value: '30+', label: 'NYC High Schools Reached' },
          { value: '501(c)(3)', label: 'Nonprofit Organization' },
          { value: '2019', label: 'Year Founded' },
          { value: 'NYC', label: 'Based in New York City' },
        ],
        contactEmail: 'info@gothamdataclinic.org',
        heroHeadline: "Training Tomorrow's Data Scientists in the City That Never Stops",
        missionSectionBody:
          'Our vision is to inform, prepare, and train the next generation of scientists and technologists — and the broader public — in computational and data sciences for a more fair and responsible future.',
        visionIntro:
          "We believe that access to computational education should not be determined by zip code or socioeconomic status. By bringing world-class data science curriculum to NYC's public schools and communities, we are helping to close the opportunity gap in STEM.",
        pillars: [
          { title: 'Develop Next-Gen Curriculum', description: "We create computational and data science education content and platforms designed for NYC's diverse student population, from high school through university." },
          { title: 'Lead Workshops & Training', description: 'We deliver hands-on workshops and training programs in computing and data science, meeting students and communities where they are.' },
          { title: 'Publicize Our Work', description: 'We share our research and programs through scholarly publications and public engagements, contributing to the broader conversation on responsible computing education.' },
        ],
        historyTimeline: [
          { label: 'The Beginning', description: 'Gotham Data Clinic was born out of a National Institutes of Health Science Education Partnership Award granted to NYU to develop and deliver a neuroscience curriculum to high school students in NYC.' },
          { label: 'BrainWaves Program', description: "We created a research platform connecting EEG hardware to students' computers, letting them observe their own brain activity. The BrainWaves curriculum reached thirty different high schools across New York City." },
          { label: 'Today & Beyond', description: 'After the NIH grant period ended, we established this nonprofit to be the stewards of the BrainWaves platform and to incubate new programs. We have since expanded to include data science, machine learning, and AI.' },
        ],
        donationUrl: 'https://donorbox.org/give-to-gotham-data-clinic',
        donationPlatformName: 'Donorbox',
        donationIntro:
          'Gotham Data Clinic is entirely supported by the generosity of donors like you. Your gift helps us bring world-class data science education to students across New York City who need it most.',
        impactBlurbs: [
          { title: 'Fund Workshops', description: 'Your donation directly funds hands-on data science and computing workshops for NYC students who otherwise may not have access to this education.' },
          { title: 'Sustain Programs', description: 'Help us maintain and expand our BrainWaves platform and curriculum, keeping it freely available to high schools across New York City.' },
          { title: 'Advance Research', description: 'Support our scholarly publications and public engagement efforts that contribute to the national conversation on responsible computing education.' },
        ],
        ein: '84-3894797',
        taxExemptStatus: '501(c)(3) Public Charity',
        fiscalYear: 'January 1 – December 31',
        stateOfIncorporation: 'New York',
        taxDocuments,
        faqItems: [
          { question: 'Is my donation to Gotham Data Clinic tax-deductible?', answer: 'Yes. Gotham Data Clinic is recognized by the IRS as a 501(c)(3) public charity. Donations are tax-deductible to the fullest extent permitted by law. You should consult your tax advisor regarding the deductibility of your specific contribution.' },
          { question: "What is Gotham Data Clinic's EIN?", answer: 'Our Employer Identification Number (EIN) is 84-3894797. You will need this number when claiming your charitable deduction on your federal tax return.' },
          { question: 'Will I receive a receipt for my donation?', answer: 'Yes. All donors receive a written acknowledgment of their contribution, which serves as your official receipt for tax purposes. Please retain this document for your records.' },
          { question: "Where can I find Gotham Data Clinic's Form 990?", answer: 'As a 501(c)(3) organization, Gotham Data Clinic files Form 990 with the IRS annually. Our filings are publicly available through the IRS website and nonprofit transparency databases such as ProPublica Nonprofit Explorer and GuideStar/Candid.' },
          { question: 'Are in-kind donations accepted?', answer: 'We welcome in-kind donations of equipment, software, and professional services. Please contact us at info@gothamdataclinic.org to discuss in-kind contributions.' },
          { question: 'Can my employer match my donation?', answer: "Many employers offer matching gift programs for donations to 501(c)(3) organizations. Please check with your employer's HR department to see if Gotham Data Clinic qualifies." },
        ],
      },
    })
    console.log('Seeded Site Settings')
  } else {
    console.log('Site Settings already populated, skipping')
  }

  console.log('Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
