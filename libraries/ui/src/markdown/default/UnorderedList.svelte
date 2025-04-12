<script>
let { children } = $props()
</script>

<ul class='list-disc [&>li]:mt-1"'>{@render children()}</ul>

<style>
	ul {
		margin-block: var(--space-em-cqi-3xs-2xs);
		margin-inline: var(--space-em-cqi-s-l);
	}
</style>
