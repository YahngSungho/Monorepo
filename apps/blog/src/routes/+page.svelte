<script module>
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'
</script>

<script>
const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())
let allMetadata_pinned = $derived(allMetadata.filter((item) => item.pinned))
</script>

<!-- <p>
	{JSON.stringify(allMetadata)}
</p> -->

<div style="display: flex; flex-flow: column wrap; gap: var(--space-em-cqi-xs-s);">
	<div>
		<h1>고정된 포스트</h1>

		<div>
			<PostList allMetadata={allMetadata_pinned} />
		</div>
	</div>

	<div>
		<h1>포스트</h1>

		<div>
			<PostList {allMetadata} />
		</div>
	</div>
</div>

<div id="Page_Check"></div>
