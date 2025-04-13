<script>
import Icon from '@iconify/svelte'

let { children, icon, right = false, noMargin = false, small = false, ...restProps } = $props()

</script>

{#snippet iconElement(iconName)}
	<span class="icon-container" class:noMargin class:right class:small>
		<Icon icon={iconName}></Icon>
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
		inset-block-start: 0.4ex;

		display: inline-block;

		margin-inline-end: 0.5ch;

		font-size: 1.125em;

	&.right {
		margin-inline: 0.5ch 0;
	}

	&.noMargin {
		margin-inline: 0;
	}

	&.small {
		inset-block-start: -0.3ex;
		font-size: 0.75em;
	}
}
}
</style>
