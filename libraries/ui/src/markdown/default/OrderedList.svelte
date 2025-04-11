<script>
let { start = undefined, children } = $props()
</script>

<ol class="list-decimal [&>li]:mt-2" {start}>{@render children()}</ol>

<style>
	ol {
		margin: var(--space-xs-s);
	}
</style>
