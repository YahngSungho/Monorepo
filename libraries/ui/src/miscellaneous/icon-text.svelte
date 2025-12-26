<script>
import { cx } from '@emotion/css'

let {
	alone = false,
	bottom = false,
	children = null,
	class: incomingClass = '',
	iconAnimation = '',
	iconName = '',
	iconProps: iconProperties = {},
	noMargin = false,
	right = false,
	small = false,
	text = '',
	...restProperties
} = $props()
</script>

{#snippet iconElement()}
	<span
		class="icon-container"
		class:alone={alone || (!children && !text)}
		class:bottom
		class:iconShakeY={iconAnimation === 'shake-y'}
		class:noMargin
		class:right
		class:small
	>
		<span>
			{#if iconName}
				<iconify-icon icon={iconName} {...iconProperties}></iconify-icon>
			{/if}
		</span>
	</span>
{/snippet}

<span class={cx('with-icon', incomingClass)} {...restProperties}>
	{#if right}
		{#if children}
			{@render children()}
		{:else if text}
			{text}
		{/if}
		{@render iconElement()}
	{:else}
		{@render iconElement()}
		{#if children}
			{@render children()}
		{:else if text}
			{text}
		{/if}
	{/if}
</span>

<style>
.with-icon {
	display: inline-flex;
	align-items: baseline;

	& .icon-container {
		position: relative;
		inset-block-start: 0.4ex;

		display: inline-block;
		flex-shrink: 0;

		margin-inline-end: 0.5ch;

		font-size: 1.2em;
		color: color-mix(in srgb, currentcolor 80%, transparent);

		&.iconShakeY {
			animation: var(--animation-shake-y);
			animation-duration: 5s;
			animation-iteration-count: infinite;
		}

		&.alone {
			margin-inline-end: 0;
		}

		&.right {
			margin-inline: 0.5ch 0;
		}

		&.noMargin {
			margin-inline: 0;
		}

		&.small {
			inset-block-start: -0.4ex;
			font-size: 0.8em;

			&.bottom {
				inset-block-start: 0;
			}
		}

		& > span {
			display: inline-block;
			inline-size: 1em;
			block-size: 1em;
		}
	}
}
</style>
