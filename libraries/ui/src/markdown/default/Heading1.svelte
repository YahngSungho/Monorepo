<script>
const { children, ...rest } = $props()
</script>

<h1 {...rest}>
	{@render children()}
</h1>
