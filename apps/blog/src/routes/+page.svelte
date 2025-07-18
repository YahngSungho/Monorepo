<script module>
import Button from '@library/ui/button_daisy'
import { Input } from '@library/ui/input'
import SharingButtons from '@library/ui/sharingButtons'
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'
</script>

<script>
const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())

let totalCount = $derived(allMetadata.length)
let visitedCount = $derived(allMetadata.filter((item) => item.visited).length)
let progress = $derived(Math.floor((visitedCount / totalCount) * 100))

let allMetadata_best = $derived(allMetadata.filter((item) => item.best))
let totalCount_best = $derived(allMetadata_best.length)
let visitedCount_best = $derived(allMetadata_best.filter((item) => item.visited).length)
let progress_best = $derived(Math.floor((visitedCount_best / totalCount_best) * 100))

let sharingButtonsOpen = $state(false)
</script>

<!-- <p>
	{JSON.stringify(allMetadata)}
</p> -->

<div style="display: flex; flex-flow: column wrap; gap: var(--space-em-cqi-xs-s);">
	<div>
		<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
			<h1>Best Posts</h1>
		</div>

		<div>
			<PostList allMetadata={allMetadata_best} />
		</div>
	</div>

	<div>
		<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
			<h1>Posts</h1>
		</div>

		<div>
			<PostList {allMetadata} />
		</div>
	</div>
</div>

<div id="Page_Check"></div>
