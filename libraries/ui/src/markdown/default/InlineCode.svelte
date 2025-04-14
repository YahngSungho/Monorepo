<script>
let { children } = $props()
</script>

<code>{@render children()}</code>

<style>
code {
	border-radius: 0;
	color: var(--gray-0);
	background-color: var(--gray-12);
}
</style>
