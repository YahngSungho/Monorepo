<script>
let { children, ...rest } = $props()
</script>

<tr {...rest}>
	{@render children()}
</tr>

<style>
	tr {
		border-block-end: 1px solid var(--color-neutral);
	}
</style>