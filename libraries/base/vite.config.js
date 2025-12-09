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
if (process.env.CI) {
	currentEnv = 'CI'
} else if (process.env.NODE_ENV === 'production') {
	currentEnv = 'build'
} else {
	currentEnv = 'dev'
}
export const isDev = currentEnv === 'dev'

const baseConfig = defineConfig({
	build: {
		cssMinify: 'lightningcss',
		sourcemap: isDev ? true : 'hidden', // Sentry 설정에서 sourcemap 파일 지움
	},
	css: {
		devSourcemap: true,
	},
	envPrefix: ['PUBLIC_'],
	plugins: [
		// @ts-ignore
		tsconfigPaths(),
		// @ts-ignore
		tailwindcss(),
		// @ts-ignore
		FontaineTransform.vite({
			fallbacks: {},
		}),
	],
	server: {
		fs: {
			allow: ['.', path.resolve(__dirname, './static'), searchForWorkspaceRoot(process.cwd())],
		},
	},
	// ssr: {
	// 	noExternal: ['bits-ui'],
	// },
	test: {
		exclude: ['**/e2e/**'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		outputFile: './vitest-report/result.xml',
		reporters: currentEnv === 'CI' ? ['junit', 'github-actions'] : 'default',
	},
})

// @ts-ignore
export const defaultConfig = mergeConfig(configDefaults, baseConfig)

export default defaultConfig
