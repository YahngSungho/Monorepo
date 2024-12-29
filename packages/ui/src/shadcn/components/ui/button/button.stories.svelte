<script module>
import { defineMeta } from '@storybook/addon-svelte-csf'
import { fn } from '@storybook/test';
import Button from './button.svelte';

const { Story } = defineMeta({
	component: Button,
	tags: ['autodocs'],
});

const defaultArgs = {
	label: 'Click me',
	onclick: fn(),
	size: 'lg',
}

</script>

<Story name='default'>
	<Button {...defaultArgs}>Hi. I am children</Button>
</Story>

<Story name='default-2'>
	<Button size='sm'>Hi. I am children</Button>
</Story>

<Story name='Secondary'>
	<Button variant='secondary'>Secondary</Button>
</Story>

<Story name='Third' args={{ variant: 'outline' }}>
	<Button variant='outline'>Hi. I am children</Button>
</Story>
