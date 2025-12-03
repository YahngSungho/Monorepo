import './default.css'
import '@library/base/fontStyle.css'

import { init } from '@library/ui/base.js'

init('storybook')

/** @type {import('@storybook/sveltekit').Preview} */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /date$/i,
			},
		},
	},

	tags: ['autodocs'],
}

export default preview
