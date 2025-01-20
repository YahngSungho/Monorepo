import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FontaineTransform } from 'fontaine'
import tailwindcss from '@tailwindcss/vite'
import tailwindcss2 from '@tailwindcss/postcss'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { configDefaults, defineConfig as defineConfig2, mergeConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { partytownVite } from '@qwik.dev/partytown/utils'

console.log('[Fontaine Plugin] Loading...')

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
	},
	css: {
		devSourcemap: true,
		postcss: {
			plugins: [
				tailwindcss2(),
			],
		},
	},
	plugins: [
		sveltekit(),
		tsconfigPaths(),
		tailwindcss(),
		partytownVite({}),
		FontaineTransform.vite({
			fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Noto Sans', 'Arial'],
			resolvePath(id) {
				const absolutePath = path.join(__dirname, 'static', id)
				return absolutePath
			},
		}),
	],
	server: {
		fs: {
			allow: ['.', path.resolve(__dirname, './assets')],
		},
	},
	ssr: {
		noExternal: ['@inlang/paraglide-sveltekit'],
	},
})

const testConfig = defineConfig2({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})

// @ts-ignore
export default mergeConfig(configDefaults, mergeConfig(baseConfig, testConfig))
