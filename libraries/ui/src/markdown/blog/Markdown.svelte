<script>
	import './style.css'

	import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
	import rehypeAutolinkHeadings from 'rehype-autolink-headings'
	import rehypeRaw from 'rehype-raw';
	import rehypeSlug from 'rehype-slug'
	import { createHighlighterCoreSync } from 'shiki/core'
	import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
	import langCss from 'shiki/langs/css.mjs'
	import langHtml from 'shiki/langs/html.mjs'
	import langSvelte from 'shiki/langs/svelte.mjs'
	// Import languages
	import langTs from 'shiki/langs/typescript.mjs'
	import themeDark from 'shiki/themes/vitesse-dark.mjs'
	// Import themes
	import themeLight from 'shiki/themes/vitesse-light.mjs'


	import Markdown from '../default/Markdown.svelte'
	import Mermaid from './Mermaid.svelte'

	const { value, plugins = [] } = $props()

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
					dark: 'vitesse-dark',
				},
			},
		],
	}

	const addedPlugins = [
		{
			rehypePlugin: rehypeRaw,
		},
{
			rehypePlugin: rehypeSlug,
		},
		{
			rehypePlugin: [rehypeAutolinkHeadings, { behavior: 'append'}],
		},
		shikiPlugin,
		...plugins,
				{
			renderer: {
				mermaid: Mermaid
			},
		},
	]

</script>

<Markdown plugins={addedPlugins} {value} />
