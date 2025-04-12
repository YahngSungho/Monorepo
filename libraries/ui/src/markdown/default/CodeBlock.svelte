<script>
let { children } = $props()
</script>

<pre>{@render children()}</pre>

<style>
	pre {
		margin: var(--space-em-cqi-xs-s);
		padding: var(--space-em-cqi-s-l);
		background-color: var(--gray-12);
		color: var(--gray-1);
	}
</style>