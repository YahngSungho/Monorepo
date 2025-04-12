<script>
	import Markdown from './Markdown.svelte'

	let { children } = $props()
</script>

<div>
	{@render children()}
</div>

<style>
	div {
		color: red;
	}
</style>
