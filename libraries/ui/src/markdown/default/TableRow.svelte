<script>
let { children, ...rest } = $props()
</script>

<tr {...rest}>
	{@render children()}
</tr>

<style>
tr {
	border-block-end: 1px solid var(--color-neutral);

&:hover {
	background-color: var(--color-base-200);
}
}
</style>
