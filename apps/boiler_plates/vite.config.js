import { defineConfig, mergeConfig } from 'vite'
import defaultConfig from '@repo/base/vite.config.js'
import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default mergeConfig(defineConfig({
	plugins: [
		paraglide({
			outdir: '../../libraries/base/src/lib/paraglide',
			project: '../../libraries/base/project.inlang',
		}),
		sveltekit(),
	],
}), defaultConfig)
