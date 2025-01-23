import { defineConfig, mergeConfig } from 'vite'
import defaultConfig from '@repo/base/vite.config.js'
import { paraglide } from '@inlang/paraglide-sveltekit/vite'

export default mergeConfig(defineConfig({
	plugins: [
		paraglide({
			outdir: '../../libraries/base/src/lib/paraglide',
			project: '../../libraries/base/project.inlang',
		}),
	],
}), defaultConfig)
