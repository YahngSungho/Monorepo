import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { FontaineTransform } from 'fontaine'
import { searchForWorkspaceRoot } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export let currentEnv
if (process.env.CF_PAGES_BRANCH === 'main' || process.env.CF_PAGES_BRANCH === 'production') {
	currentEnv = 'DEPLOYED'
} else if (process.env.GITHUB_ACTIONS) {
	currentEnv = 'CI'
} else {
	currentEnv = process.env.NODE_ENV
}

export const isDev = currentEnv === 'development'

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
		sourcemap: isDev ? true : 'hidden', // Sentry 설정에서 sourcemap 파일 지움
	},
	css: {
		devSourcemap: true,
	},
	// 추가: PUBLIC_ 노출
	envPrefix: ['PUBLIC_', 'VITE_'],
	plugins: [
		// @ts-ignore
		tsconfigPaths(),
		// @ts-ignore
		tailwindcss(),
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
			allow: [
				'.',
				path.resolve(__dirname, './static'),
				searchForWorkspaceRoot(process.cwd()),
				...(isDev ? [path.resolve(__dirname, '../../')] : []),
			],
		},
		watch: isDev ? { interval: 150, usePolling: true } : undefined,
	},
	ssr: {
		noExternal: ['bits-ui'],
	},
	test: {
		exclude: ['**/e2e/**'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		outputFile: './vitest-report/result.xml',
		reporters: process.env.GITHUB_ACTIONS ? ['junit', 'github-actions'] : 'default',
	},
})

// @ts-ignore
export const defaultConfig = mergeConfig(configDefaults, baseConfig)

export default defaultConfig
