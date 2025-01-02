import type {Config} from 'tailwindcss'
import sharedConfig from '@repo/base/tailwind.config'

const config: Config = {
	content: [
		'./src/**/*.{html,js,ts,svelte,mdx}',
	],
	presets: [sharedConfig],
}

export default config
