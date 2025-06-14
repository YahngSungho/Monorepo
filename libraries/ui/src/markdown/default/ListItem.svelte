<script>
	const { children, ...rest } = $props();
</script>

<li {...rest}>{@render children()}</li>
