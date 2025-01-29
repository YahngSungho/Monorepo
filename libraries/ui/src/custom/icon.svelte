<script>
	let { children, icon, ...restProps } = $props()

	;('') // eslint-disable-line no-unused-expressions, semi
</script>

<span class="with-icon" {...restProps}>
	<iconify-icon class="icon" {icon}></iconify-icon>
	{@render children?.()}
</span>

<style>
	.icon {
		inline-size: 0.75em;
		inline-size: 1cap;
		block-size: 0.75em;
		block-size: 1cap;

		font-size: 1.125em;
	}

	.with-icon {
		display: inline-flex;
		align-items: baseline;

		& .icon {
			position: relative;
			/* IBM Plex Sans 기준 */
			inset-block-end: 0.125em;
			margin-inline-end: 0.5em;
		}
	}
</style>
