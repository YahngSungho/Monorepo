import defaultConfigObject from '@library/base/playwright.config.js'
import { defineConfig } from '@playwright/test'

const portNumber = 5175

const config = defineConfig({
	...defaultConfigObject,
	use: {
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
	},
	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		env: {
			NODE_ENV: 'production',
		},
		port: portNumber,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
})

// @ts-ignore
export default config
