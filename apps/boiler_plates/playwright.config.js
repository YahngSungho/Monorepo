import { defineConfig } from '@playwright/test'
import defaultConfigObject from '@repo/base/playwright.config.js'

const portNumber = 5175

const config = Object.assign(defaultConfigObject, {
	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		port: portNumber,
		timeout: 120_000,
		env: {
			NODE_ENV: 'production'
		}
	},
})

// @ts-ignore
export default defineConfig(config)
