export default {
	fullyParallel: true,
	reporter: process.env.CI ? 'github' : 'list',
	retries: process.env.CI ? 2 : 1,
	testDir: 'e2e',
	timeout: 60_000,
	use: {
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
		// video: 'retain-on-failure'
	},

	workers: process.env.CI ? 2 : '50%',
}
