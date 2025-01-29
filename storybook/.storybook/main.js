import { dirname, join } from 'path'
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
	stories: [
		'../../apps/**/*.stories.@(js|ts|svelte)',
		'../../apps/**/*.mdx',
		'../../libraries/**/*.stories.@(js|ts|svelte)',
		'../../libraries/**/*.mdx',
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|ts|svelte)',
	],

	addons: [
		'@storybook/addon-svelte-csf',
		getAbsolutePath('@storybook/addon-links'),
		getAbsolutePath('@storybook/addon-essentials'),
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-interactions'),
		getAbsolutePath('@storybook/addon-mdx-gfm'),
	],

	framework: {
		name: getAbsolutePath('@storybook/svelte-vite'),
		options: {},
	},

	docs: {},
}
export default config

function getAbsolutePath(value) {
	return dirname(require.resolve(join(value, 'package.json')))
}
