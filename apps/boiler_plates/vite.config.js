import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import defaultConfig from '@library/base/vite.config.js'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
	defaultConfig,
	defineConfig({
		plugins: [
			paraglide({
				// @ts-ignore
				outdir: '../../libraries/base/src/lib/paraglide',
				project: '../../libraries/base/project.inlang',
			}),
			sveltekit(),
		],
	}),
)
