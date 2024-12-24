import path, { dirname, join } from "path";
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
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
        "@storybook/addon-mdx-gfm",
    ],

    framework: {
		name: "@storybook/svelte-vite",
		options: {
			enableSvelte5: true,
			sveltekit: {
				configFile: path.resolve(__dirname, '../../svelte.config.js'), // 명시적으로 svelte.config.js 경로 지정
			},
		},
	},

    docs: {
			autodocs: true
	},

	async viteFinal(config, { configType }) {
      if (configType === 'PRODUCTION') {
        config.base = '/my-storybook-app/'
      }
			config.resolve.alias = {
				...config.resolve.alias,
				'$shadcn': path.resolve(__dirname, '../../packages/ui/src/shadcn'),
				'$shadcn/*': path.resolve(__dirname, '../../packages/ui/src/shadcn/*'),
							};
      return config
    },
}
export default config

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
