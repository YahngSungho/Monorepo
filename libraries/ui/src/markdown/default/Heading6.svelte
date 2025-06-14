<script>
	const { children, ...rest } = $props();
</script>

<h6 {...rest}>
	{@render children()}
</h6>
