<script>
import '@library/base/base.css'

import { css } from '@emotion/css'
import { partytownSnippet } from '@qwik.dev/partytown/integration'
import * as Sentry from '@sentry/sveltekit'
import { ModeWatcher } from 'mode-watcher'

import { Toaster } from '$shadcn/components/ui/sonner/index'

import { init } from './base.js'

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
	<ModeWatcher />
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
					right: 0 !important;
					top: -10px !important;
					color: var(--foreground) !important;
				`,
				icon: css`
					top: 0.15em;
					color: var(--foreground) !important;
				`,
			},
		}}
		visibleToasts={9}
	/>
	<div id="Top_Layout_Check"></div>
</div>
