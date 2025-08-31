<script>
let { children, ...restProps } = $props()
</script>

<div class="marginBlock-1">
	<pre {...restProps}>{@render children()}</pre>
</div>

<style>
pre {
	padding: var(--space-em-cqi-s-l);
	color: var(--gray-0);
	background-color: var(--gray-12);
}
</style>
