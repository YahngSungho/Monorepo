import { defineConfig } from '@playwright/test'
import defaultConfigObject from '@library/base/playwright.config.js'

const portNumber = 5175

const config = Object.assign(defaultConfigObject, {
	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		env: {
			NODE_ENV: 'production',
		},
		port: portNumber,
		timeout: 120_000,
	},
})

// @ts-ignore
export default defineConfig(config)
