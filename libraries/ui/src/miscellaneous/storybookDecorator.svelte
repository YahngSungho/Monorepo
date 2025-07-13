<script>
let { children } = $props()
</script>

<div style="margin: 1rem; border: 1px solid black;">
	{@render children?.()}
</div>
