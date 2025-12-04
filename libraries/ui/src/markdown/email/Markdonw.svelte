<script module>
import rehypeRaw from 'rehype-raw'
import smartypants from 'remark-smartypants'

import Markdown from '../default/Markdown.svelte'
import Mermaid from './mermaid.svelte'

const addedPlugins = [
	{
		rehypePlugin: rehypeRaw,
	},
	{
		remarkPlugin: smartypants,
	},
	{
		renderer: {
			mermaid: Mermaid,
		},
	},
]
</script>

<script>
let { plugins = [], value } = $props()
</script>

<Markdown plugins={[...addedPlugins, ...plugins]} {value} />
