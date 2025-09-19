// @ts-ignore
import { currentEnv, defaultConfig } from '@library/base/vite.config.js'
import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

import packageJson from './package.json' with { type: 'json' }

const projectName = packageJson.name
	.slice(5)
	.replace(/^./, (match) => match.toUpperCase())
	.replaceAll(/_(.)/g, (_, char) => char.toUpperCase())
	.replaceAll('_', '')

export default mergeConfig(
	defaultConfig,
	// @ts-ignore
	defineConfig({
		plugins: [
			// @ts-ignore
			sentrySvelteKit({
				adapter: 'cloudflare',
				sourceMapsUploadOptions: {
					authToken: process.env.SENTRY_AUTH_TOKEN,
					org: process.env.SENTRY_ORG,
					project: process.env.SENTRY_PROJECT,
					release: {
						name: `${projectName}@${currentEnv}@${String(new Date().toISOString())}`,
					},
					sourcemaps: {
						filesToDeleteAfterUpload: ['./.svelte-kit/**/*.map'],
					},
				},
			}),
			// @ts-ignore
			sveltekit(),
		],
	}),
)
