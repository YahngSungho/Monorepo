import { dirname, join } from "path";
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
    stories: [
		"../../apps/**/*.stories.@(js|ts)",
		"../../apps/**/*.mdx",
		"../../packages/**/*.stories.@(js|ts)",
		"../../packages/**/*.mdx",
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|ts|svelte)",
	],

    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@chromatic-com/storybook"),
        getAbsolutePath("@storybook/addon-interactions"),
        getAbsolutePath("@storybook/addon-mdx-gfm"),
        "@chromatic-com/storybook"
    ],

    framework: {
		name: getAbsolutePath("@storybook/svelte-vite"),
		options: {
			enablSvelte5: true,
		},
	},

    docs: {}
}
export default config

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
