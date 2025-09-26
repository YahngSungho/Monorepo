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
	{#snippet template(args)}
		<Button {...args}>Secondary Button</Button>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args)}
		<Button {...args}>Outline Button</Button>
	{/snippet}
</Story>

<Story name="Text" args={{ variant: 'text' }}>
	{#snippet template(args)}
		<Button {...args}>Text Button</Button>
	{/snippet}
</Story>

<Story name="Accent" args={{ variant: 'accent' }}>
	{#snippet template(args)}
		<Button {...args}>Accent Button</Button>
	{/snippet}
</Story>

<Story name="Info" args={{ variant: 'info' }}>
	{#snippet template(args)}
		<Button {...args}>Info Button</Button>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet template(args)}
		<Button {...args}>Success Button</Button>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet template(args)}
		<Button {...args}>Warning Button</Button>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	{#snippet template(args)}
		<Button {...args}>Error Button</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, variant: 'primary' }}>
	{#snippet template(args)}
		<Button {...args}>Disabled Primary Button</Button>
	{/snippet}
</Story>

<Story name="Disabled / Secondary" args={{ disabled: true, variant: 'secondary' }}>
	{#snippet template(args)}
		<Button {...args}>Disabled Secondary Button</Button>
	{/snippet}
</Story>
