import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

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
			$shadcn: '../../libraries/ui/src/shadcn',
			'$shadcn/*': '../../libraries/ui/src/shadcn/*',
		},
	},
	preprocess: [vitePreprocess(), mdsvex()],
	extensions: ['.svelte', '.svx'],
}

export default config
