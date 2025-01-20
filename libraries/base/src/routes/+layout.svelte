<script>
// @ts-nocheck

import { partytownSnippet } from '@qwik.dev/partytown/integration'
import { createI18n, ParaglideJS } from '@inlang/paraglide-sveltekit'
import * as runtime from '../lib/paraglide/runtime.js'
import '../base.js'
import '../base.css'

const i18n = createI18n(runtime)

let { appName, children } = $props()
''; // eslint-disable-line semi, no-unused-expressions
</script>

<svelte:head>

	<!-- eslint-disable-next-line  -->
	<script>
		// Forward the necessary functions to the web worker layer
		partytown = {
		forward: []
		}
	</script>

	<!-- eslint-disable-next-line  -->
	{@html '<script>' + partytownSnippet() + '</script>'}
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
