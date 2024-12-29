import tailwindcss from 'tailwindcss'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { configDefaults, defineConfig as defineConfig2, mergeConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
	},
	css: {
		devSourcemap: true,
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	plugins: [
		sveltekit(), tsconfigPaths(),
	],
})

const testConfig = defineConfig2({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})

// @ts-ignore
export default mergeConfig(configDefaults, mergeConfig(baseConfig, testConfig))
