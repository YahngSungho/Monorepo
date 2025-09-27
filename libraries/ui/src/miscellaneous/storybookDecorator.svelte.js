import StorybookDecorator from './storybookDecorator.svelte'

export const storybookDecoratorArray = [
	(StoryElement) => ({
		Component: StorybookDecorator,
		props: { children: StoryElement },
	}),
]
