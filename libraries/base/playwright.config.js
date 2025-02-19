import { devices } from '@playwright/test'

export default {
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
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
		{
			name: 'Microsoft Edge',
			use: { ...devices['Desktop Edge'], channel: 'msedge' },
		},
		{
			name: 'Google Chrome',
			use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		},
	],
	reporter: process.env.CI ? 'github' : 'html',
	retries: 0,
	testDir: 'e2e',
	timeout: 60_000,
	use: {
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
		// video: 'retain-on-failure'
	},

	workers: process.env.CI ? 2 : '50%',
}
