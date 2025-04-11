import path from 'node:path'
import { fileURLToPath } from 'node:url'

import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ifNotProduction = process.env.NODE_ENV !== 'production'

const config = {
	compilerOptions: {
		accessors: ifNotProduction, // 타입 접근성 향상
		enableSourcemap: ifNotProduction, // 타입 추적 개선
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$shadcn: path.join(__dirname, '../ui/src/shadcn'),
		},
	},
	preprocess: [vitePreprocess()],
	extensions: ['.svelte', '.md'],
}

export default config
