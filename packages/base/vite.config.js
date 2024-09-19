import { sveltekit } from '@sveltejs/kit/vite'
import swc from 'unplugin-swc'
import legacy from 'vite-plugin-legacy-swc'

const baseConfig = {
	plugins: [
		sveltekit(),
		swc.vite(),
		legacy({
			targets: ['defaults'],
		}),
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
}
export default baseConfig
