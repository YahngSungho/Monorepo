<script>
import '@library/base/base.css'
import 'iconify-icon'

import { css } from '@emotion/css'
import { partytownSnippet } from '@qwik.dev/partytown/integration'
import * as Sentry from '@sentry/sveltekit'
import { ModeWatcher } from 'mode-watcher'
import { onMount } from 'svelte'

import { browser } from '$app/environment'
import { onNavigate } from '$app/navigation'
import { Toaster } from '$shadcn/components/ui/sonner/index'

import { init } from './base.svelte.js'

let { appName, children } = $props()

Sentry.setTag('App Name', appName)

onMount(() => {
	init()


	if (browser) {
		onNavigate((navigation) => {
			if (!document.startViewTransition) {
				return
			}

			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve()
					await navigation.complete
				})
			})
		})
	}
})
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

<ModeWatcher />
{@render children()}
<Toaster
	closeButton
	hotkey={['']}
	position="bottom-center"
	toastOptions={{
		classes: {
			toast: css`
				cursor: default;
				align-items: flex-start;
			`,
			title: css`
				font-weight: var(--font-weight-semibold);
			`,
			description: '',
			actionButton: '',
			cancelButton: '',
			closeButton: css`
				inline-size: 20px !important;
				block-size: 20px !important;
				inset-block-start: -10px !important;
				inset-block-end: auto !important;
				inset-inline-end: 0 !important;
				inset-inline-start: auto !important;
				transform: none !important;
				color: var(--foreground) !important;
			`,
			icon: css`
				inset-block-start: 0.15em;
				color: var(--foreground) !important;
			`,
		},
	}}
	visibleToasts={9}
/>
<div id="Top_Layout_Check"></div>
