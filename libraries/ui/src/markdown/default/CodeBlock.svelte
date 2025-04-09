<script>
let { children } = $props()
</script>

<pre>{@render children()}</pre>

<style>
	pre {
		margin: var(--space-s);
	}
</style>