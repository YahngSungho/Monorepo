import { defineConfig, mergeConfig } from 'vitest/config'
import defaultConfig from '@library/base/vite.config.js'
import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from '@sveltejs/kit/vite'

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
