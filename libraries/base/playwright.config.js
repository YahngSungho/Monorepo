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

		process.env.CI ?
			{
				name: 'firefox',
				use: { ...devices['Desktop Firefox'] },
			}
		:	{},

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
	outputDir: './playwright-results',
	reporter:
		process.env.GITHUB_ACTIONS ? [['junit', { outputFile: 'junit.xml' }], ['github']] : 'html',
	retries: process.env.CI ? 1 : 0,
	testDir: 'e2e',
	timeout: 60_000,
	use: {
		// video: 'retain-on-failure',
		// 브라우저 컨텍스트 타임아웃 증가 (HMR 대기용)
		launchOptions: {
			slowMo: process.env.CI ? 0 : 100, // 느린 환경에서 UI 갱신 대기
		},
		screenshot: 'only-on-failure',
		trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
	},

	workers: process.env.CI ? 2 : '50%',
}
