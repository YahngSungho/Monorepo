import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { configDefaults, defineConfig as defineConfig2, mergeConfig } from 'vitest/config'

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
})

const testConfig = defineConfig2({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})

// @ts-ignore
export default mergeConfig(configDefaults, mergeConfig(baseConfig), testConfig)
