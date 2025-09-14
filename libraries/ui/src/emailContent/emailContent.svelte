<script>
import Markdown from '../markdown/blog/Markdown.svelte'

let { mermaidSVGObject = {}, value } = $props()
</script>

<Markdown {mermaidSVGObject} {value} />