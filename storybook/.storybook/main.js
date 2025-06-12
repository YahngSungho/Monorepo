import { createRequire } from 'node:module'
import path from 'node:path'

// @ts-ignore - `instrument` is a valid core feature, but not in the svelte-vite types
/** @type {import('@storybook/svelte-vite').StorybookConfig} */
const config = {
	addons: ['@storybook/addon-svelte-csf', getAbsolutePath('@storybook/addon-essentials')],

	docs: {},

	framework: {
		name: getAbsolutePath('@storybook/svelte-vite'),
		options: {},
	},

	stories: ['../../*/*/src/**/*.stories.@(js|ts|svelte)'],

	features: {
		// @ts-ignore
		interactionsDebugger: true, // 디버깅 시 유용
		// @ts-ignore - 'instrument' is a valid core feature, but not in the svelte-vite types
		instrument: false, // 이 옵션을 false로 설정
	},
}

export default config

function getAbsolutePath(value) {
	const require = createRequire(import.meta.url)
	return path.dirname(require.resolve(path.join(value, 'package.json')))
}
