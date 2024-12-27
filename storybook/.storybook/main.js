import path, { dirname, join } from "path"

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

	viteFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '$shadcn': path.resolve(__dirname, "../../packages/ui/src/shadcn"),
			'$shadcn/*': path.resolve(__dirname, "../../packages/ui/src/shadcn/*"),
    };

    return config;
  },

    docs: {
			// autodocs: true
	},
}
export default config

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
