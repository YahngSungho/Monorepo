/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: [
    // "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
    "../../../**/*.stories.@(js|jsx|ts|tsx|svelte)",
    "../../**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
}

export default config
