<script>
	import 'rehype-callouts/theme/github'
	import './style.css'

	import rehypeCallouts from 'rehype-callouts'

	import Markdown from '../default/Markdown.svelte'

	const { value } = $props()

	const addedPlugins = [
		{ rehypePlugin: [rehypeCallouts, { theme: 'github' }] }
	]
</script>

<Markdown plugins={addedPlugins} {value} />
