<script>
let { children, ...restProps } = $props()
</script>

<pre>{@render children()}</pre>

<style>
	pre {
		margin: var(--space-em-cqi-xs-s);
		padding: var(--space-em-cqi-s-l);
		color: var(--gray-0);
		background-color: var(--gray-12);
	}
</style>