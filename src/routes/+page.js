import { error } from '@sveltejs/kit'

export const load = async () => {
	try {
		const IntroFile = await import('../lib/content/intro.md')
		const Intro = IntroFile.default
		
		return {
			Intro
		}
	}
	catch(err) {
		error(500, err);
	}
}
