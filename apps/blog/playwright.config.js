import defaultConfigObject from '@library/base/playwright.config.js'
import { defineConfig } from '@playwright/test'

const portNumber = 5003

const config = defineConfig({
	...defaultConfigObject,
	webServer: {
		command: `pnpm run preview`,
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
