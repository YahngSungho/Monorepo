<script>
	const { children, ...rest } = $props();
</script>

<strong {...rest}>{@render children()}</strong>
