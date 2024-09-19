import { sveltekit } from '@sveltejs/kit/vite'

const baseConfig = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
}
export default baseConfig
