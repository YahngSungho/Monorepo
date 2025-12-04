import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mergeConfig, searchForWorkspaceRoot } from 'vite'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs'],

	docs: {},

	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},

	stories: ['../../../*/*/src/**/*.stories.*'],

	// Extend Vite config so Storybook can serve assets from `libraries/base/static`
	async viteFinal(baseConfig) {
		return mergeConfig(baseConfig, {
			server: {
				fs: {
					allow: [
						...(baseConfig.server && baseConfig.server.fs && baseConfig.server.fs.allow ?
							baseConfig.server.fs.allow
						:	[]),
						// Monorepo root
						searchForWorkspaceRoot(process.cwd()),
						// Shared base library static path (fonts 등)
						path.resolve(__dirname, '../../libraries/base/static'),
					],
				},
			},
		})
	},
}

export default config
