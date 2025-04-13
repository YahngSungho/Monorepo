<script module>
// JAVASCRIPT ONLY - NO lang="ts"
import { defineMeta } from '@storybook/addon-svelte-csf'

import IconComponent from './icon.svelte' // Import the target component

// defineMeta defines component metadata
const { Story } = defineMeta({
	title: 'Custom/Icon', // Storybook hierarchy path
	component: IconComponent,
	argTypes: {
		// Basic controls for props
		icon: { control: 'text', description: 'Iconify icon name (e.g., mdi:home)' },
		right: { control: 'boolean' },
		noMargin: { control: 'boolean' },
		small: { control: 'boolean' },
		children: { control: 'text', description: 'Text content for the default slot' },
	},
	tags: ['autodocs'], // Enable automatic documentation generation
})
</script>

<!-- Shared snippet for rendering -->
{#snippet template(args)}
	<!-- If children arg exists, pass it as slot content, otherwise render only the icon -->
	{#if args.children}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<IconComponent {...args}>{@html args.children}</IconComponent>
	{:else}
		<IconComponent {...args} />
	{/if}
{/snippet}

<!-- Happy Path Stories -->
<Story
	name="Default"
	args={{
		icon: 'mdi:home',
		children: 'Home',
	}}
	children={template}
/>

<Story
	name="IconOnly"
	args={{
		icon: 'mdi:check-circle-outline',
	}}
	children={template}
/>

<Story
	name="RightAligned"
	args={{
		icon: 'mdi:arrow-right',
		right: true,
		children: 'Continue',
	}}
	children={template}
/>

<!-- Boundary/Edge Case Stories -->
<Story
	name="SmallIcon"
	args={{
		icon: 'mdi:information',
		small: true,
		children: 'Info',
	}}
	children={template}
/>

<Story
	name="NoMargin"
	args={{
		icon: 'mdi:close',
		noMargin: true,
		children: 'Close',
	}}
	children={template}
/>

<Story
	name="SmallRightNoMargin"
	args={{
		icon: 'mdi:pencil',
		small: true,
		right: true,
		noMargin: true,
		children: 'Edit',
	}}
	children={template}
/>

<!-- Invalid Input Case Stories -->
<Story
	name="InvalidIconName"
	args={{
		icon: 'non-existent:icon-hopefully', // Behavior depends on Iconify
		children: 'Invalid Icon?',
	}}
	children={template}
/>

<Story
	name="UndefinedIcon"
	args={{
		icon: undefined, // Test how component handles undefined prop
		children: 'Undefined Icon Prop',
	}}
	children={template}
/>

<Story
	name="NullIcon"
	args={{
		icon: undefined, // Test how component handles undefined prop
		children: 'Null Icon Prop',
	}}
	children={template}
/>

<Story
	name="EmptyStringIcon"
	args={{
		icon: '', // Test how component handles empty string prop
		children: 'Empty String Icon Prop',
	}}
	children={template}
/>

<!-- Negative Path -->
<Story
	name="TextOnlyNoIcon"
	args={{
		// icon prop intentionally omitted or set to undefined/null
		icon: undefined,
		children: 'Rendering text without a valid icon prop',
	}}
	children={template}
/>

<!-- Stress Test Case -->
<Story
	name="StressTestLongText"
	args={{
		icon: 'mdi:home',
		children:
			'This is extremely long text designed to test how the component layout behaves when the content next to the icon is significantly lengthy. '.repeat(
				10,
			),
	}}
	children={template}
/>
