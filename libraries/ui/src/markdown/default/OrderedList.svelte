<script>
let { start = undefined, children } = $props()
</script>

<ol class="list-decimal [&>li]:mt-1" {start}>{@render children()}</ol>

<style>
	ol {
		margin-block: var(--space-3xs-2xs);
		margin-inline: var(--space-xs-s);
	}
</style>
