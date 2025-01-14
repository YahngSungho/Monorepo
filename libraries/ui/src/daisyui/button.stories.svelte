<script module>
import {defineMeta} from '@storybook/addon-svelte-csf'
import Button from './button.svelte'

const {Story} = defineMeta({
	component: Button,
	tags: ['autodocs'],
})

''; // eslint-disable-line no-unused-expressions, sonarjs/no-unused-expressions, semi
</script>

{#snippet multiple()}
	<div class={'boxed'} style:width='calc(100% / 2)'>
		<Button variant='primary'>Primary Button</Button>
		<Button variant='secondary'>Secondary Button</Button>
		<Button variant='outline'>Outline Button</Button>
		<Button variant='text'>Text Button</Button>
		<Button variant='accent'>Accent Button</Button>
		<Button variant='info'>Info Button</Button>
		<Button variant='success'>Success Button</Button>
		<Button variant='warning'>Warning Button</Button>
		<Button variant='error'>Error Button</Button>
		<Button variant='primary' disabled>Disabled Primary Button</Button>
		<Button variant='secondary' disabled>Disabled Secondary Button</Button>
	</div>
{/snippet}

<!-- Todo: 여러 컴포넌트 추가하는거 storybook.mdx에 설명 추가 -->
<Story name='Bunch'>
	{@render multiple()}
</Story>

<Story name='Primary / Default'>
	{#snippet children()}
		<Button variant='primary'>Primary Button</Button>
	{/snippet}
</Story>

<Story name='Secondary / Default' args={{ variant: 'secondary' }}>
	{#snippet children(args)}
		<Button {...args}>Secondary Button</Button>
	{/snippet}
</Story>

<Story name='Outline / Default' args={{ variant: 'outline' }}>
	{#snippet children(args)}
		<Button {...args}>Outline Button</Button>
	{/snippet}
</Story>

<Story name='Text / Default' args={{ variant: 'text' }}>
	{#snippet children(args)}
		<Button {...args}>Text Button</Button>
	{/snippet}
</Story>

<Story name='Accent / Default' args={{ variant: 'accent' }}>
	{#snippet children(args)}
		<Button {...args}>Accent Button</Button>
	{/snippet}
</Story>

<Story name='Info / Default' args={{ variant: 'info' }}>
	{#snippet children(args)}
		<Button {...args}>Info Button</Button>
	{/snippet}
</Story>

<Story name='Success / Default' args={{ variant: 'success' }}>
	{#snippet children(args)}
		<Button {...args}>Success Button</Button>
	{/snippet}
</Story>

<Story name='Warning / Default' args={{ variant: 'warning' }}>
	{#snippet children(args)}
		<Button {...args}>Warning Button</Button>
	{/snippet}
</Story>

<Story name='Error / Default' args={{ variant: 'error' }}>
	{#snippet children(args)}
		<Button {...args}>Error Button</Button>
	{/snippet}
</Story>

<Story name='Disabled / Default' args={{ disabled: true, variant: 'primary' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled Primary Button</Button>
	{/snippet}
</Story>

<Story name='Disabled / Secondary' args={{ disabled: true, variant: 'secondary' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled Secondary Button</Button>
	{/snippet}
</Story>
