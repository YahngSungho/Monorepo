/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
    stories: [
		"../../apps/**/*.stories.@(js|ts|svelte)",
		"../../apps/**/*.mdx",
		"../../libraries/**/*.stories.@(js|ts|svelte)",
		"../../libraries/**/*.mdx",
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