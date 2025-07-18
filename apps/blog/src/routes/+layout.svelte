<script>
import '@library/base/fontStyle.css'

import { R } from '@library/helpers/R'
import { getLocale, setLocale } from '@library/paraglide/helpers'
import BaseLayout from '@library/ui/layouts/root'
import Link from '@library/ui/link'
import VariationSetter from '@library/ui/variationSetter'
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
		R.sort(R.descend(R.prop('date'))),
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

let totalCount = $derived(allMetadata.length)
let visitedCount = $derived(allMetadata.filter(item => item.visited).length)
let progress = $derived(Math.floor((visitedCount / totalCount) * 100))
</script>

<svelte:head>
	<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
	<title>sungho.blog</title>
</svelte:head>

<BaseLayout appName={APP_NAME}>
	<div class="with-sidebar">
		<div style="display: flex; flex-flow: column; gap: var(--space-em-cqi-xs-s);" class="sidebar boxed">
			<div style="display: flex; flex-direction: column;">
				<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
				<div style="font-size: var(--font-size-fluid-em-cqi-02);">
					sunghoyahng@gmail.com
				</div>
				<div style=" display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
					<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
					<Link style="font-size: var(--font-size-fluid-em-cqi-5); font-weight: 900;" href="/">
						sungho.blog
					</Link>
				</div>
			</div>

			<div style="--value:{progress}; --size: 10em; --thickness: 1em;

			position: absolute;
			inset-block-end: 0;
			inset-inline-end: 0;
			transform: scaleX(-1) scaleY(-1);
			" class="radial-progress" class:progress_0={progress === 0} class:progress_100={progress === 100} aria-valuenow={progress} role="progressbar"></div>

	<div>
		<VariationSetter {getLocale} {setLocale} />
	</div>


		</div>

		<div class="main boxed gutter">
			{@render children()}
		</div>
	</div>
	<div id="Top2_Layout_Check"></div>
</BaseLayout>

<style>
.progress_0 {
	opacity: 0;
}

.progress_100 {
	color: var(--color-success);
}

.sidebar {
	display: flex;
	flex-direction: column;
	gap: var(--space-em-cqi-m);
	padding: var(--space-em-cqi-m);
	/* border: 2px dashed black; */
}

.main {
	overflow: auto;
	padding: var(--space-em-cqi-m);
}

	.with-sidebar {
  display: flex;
  flex-wrap: wrap;
	gap: 0;

& > :first-child {
  flex-basis: var(--size-content-2);
  flex-grow: 1;
	max-block-size: 100svb;
}

& > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 70%;
	min-block-size: 100svb;
}

}
</style>
