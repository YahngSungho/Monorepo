import { init } from '@library/ui/base.js'
import './default.css'

init('storybook')

/** @type {import('@storybook/svelte').Preview} */
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
