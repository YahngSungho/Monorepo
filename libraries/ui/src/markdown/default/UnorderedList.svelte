<script>
let { children } = $props()
</script>

<ul class='list-disc [&>li]:mt-2"'>{@render children()}</ul>

<style>
	ul {
		margin: var(--space-xs-s);
	}
</style>
