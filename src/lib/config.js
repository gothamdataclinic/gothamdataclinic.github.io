/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/ 

export const siteTitle = 'Gotham Data Clinic'
export const siteDescription = 'This is the homepage for Gotham Data Clinic, a NYC-based nonprofit'
export const siteURL = 'gothamdataclinic.org'
export const siteLink = 'https://github.com/gothamdataclinic/gothamdataclinic.github.io'
export const siteAuthor = 'Gotham Data Clinic, a 501(c)(3) organization (EIN: 84-3894797)'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'About',
		route: '/about'
	}, {
		title: 'Team (wip)',
		route: '/team'
	}, {
		title: 'Contact',
		route: '/contact' 
	}, {
		title: 'Blog (coming soon!)',
		route: '#' 
	},
]