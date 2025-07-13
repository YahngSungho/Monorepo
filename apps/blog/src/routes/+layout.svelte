<script>
import '@library/base/fontStyle.css'

import { R } from '@library/helpers/R'
import BaseLayout from '@library/ui/layouts/root'
import store from 'store'
import { onMount, setContext } from 'svelte'

import { APP_NAME } from './base'

/** @type {import('./$types').LayoutProps} */
let { children, data } = $props()

let visited = $state({})

onMount(() => {
	visited = store.get('visited') || {}
})

const allMetadata = $derived.by(() => {
	if (!data.allMetadata) return {}
	return R.pipe(
		data.allMetadata,
		Object.values,
		R.map((metadata) => ({
			...metadata,
			visited: !!visited[metadata.slug],
		})),
	)
})

function markAsVisited(slug) {
	if (!slug || visited[slug]) return
	const newVisited = { ...visited, [slug]: true }
	store.set('visited', newVisited)
	visited = newVisited
}

setContext('getAllMetadata', () => allMetadata)
setContext('markAsVisited', markAsVisited)
</script>

<svelte:head>
	<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
	<title>sungho.blog</title>
</svelte:head>

<BaseLayout appName={APP_NAME}>
	{@render children()}
	<div id="Top2_Layout_Check"></div>
</BaseLayout>
