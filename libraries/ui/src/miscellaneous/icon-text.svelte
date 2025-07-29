<script module>

</script>


<script>
let {
	children = null,
	text = '',
	iconName = '',
	iconProps = {},
	right = false,
	noMargin = false,
	small = false,
	...restProps
} = $props()
</script>

{#snippet iconElement()}
	<span class="icon-container" class:noMargin class:right class:small>
		{#if iconName}
			<iconify-icon icon={iconName} {...iconProps}></iconify-icon>
		{/if}
	</span>
{/snippet}

<span class="with-icon" {...restProps}>
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
:dir(rtl) .icon-container {
	transform: scaleX(-1);
}

.with-icon {
	display: inline-flex;
	align-items: baseline;

	& .icon-container {
		position: relative;
		inset-block-start: 0.45ex;

		display: inline-block;
		flex-shrink: 0;

		inline-size: 1em;
		block-size: 1em;
		margin-inline-end: 0.5ch;

		font-size: 1.2em;
		color: color-mix(in srgb, currentcolor 60%, transparent);

		&.right {
			margin-inline: 0.5ch 0;
		}

		&.noMargin {
			margin-inline: 0;
		}

		&.small {
			inset-block-start: -0.4ex;
			inline-size: 1em;
			block-size: 1em;
			font-size: 0.8em;
		}
	}
}
</style>
