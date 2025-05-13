<script>
import 'iconify-icon'

let { children, icon, right = false, noMargin = false, small = false, ...restProps } = $props()
</script>

{#snippet iconElement(iconName)}
	<span class="icon-container" class:noMargin class:right class:small>
		<iconify-icon class="iconify-icon" icon={iconName}></iconify-icon>
	</span>
{/snippet}

<span class="with-icon" {...restProps}>
	{#if right}
		{@render children?.()}
		{@render iconElement(icon)}
	{:else}
		{@render iconElement(icon)}
		{@render children?.()}
	{/if}
</span>

<style>
.with-icon {
	display: inline-flex;
	align-items: baseline;

	& .icon-container {
		position: relative;
		inset-block-start: 0.3ex;

		display: inline-block;
		flex-shrink: 0;

		inline-size: 1em;
		block-size: 1em;
		margin-inline-end: 0.5ch;

		font-size: 1em;

		&.right {
			margin-inline: 0.5ch 0;
		}

		&.noMargin {
			margin-inline: 0;
		}

		&.small {
			inset-block-start: -0.3ex;
			inline-size: 0.75em;
			block-size: 0.75em;
			font-size: 0.75em;
		}
	}
}
</style>
