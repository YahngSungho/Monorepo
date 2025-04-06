<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from '@storybook/test';

	// Import the .svx file directly. MDSvex preprocesses it into a Svelte component.M
	// Note: The "Cannot find module" error below is likely a TypeScript configuration issue
	// for .svx files and needs to be addressed in tsconfig or type declarations.
	import SampleSvx from './sample.svx';

	// Since .svx files don't use $props() in the standard Svelte way,
	// we don't define a specific props interface for defineMeta.
	// Args and ArgTypes will be minimal.
	const { Story } = defineMeta({
		title: 'UI/MDSvex/Sample', // Storybook sidebar path
		// @ts-ignore - Storybook 타입과 SvelteComponent 타입 불일치 무시
		component: SampleSvx, // The preprocessed .svx file
		tags: ['autodocs'], // Enable automatic documentation generation
		// No args needed as we can't control frontmatter via props
		args: {},
		// No argTypes needed for component props
		argTypes: {},
		parameters: {
			layout: 'fullscreen', // Use fullscreen layout suitable for document rendering
			docs: {
				description: {
					component:
						'Story demonstrating rendering an MDSvex (`.svx`) file. This file mixes Markdown and Svelte 5 (Runes) syntax. The story tests if the Svelte parts are interactive within Storybook.',
				},
			},
			// Enable accessibility addon checks
			a11y: {
				element: '#storybook-root', // Or tighter selector if needed
				config: {
					rules: [], // Add specific rules to disable/enable if necessary
				},
				options: {},
			},
		},
	});
</script>

<!-- Story to show the basic rendered output of the .svx file -->
<Story name="Default Rendering" />

<!-- Story to test the interactive Svelte elements within the .svx file -->
<Story
	name="Interactive Test"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Find the button defined within the Svelte script block of the .svx file
		// Note: Ensure the button text matches exactly, including Korean characters.
		const counterButton = canvas.getByRole('button', { name: '카운트 증가' });

		// Initial State Check
		// Check the paragraph displaying the count state
		const initialCountDisplay = canvas.getByText('현재 카운트: 0');
		await expect(initialCountDisplay).toBeInTheDocument();
		// Check the derived message display
		const initialDerivedDisplay = canvas.getByText('계산된 메시지: 계산된 값의 두 배는 0입니다.');
		await expect(initialDerivedDisplay).toBeInTheDocument();

		// Click counter button once
		await userEvent.click(counterButton);

		// Verify count update after first click
		// Assert that the $state variable 'count' updated in the DOM
		const firstClickCountDisplay = canvas.getByText('현재 카운트: 1');
		await expect(firstClickCountDisplay).toBeInTheDocument();
		// Assert that the $derived variable 'derivedMessage' updated
		const firstClickDerivedDisplay = canvas.getByText('계산된 메시지: 계산된 값의 두 배는 2입니다.');
		await expect(firstClickDerivedDisplay).toBeInTheDocument();

		// Click counter button again
		await userEvent.click(counterButton);

		// Verify count update after second click
		// Assert that the $state variable 'count' updated again
		const secondClickCountDisplay = canvas.getByText('현재 카운트: 2');
		await expect(secondClickCountDisplay).toBeInTheDocument();
		// Assert that the $derived variable 'derivedMessage' updated again
		const secondClickDerivedDisplay = canvas.getByText('계산된 메시지: 계산된 값의 두 배는 4입니다.');
		await expect(secondClickDerivedDisplay).toBeInTheDocument();
	}}
/>