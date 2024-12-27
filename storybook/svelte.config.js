import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { sveltePreprocess } from 'svelte-preprocess'

export default defineConfig({
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	resolve: {
		alias: {
			$shadcn: '../packages/ui/src/shadcn',
			'$shadcn/*': '../packages/ui/src/shadcn/*',
		},
	},
})
