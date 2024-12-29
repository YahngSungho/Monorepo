/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
    stories: [
		"../../apps/**/*.stories.@(js|ts|svelte)",
		"../../apps/**/*.mdx",
		"../../packages/**/*.stories.@(js|ts|svelte)",
		"../../packages/**/*.mdx",
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|ts|svelte)",
	],

	addons: [
    "@storybook/addon-svelte-csf",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
	],

    framework: {
			name: "@storybook/svelte-vite",
			options: {},
	},

    docs: {
			autodocs: true
	},
}
export default config