<script module>
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'
</script>

<script>
const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())
let allMetadata_best = $derived(allMetadata.filter((item) => item.best))
</script>

<!-- <p>
	{JSON.stringify(allMetadata)}
</p> -->

<div style="display: flex; flex-flow: column wrap; gap: var(--space-em-cqi-xs-s);">
	<div>
		<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
			<h1>고정된 포스트</h1>
		</div>

		<div>
			<PostList allMetadata={allMetadata_best} />
		</div>
	</div>

	<div>
		<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
			<h1>포스트</h1>
		</div>

		<div>
			<PostList {allMetadata} />
		</div>
	</div>
</div>

<div id="Page_Check"></div>
