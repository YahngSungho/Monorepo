import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	compilerOptions: {
		accessors: true, // 타입 접근성 향상
		enableSourcemap: true, // 타입 추적 개선
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
	},
	preprocess: vitePreprocess({
		script: true,
	}),
}

export default config
