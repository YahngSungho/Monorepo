<script>
import './style.css'

import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import Markdown from '../default/Markdown.svelte'

const { value } = $props()

const addedPlugins = [{ remarkPlugin: [remarkMath], rehypePlugin: [rehypeKatex] }]
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet" />
</svelte:head>

<Markdown plugins={addedPlugins} {value} />
