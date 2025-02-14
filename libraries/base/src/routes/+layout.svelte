<script>
import '../base.css'

import { ParaglideJS } from '@inlang/paraglide-sveltekit'
import { partytownSnippet } from '@qwik.dev/partytown/integration'

import { init } from '../base'

init()

const props = $props()
const { appName, children, i18n } = props
;('') // eslint-disable-line no-unused-expressions
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
	<div id="Top_Layout_Check"></div>
</ParaglideJS>
