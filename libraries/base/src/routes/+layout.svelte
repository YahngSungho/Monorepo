<script>
import '../base.css'

import { partytownSnippet } from '@qwik.dev/partytown/integration'

import { init } from '../base'

init()

// @ts-ignore
const { appName, children } = $props()

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

<div>
	{@render children()}
	<div id="Top_Layout_Check"></div>
</div>
