import './default.css'

import { init } from '@library/ui/base.js'

init('storybook')

/** @type {import('@storybook/svelte-vite').Preview} */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /date$/i,
			},
		},
	},

	tags: ['autodocs', 'autodocs'],
}

export default preview
