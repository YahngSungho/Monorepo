import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defaultConfig, isDev } from '@library/base/vite.config.js'
import { sveltekit } from '@sveltejs/kit/vite'
import { searchForWorkspaceRoot } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default mergeConfig(
	defaultConfig,
	// @ts-ignore
	defineConfig({
		// @ts-ignore
		plugins: [sveltekit()],
	}),
)
