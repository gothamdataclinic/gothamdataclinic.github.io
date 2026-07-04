import { getSiteSettings } from '$lib/cms'

export async function load() {
  const settings = await getSiteSettings()
  return {
    settings: settings ?? {
      donationUrl: 'https://donorbox.org/give-to-gotham-data-clinic',
      ein: '84-3894797',
      taxExemptStatus: '501(c)(3) Public Charity',
      fiscalYear: 'January 1 – December 31',
      stateOfIncorporation: 'New York',
    }
  }
}
