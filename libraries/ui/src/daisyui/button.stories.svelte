<script module>
import {defineMeta} from '@storybook/addon-svelte-csf'
import Button from './button.svelte'

const {Story} = defineMeta({
	component: Button,
	tags: ['autodocs'],
})

''; // eslint-disable-line no-unused-expressions, sonarjs/no-unused-expressions, semi
</script>

<Story name='Primary / Default'>
	<Button variant='primary'>Primary Button</Button>
</Story>

<Story name='Secondary / Default'>
	<Button variant='secondary'>Secondary Button</Button>
</Story>

<Story name='Outline / Default'>
	<Button variant='outline'>Outline Button</Button>
</Story>

<Story name='Text / Default'>
	<Button variant='text'>Text Button</Button>
</Story>

<Story name='Accent / Default'>
	<Button variant='accent'>Accent Button</Button>
</Story>

<Story name='Info / Default'>
	<Button variant='info'>Info Button</Button>
</Story>

<Story name='Success / Default'>
	<Button variant='success'>Success Button</Button>
</Story>

<Story name='Warning / Default'>
	<Button variant='warning'>Warning Button</Button>
</Story>

<Story name='Error / Default'>
	<Button variant='error'>Error Button</Button>
</Story>

<Story name='Disabled / Default'>
	<Button variant='primary' disabled>Disabled Primary Button</Button>
</Story>

<Story name='Disabled / Secondary'>
	<Button variant='secondary' disabled>Disabled Secondary Button</Button>
</Story>
