import './default.css'

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
