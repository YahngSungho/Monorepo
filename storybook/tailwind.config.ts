import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/base/tailwind.config'

const config: Config = {
	content: [
		'./src/**/*.{html,js,ts,svelte,mdx}',
		'../libraries/*/src/**/*.{html,js,ts,svelte,mdx}',
		'../apps/*/src/**/*.{html,js,ts,svelte,mdx}',
	],
	presets: [sharedConfig],
}

export default config
