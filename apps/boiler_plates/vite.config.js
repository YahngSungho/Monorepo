import { paraglideVitePlugin } from '@inlang/paraglide-js'
import defaultConfig from '@library/base/vite.config.js'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
	defaultConfig,
	defineConfig({
		plugins: [
			sveltekit(),
			paraglideVitePlugin({
				// @ts-ignore
				outdir: '../../libraries/paraglide/paraglide-output',
				project: '../../libraries/paraglide/project.inlang',
				strategy: ['cookie', 'baseLocale'],
			}),
		],
	}),
)
