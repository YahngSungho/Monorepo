<script>
import { css } from '@emotion/css'
import { partytownSnippet } from '@qwik.dev/partytown/integration'
import * as Sentry from '@sentry/sveltekit'
import { ModeWatcher } from 'mode-watcher'
import { onMount } from 'svelte'

import { browser } from '$app/environment'
import { onNavigate } from '$app/navigation'
import { Toaster } from '$shadcn/components/ui/sonner/index'

import { init } from './base.js'
// Warn: 여기서 default로 가져오는 게 늘면 emailContent/emialContent.svelte에도 추가해야 할 수 있음

let { appName, children } = $props()

Sentry.setTag('App Name', appName)

onMount(() => {
	init(appName)

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
			description: '',
			icon: css`
				inset-block-start: 0.15em;
				color: var(--foreground) !important;
			`,
			title: css`
				font-weight: var(--font-weight-semibold);
			`,
			toast: css`
				cursor: default;
				align-items: flex-start;
			`,
		},
	}}
	visibleToasts={9}
/>
<div id="Top_Layout_Check"></div>
