// @ts-ignore
import { currentEnv, defaultConfig } from '@library/base/vite.config.js'
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
			sveltekit(),
		],
	}),
)
