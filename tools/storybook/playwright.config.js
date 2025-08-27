import defaultConfigObject from '@library/base/playwright.config.js'
import { defineConfig, devices } from '@playwright/test'

const portNumber = 6001

const config = {
	...defaultConfigObject,
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
	],
	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		env: {
			NODE_ENV: 'production',
		},
		port: portNumber,
		timeout: 1_800_000,
	},

	workers: process.env.CI ? '100%' : '50%',
}

// @ts-ignore
export default defineConfig(config)
