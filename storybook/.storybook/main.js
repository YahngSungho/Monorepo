import { createRequire } from 'node:module'
import path from 'node:path'
/** @type {import('@storybook/svelte-vite').StorybookConfig} */
const config = {
	addons: [
		'@storybook/addon-svelte-csf',
		getAbsolutePath('@storybook/addon-links'),
		getAbsolutePath('@storybook/addon-essentials'),
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-interactions'),
		getAbsolutePath('@storybook/addon-mdx-gfm'),
	],

	docs: {},

	framework: {
		name: getAbsolutePath('@storybook/svelte-vite'),
		options: {},
	},

	stories: [
		'../../*/src/**/*.stories.@(js|ts|svelte)',
		'../../*/src/**/*.mdx',
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|ts|svelte)',
	],
}
export default config

function getAbsolutePath(value) {
	const require = createRequire(import.meta.url)
	return path.dirname(require.resolve(path.join(value, 'package.json')))
}
