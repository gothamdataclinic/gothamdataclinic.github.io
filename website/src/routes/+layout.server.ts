import { getSiteSettings } from '$lib/cms'

// All routes are static paths (no [slug] segments), so the whole site can be
// prerendered at build time — visitors get plain static HTML/CSS/JS and never
// call the CMS API directly, avoiding cold starts on the CMS backend.
export const prerender = true

export async function load() {
  const settings = await getSiteSettings()
  return {
    settings: settings ?? {
      donationUrl: 'https://www.every.org/gotham-data-clinic#/donate',
      ein: '84-3894797',
      taxExemptStatus: '501(c)(3) Public Charity',
      fiscalYear: 'January 1 – December 31',
      stateOfIncorporation: 'New York',
    }
  }
}
