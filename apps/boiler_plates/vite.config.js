import { paraglideVitePlugin } from '@inlang/paraglide-js'
import defaultConfig from '@library/base/vite.config.js'
import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

import packageJson from './package.json'

const projectName = packageJson.name

const currentEnv =
	process.env.CF_PAGES_BRANCH === 'main' || process.env.CF_PAGES_BRANCH === 'production' ?
		'REAL_PRODUCTION'
	:	process.env.NODE_ENV

export default mergeConfig(
	defaultConfig,
	defineConfig({
		plugins: [
			sentrySvelteKit({
				adapter: 'cloudflare',
				sourceMapsUploadOptions: {
					org: 'sungho-yahng',
					project: 'monorepo',
					authToken: process.env.SENTRY_AUTH_TOKEN,
					sourcemaps: {
						filesToDeleteAfterUpload: ['./.svelte-kit/**/*.map'],
					},
					release: {
						name: `${projectName}/${currentEnv}/${String(new Date().toISOString())}`,
					},
				},
			}),
			sveltekit(),
			paraglideVitePlugin({
				// @ts-ignore
				outdir: '../../libraries/paraglide/paraglide-output',
				project: '../../libraries/paraglide/project.inlang',
				strategy: ['url', 'cookie', 'baseLocale'],
			}),
		],
	}),
)
