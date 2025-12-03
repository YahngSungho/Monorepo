import { createRequire } from 'node:module'
import path from 'node:path'

// @ts-ignore - `instrument` is a valid core feature, but not in the svelte-vite types
/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
	addons: [
		getAbsolutePath('@storybook/addon-svelte-csf'),
		getAbsolutePath('@storybook/addon-docs'),
	],

	docs: {},

	framework: {
		name: getAbsolutePath('@storybook/sveltekit'),
		options: {},
	},

	stories: ['../../../*/*/src/**/*.stories.*'],
}

export default config

function getAbsolutePath(value) {
	const require = createRequire(import.meta.url)
	return path.dirname(require.resolve(path.join(value, 'package.json')))
}
