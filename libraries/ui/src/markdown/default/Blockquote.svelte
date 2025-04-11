<script>
let { children } = $props()
</script>

<blockquote>{@render children()}</blockquote>

<style>
	blockquote {
		margin: var(--space-xs-s);
	}
</style>
