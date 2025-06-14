<script>
	const { children, ...rest } = $props();
</script>

<tr {...rest}>
	{@render children()}
</tr>
