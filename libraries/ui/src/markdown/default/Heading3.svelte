<script>
let { children, ...rest } = $props()
</script>

<h3 {...rest}>
	{@render children()}
</h3>
