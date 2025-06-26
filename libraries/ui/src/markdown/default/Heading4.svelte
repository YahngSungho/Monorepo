<script>
const { children, ...rest } = $props()
</script>

<h4 {...rest}>
	{@render children()}
</h4>
