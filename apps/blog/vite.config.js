// @ts-ignore
import { currentEnv, defaultConfig } from '@library/base/vite.config.js'
import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

import { cloudflare } from "@cloudflare/vite-plugin"
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
			...(currentEnv === 'development' ? [] : [
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
							name: `${projectName}@${currentEnv}@${String(new Date().toISOString())}`,
						},
					},
				})
			]),
			// @ts-ignore
			sveltekit(),
			...(currentEnv === 'development' ? [
				cloudflare({})
			] : []),
		],
	}),
)
