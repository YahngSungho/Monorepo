<script>
let { children, ...rest } = $props()
</script>

<h2 {...rest}>
	{@render children()}
</h2>
