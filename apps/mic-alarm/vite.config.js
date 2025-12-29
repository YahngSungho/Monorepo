// @ts-ignore
import { defaultConfig } from '@library/base/vite.config.js'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

import packageJson from './package.json' with { type: 'json' }

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
