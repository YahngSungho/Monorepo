import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { partytownVite } from '@qwik.dev/partytown/utils'
import tailwindcss from '@tailwindcss/vite'
import { FontaineTransform } from 'fontaine'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = defineConfig({
	build: {
		sourcemap: 'hidden', // Sentry 설정에서 sourcemap 파일 지움
		cssMinify: 'lightningcss',
	},
	css: {
		devSourcemap: true,
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
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		reporters: process.env.GITHUB_ACTIONS ? ['junit', 'github-actions'] : 'default',
		outputFile: './vitest-report',
	},
})

// @ts-ignore
export default mergeConfig(configDefaults, baseConfig)
