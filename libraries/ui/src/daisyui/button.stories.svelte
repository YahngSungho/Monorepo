<script module>
// @ts-nocheck

import { defineMeta } from '@storybook/addon-svelte-csf'

import Button from './button.svelte'

const { Story } = defineMeta({
	component: Button,
	tags: ['autodocs'],
})

;('') // eslint-disable-line
</script>

{#snippet multiple()}
	<div style:width="calc(100% / 2)" class="boxed">
		<Button variant="primary">Primary Button</Button>
		<Button variant="secondary">Secondary Button</Button>
		<Button variant="outline">Outline Button</Button>
		<Button variant="text">Text Button</Button>
		<Button variant="accent">Accent Button</Button>
		<Button variant="info">Info Button</Button>
		<Button variant="success">Success Button</Button>
		<Button variant="warning">Warning Button</Button>
		<Button variant="error">Error Button</Button>
		<Button disabled variant="primary">Disabled Primary Button</Button>
		<Button disabled variant="secondary">Disabled Secondary Button</Button>
	</div>
{/snippet}

<!-- Todo: 여러 컴포넌트 추가하는거 storybook.mdx에 설명 추가 -->
<Story name="Bunch">
	{@render multiple()}
</Story>

<Story name="Primary">
	{#snippet children()}
		<Button variant="primary">Primary Button</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
	{#snippet children(args)}
		<Button {...args}>Secondary Button</Button>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet children(args)}
		<Button {...args}>Outline Button</Button>
	{/snippet}
</Story>

<Story name="Text" args={{ variant: 'text' }}>
	{#snippet children(args)}
		<Button {...args}>Text Button</Button>
	{/snippet}
</Story>

<Story name="Accent" args={{ variant: 'accent' }}>
	{#snippet children(args)}
		<Button {...args}>Accent Button</Button>
	{/snippet}
</Story>

<Story name="Info" args={{ variant: 'info' }}>
	{#snippet children(args)}
		<Button {...args}>Info Button</Button>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet children(args)}
		<Button {...args}>Success Button</Button>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet children(args)}
		<Button {...args}>Warning Button</Button>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	{#snippet children(args)}
		<Button {...args}>Error Button</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, variant: 'primary' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled Primary Button</Button>
	{/snippet}
</Story>

<Story name="Disabled / Secondary" args={{ disabled: true, variant: 'secondary' }}>
	{#snippet children(args)}
		<Button {...args}>Disabled Secondary Button</Button>
	{/snippet}
</Story>
