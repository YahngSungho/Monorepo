<script module>
import './style.css'

import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langCss from 'shiki/langs/css.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langSvelte from 'shiki/langs/svelte.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import themeDark from 'shiki/themes/vitesse-dark.mjs'
import themeLight from 'shiki/themes/vitesse-light.mjs'

import Markdown from '../default/Markdown.svelte'
import Mermaid from '../../miscellaneous/mermaid/Mermaid.svelte'

const highlighter = createHighlighterCoreSync({
	themes: [themeLight, themeDark],
	langs: [langTs, langHtml, langCss, langSvelte],
	engine: createJavaScriptRegexEngine(),
})

const shikiPlugin = {
	rehypePlugin: [
		rehypeShikiFromHighlighter,
		highlighter,
		{
			themes: {
				light: 'vitesse-dark',
				dark: 'vitesse-light',
			},
		},
	],
}

const addedPlugins = [
	{
		rehypePlugin: rehypeRaw,
	},
	{
		renderer: {
			mermaid: Mermaid,
		},
	},
	{
		rehypePlugin: rehypeSlug,
	},
	{
		rehypePlugin: [rehypeAutolinkHeadings, { behavior: 'append' }],
	},
	shikiPlugin,
]

function removeFrontmatter(markdown) {
	return markdown.replace(/^---[\s\S]*?---/, '')
}
</script>

<script>
let { value, plugins = [] } = $props()
</script>

<Markdown plugins={[...addedPlugins, ...plugins]} value={removeFrontmatter(value)} />
