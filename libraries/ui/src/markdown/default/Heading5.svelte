<script>
let { children, ...rest } = $props()
</script>

<h5 {...rest}>
	{@render children()}
</h5>
