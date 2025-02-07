<script>
import { partytownSnippet } from '@qwik.dev/partytown/integration'
import { ParaglideJS } from '@inlang/paraglide-sveltekit'
import '../base.js'
import '../base.css'

let props = $props()
let { appName, children, i18n } = props
;('') // eslint-disable-line semi, no-unused-expressions
</script>

<svelte:head>
	<!-- eslint-disable-next-line  -->
	<script>
	// Forward the necessary functions to the web worker layer
	partytown = {
		forward: [],
	}
	</script>

	<!-- eslint-disable-next-line  -->
	{@html '<script>' + partytownSnippet() + '</script>'}
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
