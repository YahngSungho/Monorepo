export default {
	testDir: 'e2e',
	retries: process.env.CI ? 2 : 1,
	fullyParallel: true,
	workers: process.env.CI ? 2 : '50%',
	timeout: 60_000,
	reporter: process.env.CI ? 'github' : 'list',

	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		// video: 'retain-on-failure'
	}
}
