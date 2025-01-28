import { defineConfig } from '@playwright/test'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890', 4)
const portNumber = Number(nanoid()) + 25

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	retries: 1,
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
})
