import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				// GitHub Pages serves 404.html for any unmatched path — that's how
				// SPA client-side routing works there. 'index.html' (the default
				// most hosts expect) won't be picked up at all on GH Pages.
				fallback: '404.html'
			})
		})
	]
});
