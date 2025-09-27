<script>
let { children } = $props()
</script>

<div style:margin="1rem" style:border="1px dotted gray">
	{@render children?.()}
</div>
