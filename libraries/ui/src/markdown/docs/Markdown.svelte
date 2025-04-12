<script>
	import Markdown from '../default/Markdown.svelte'

	const { value } = $props()

	const addedPlugins = []
</script>

<Markdown {value} plugins={addedPlugins} />
