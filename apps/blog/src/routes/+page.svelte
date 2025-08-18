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
		<button onclick={() => (pinnedPostsOpen = !pinnedPostsOpen)}><h1>고정된 포스트</h1></button>

		{#if pinnedPostsOpen}
			<div transition:slide={{ duration: 300 }}>
				<PostList allMetadata={allMetadata_pinned} />
			</div>
		{/if}
	</div>

	<div>
		<button onclick={() => (postsOpen = !postsOpen)}><h1>포스트</h1></button>

		{#if postsOpen}
			<div transition:slide={{ duration: 300 }}>
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
