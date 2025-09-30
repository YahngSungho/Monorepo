<script module>
import './style.css'

import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langCss from 'shiki/langs/css.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langSvelte from 'shiki/langs/svelte.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import themeDark from 'shiki/themes/vitesse-dark.mjs'
import themeLight from 'shiki/themes/vitesse-light.mjs'

import Markdown from '../default/Markdown.svelte'
import Mermaid from './mermaid.svelte'

const highlighter = createHighlighterCoreSync({
	engine: createJavaScriptRegexEngine(),
	langs: [langTs, langHtml, langCss, langSvelte],
	themes: [themeLight, themeDark],
})

const shikiPlugin = {
	rehypePlugin: [
		rehypeShikiFromHighlighter,
		highlighter,
		{
			themes: {
				dark: 'vitesse-light',
				light: 'vitesse-dark',
			},
		},
	],
}

const addedPlugins = [
	{
		renderer: {
			mermaid: Mermaid,
		},
	},
	{
		rehypePlugin: [rehypeAutolinkHeadings, { behavior: 'append' }],
	},
	shikiPlugin,
	{
		rehypePlugin: rehypeRaw,
	},
]
</script>

<script>
import { setContext } from 'svelte'
import { page } from '$app/state'

let { mermaidSVGObject = {}, plugins = [], value } = $props()

let mermaidContext = $state({})

$effect(() => {
	const source = mermaidSVGObject ?? {}
	for (const key of Object.keys(mermaidContext)) {
		if (!(key in source)) {
			delete mermaidContext[key]
		}
	}
	for (const key in source) {
		mermaidContext[key] = source[key]
	}
})

setContext('mermaidSVGObject', mermaidContext)

function scheduleReanchor_action() {
	const hash = (page?.url?.hash ?? '').slice(1)
	if (!hash) return
	const id = decodeURIComponent(hash)
	const target = typeof document === 'undefined' ? null : document.getElementById(id)
	if (!target) return
	target.scrollIntoView({ block: 'start' })
}

setContext('scheduleReanchor_action', scheduleReanchor_action)
</script>

<Markdown plugins={[...addedPlugins, ...plugins]} {value} />
