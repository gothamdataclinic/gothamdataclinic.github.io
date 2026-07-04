import { getSiteSettings } from '$lib/cms'

export async function load() {
  const settings = await getSiteSettings()
  return {
    settings: settings ?? {
      donationUrl: 'https://www.paypal.com/donate/?hosted_button_id=GOTHAMDATACLINIC',
      ein: '84-3894797',
      taxExemptStatus: '501(c)(3) Public Charity',
      fiscalYear: 'January 1 – December 31',
      stateOfIncorporation: 'New York',
    }
  }
}
