import path from 'node:path'
import { fileURLToPath } from 'node:url'

import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			platformProxy: {
				configPath: 'wrangler.jsonc',
				persist: true,
			},
		}),
		alias: {
			$daisy: path.join(__dirname, '../ui/src/daisyui'),
			'$daisy/*': path.join(__dirname, '../ui/src/daisyui/*'),
			$miscellaneous: path.join(__dirname, '../ui/src/miscellaneous'),
			'$miscellaneous/*': path.join(__dirname, '../ui/src/miscellaneous/*'),
			$shadcn: path.join(__dirname, '../ui/src/shadcn'),
			'$shadcn/*': path.join(__dirname, '../ui/src/shadcn/*'),
		},
	},
	preprocess: [vitePreprocess()],
}

export default config
