import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FontaineTransform } from 'fontaine'
import tailwindcss from '@tailwindcss/vite'
import tailwindcss2 from '@tailwindcss/postcss'
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { partytownVite } from '@qwik.dev/partytown/utils'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url) // eslint-disable-line
const __dirname = path.dirname(__filename)

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
	},
	css: {
		devSourcemap: true,
		postcss: {
			plugins: [tailwindcss2()],
		},
	},
	plugins: [
		// @ts-ignore
		tsconfigPaths(),
		// @ts-ignore
		tailwindcss(),
		partytownVite({}),
		// @ts-ignore
		FontaineTransform.vite({
			fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Noto Sans', 'Arial'],
			resolvePath(id) {
				// 여기서 id는 @font-face에서 url에 주어진 string. 거기서부터 파일 경로를 찾아가야 하기 때문에 package.json의 exports에서 이름을 파일 경로로 변환할 수 있는 것들로 했음
				const absolutePath = path.join(__dirname, 'static', 'fonts', id.replace(/^.+\//, ''))
				return absolutePath
			},
		}),
	],
	server: {
		fs: {
			allow: ['.', path.resolve(__dirname, './static')],
		},
	},
	ssr: {
		noExternal: ['@inlang/paraglide-sveltekit'],
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})

// @ts-ignore
export default mergeConfig(configDefaults, baseConfig)
