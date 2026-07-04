/**
 * One-time migration: split the single SiteSettings global into the new
 * per-page globals (home, about, donate, tax-info, general). Run once
 * against the real Supabase-backed DB before removing SiteSettings from
 * payload.config.ts.
 */
import config from '../src/payload.config'
import { getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config })

  // depth: 0 keeps upload/relationship fields as raw IDs instead of populated
  // objects, so they round-trip cleanly into the new globals below.
  const old: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  await payload.updateGlobal({
    slug: 'home',
    data: {
      heroHeadline: old.heroHeadline,
      missionStatement: old.missionStatement,
      missionSectionBody: old.missionSectionBody,
      heroImage: old.heroImage,
    },
  })
  console.log('Migrated: home')

  await payload.updateGlobal({
    slug: 'about',
    data: {
      visionIntro: old.visionIntro,
      missionFull: old.missionFull,
      pillars: old.pillars,
      historyTimeline: old.historyTimeline,
      aboutHeroImage: old.aboutHeroImage,
      brainwavesImage: old.brainwavesImage,
    },
  })
  console.log('Migrated: about')

  await payload.updateGlobal({
    slug: 'donate',
    data: {
      donateHeroHeadline: old.donateHeroHeadline,
      donationUrl: old.donationUrl,
      donationPlatformName: old.donationPlatformName,
      donationIntro: old.donationIntro,
      impactBlurbs: old.impactBlurbs,
      donateHeroImage: old.donateHeroImage,
    },
  })
  console.log('Migrated: donate')

  await payload.updateGlobal({
    slug: 'tax-info',
    data: {
      taxExemptStatus: old.taxExemptStatus,
      fiscalYear: old.fiscalYear,
      stateOfIncorporation: old.stateOfIncorporation,
      taxDocuments: old.taxDocuments,
      faqItems: old.faqItems,
    },
  })
  console.log('Migrated: tax-info')

  await payload.updateGlobal({
    slug: 'general',
    data: {
      contactEmail: old.contactEmail,
      siteLogo: old.siteLogo,
      socialLinks: old.socialLinks,
      ein: old.ein,
      visionQuote: old.visionQuote,
      orgStats: old.orgStats,
      missionVisualImage: old.missionVisualImage,
      teamHeroImage: old.teamHeroImage,
    },
  })
  console.log('Migrated: general')

  process.exit(0)
}

run()
