import { devices } from '@playwright/test'

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], screenshot: 'only-on-failure' },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},

		/* against mobile viewports. */
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
		},

		/* against branded browsers. */
		process.env.CI ?
			{
				name: 'Microsoft Edge',
				use: { ...devices['Desktop Edge'], channel: 'msedge' },
			}
		:	{},

		process.env.CI ?
			{
				name: 'Google Chrome',
				use: { ...devices['Desktop Chrome'], channel: 'chrome' },
			}
		:	{},
	],
	reporter: 'html',
	retries: process.env.CI ? 1 : 0,
	testDir: 'e2e',
	timeout: 60_000,
	use: {
		screenshot: 'only-on-failure',
		trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
		// video: 'retain-on-failure',
	},

	workers: process.env.CI ? 2 : '50%',
}
