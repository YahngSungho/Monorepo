<script>
let { children } = $props()
</script>

<ul class='list-disc [&>li]:mt-1"'>{@render children()}</ul>

<style>
	ul {
		margin-block: var(--space-3xs-2xs);
		margin-inline: var(--space-xs-s);
	}
</style>
