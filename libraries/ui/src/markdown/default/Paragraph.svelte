<script>
	const { children, ...rest } = $props();
</script>

<p {...rest}>{@render children()}</p>
