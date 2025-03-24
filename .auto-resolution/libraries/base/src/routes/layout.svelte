<script>
import '../base.css'

import { partytownSnippet } from '@qwik.dev/partytown/integration'
import * as Sentry from '@sentry/sveltekit'

import { init } from '../base'

init()

const { appName, children } = $props()
Sentry.setTag('App Name', appName)
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
