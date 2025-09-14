<script>
	import Markdown from '../markdown/blog/Markdown.svelte'

	let { value, mermaidSVGObject = {} } = $props()
</script>

<Markdown value={value} mermaidSVGObject={mermaidSVGObject} />