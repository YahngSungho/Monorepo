import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import defaultConfig from '@repo/base/vite.config.js'
import { paraglide } from '@inlang/paraglide-sveltekit/vite'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default mergeConfig(defineConfig({
	plugins: [
		paraglide({
			outdir: path.resolve(__dirname, '../../libraries/base/src/lib/paraglide'),
			project: path.resolve(__dirname, '../../libraries/base/project.inlang'),
		}),
	],
}), defaultConfig)
