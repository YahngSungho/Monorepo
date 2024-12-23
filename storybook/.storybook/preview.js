import './default.css'
import '@repo/base/base.css'

/** @type { import('@storybook/svelte').Preview } */
const preview = {
    parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},

    tags: ['autodocs']
}

export default preview
