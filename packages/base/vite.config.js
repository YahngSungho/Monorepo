import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
	},
	css: {
		devSourcemap: true,
	},
	plugins: [
		sveltekit(),
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})

export default baseConfig
