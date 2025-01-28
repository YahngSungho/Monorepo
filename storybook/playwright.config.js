import { defineConfig } from '@playwright/test'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890', 4)
const portNumber = Number(nanoid()) + 25

export default defineConfig({
	testDir: 'e2e',

	webServer: {
		command: `pnpm run preview --port ${portNumber}`,
		port: portNumber,
	},
})
