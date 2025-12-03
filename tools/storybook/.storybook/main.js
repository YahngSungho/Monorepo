// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module'
import path from 'node:path'

/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-docs',
	],

	docs: {},

	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},

	stories: ['../../../*/*/src/**/*.stories.*'],
}

export default config

function getAbsolutePath(value) {
	const require = createRequire(import.meta.url)
	return path.dirname(require.resolve(path.join(value, 'package.json')))
}
