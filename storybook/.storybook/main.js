import { dirname, join } from "path";
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
        "@storybook/addon-mdx-gfm",
    ],

    framework: {
			name: "@storybook/sveltekit",
			options: {},
	},

    docs: {},
}
export default config

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}