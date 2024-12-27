<script module>
import { defineMeta } from '@storybook/addon-svelte-csf'
import { fn } from '@storybook/test';
import Button from './Button.svelte';

const { Story } = defineMeta({
	args: {
		label: 'Click me',
		onclick: fn(),
	},
	component: Button,
	tags: ['autodocs'],
});
</script>

<Story name='Primary' args={{ primary: true }} />

<Story name='Secondary' />

<Story name='Large' args={{ size: 'large' }} />
