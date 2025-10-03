<script module>
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'
</script>

<script>
import { slide } from 'svelte/transition'

const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())
let allMetadata_pinned = $derived(allMetadata.filter((item) => item.pinned))
let pinnedPostsOpen = $state(true)
let postsOpen = $state(true)
</script>

<!-- <p>
	{JSON.stringify(allMetadata)}
</p> -->

<div style="display: flex; flex-flow: column wrap; gap: var(--space-em-cqi-xs-s);">
	<div>
		<h1><button onclick={() => (pinnedPostsOpen = !pinnedPostsOpen)}>고정된 포스트</button></h1>

		{#if pinnedPostsOpen}
			<div transition:slide={{ duration: 250 }}>
				<PostList allMetadata={allMetadata_pinned} />
			</div>
		{/if}
	</div>

	<div>
		<h1><button onclick={() => (postsOpen = !postsOpen)}>포스트</button></h1>

		{#if postsOpen}
			<div transition:slide={{ duration: 250 }}>
				<PostList {allMetadata} />
			</div>
		{/if}
	</div>
</div>

<div id="Page_Check"></div>

<style>
button {
	padding: 0;
}
</style>
