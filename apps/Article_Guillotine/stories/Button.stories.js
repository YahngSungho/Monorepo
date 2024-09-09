import Button from './Button.svelte'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large'],
		},
	},
	component: Button,
	tags: ['autodocs'],
	title: 'Example/Button',
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
	args: {
		label: 'Button',
		primary: true,
	},
}

export const Secondary = {
	args: {
		label: 'Button',
	},
}

export const Large = {
	args: {
		label: 'Button',
		size: 'large',
	},
}

export const Small = {
	args: {
		label: 'Button',
		size: 'small',
	},
}
