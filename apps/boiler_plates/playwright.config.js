import { defineConfig } from '@playwright/test'

const portNumber = 5175

export default defineConfig({
	testDir: 'e2e',
	retries: process.env.CI ? 2 : 1,
	fullyParallel: true,
	workers: process.env.CI ? 2 : '50%',
	timeout: 60_000,
	reporter: process.env.CI ? 'github' : 'list',

	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		port: portNumber,
		timeout: 120_000,
		env: {
			NODE_ENV: 'production'
		}
	},

	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		// video: 'retain-on-failure'
	}
})
