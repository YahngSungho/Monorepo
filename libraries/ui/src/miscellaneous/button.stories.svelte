<script module>
// @ts-nocheck

import { defineMeta } from '@storybook/addon-svelte-csf'

import Button from './button.svelte'

const { Story } = defineMeta({
	component: Button,
	tags: ['autodocs'],
	title: 'Miscellaneous/Buttons',
})
</script>

{#snippet multiple()}
	<div style:width="calc(100% / 2)" class="boxed">
		<Button variant="primary">Primary Button</Button>
		<Button variant="secondary">Secondary Button</Button>
		<Button variant="outline">Outline Button</Button>
		<Button variant="text">Text Button</Button>
		<Button variant="ghost">Ghost Button</Button>
		<Button variant="accent">Accent Button</Button>
		<Button variant="info">Info Button</Button>
		<Button variant="success">Success Button</Button>
		<Button variant="warning">Warning Button</Button>
		<Button variant="error">Error Button</Button>
		<Button disabled variant="primary">Disabled Primary Button</Button>
		<Button disabled variant="secondary">Disabled Secondary Button</Button>
	</div>
{/snippet}

<Story name="Bunch" asChild>
	{@render multiple()}
</Story>


<Story name="Primary">
	{#snippet template()}
		<Button variant="primary">Primary Button</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Secondary Button</Button>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Outline Button</Button>
	{/snippet}
</Story>

<Story name="Text" args={{ variant: 'text' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Text Button</Button>
	{/snippet}
</Story>

<Story name="Accent" args={{ variant: 'accent' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Accent Button</Button>
	{/snippet}
</Story>

<Story name="Info" args={{ variant: 'info' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Info Button</Button>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Success Button</Button>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Warning Button</Button>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Error Button</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, variant: 'primary' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Disabled Primary Button</Button>
	{/snippet}
</Story>

<Story name="Disabled / Secondary" args={{ disabled: true, variant: 'secondary' }}>
	{#snippet template(arguments_)}
		<Button {...arguments_}>Disabled Secondary Button</Button>
	{/snippet}
</Story>
