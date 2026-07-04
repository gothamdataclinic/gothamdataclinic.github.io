/**
 * Update the About page's Vision section intro copy per user review.
 */
import config from '../src/payload.config'
import { getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      visionIntro:
        "We believe that access to computing education should not be determined by zip code or socioeconomic status. By bringing world-class computing and data science curriculum to NYC's public schools and beyond, we are helping to close the opportunity gap in STEM.",
    },
  })

  console.log('Updated visionIntro')
  process.exit(0)
}

run()
