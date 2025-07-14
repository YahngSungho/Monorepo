<script module>
import { getLocale, setLocale } from '@library/paraglide/helpers'
import VariationSetter from '@library/ui/variationSetter'
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'
</script>

<script>
const getAllMetadata = getContext('getAllMetadata')
let allMetadata = $derived(getAllMetadata())

let totalCount = $derived(allMetadata.length)
let visitedCount = $derived(allMetadata.filter(item => item.visited).length)
let progress = $derived(Math.floor((visitedCount / totalCount) * 100))

let allMetadata_best = $derived(allMetadata.filter(item => item.best))
let totalCount_best = $derived(allMetadata_best.length)
let visitedCount_best = $derived(allMetadata_best.filter(item => item.visited).length)
let progress_best = $derived(Math.floor((visitedCount_best / totalCount_best) * 100))

</script>

<div
	style="
margin: var(--space-em-cqi-m);"
>
	<VariationSetter {getLocale} {setLocale} />
</div>

<p>
	{JSON.stringify(allMetadata)}
</p>


<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
	<h1>Best Posts</h1>

	{#if progress > 0}
	<!-- Todo: title 값 paraglide 메시지로 하기 -->
	<div style="--value:{progress_best}; --size: 1em; --thickness: 0.2em;

	transform: scaleX(-1);
	inline-size: 1em;
	block-size: 1em;
	" class="radial-progress" aria-valuenow={progress_best} role="progressbar" title={`${visitedCount_best} / ${totalCount_best} posts visited`}></div>
	{/if}
</div>

<div>
	<PostList allMetadata={allMetadata_best} />
</div>

<hr />

<div style="display: flex; gap: var(--space-em-cqi-3xs-2xs); align-items: center;">
	<h1>Blog Posts</h1>

	{#if progress > 0}
	<!-- Todo: title 값 paraglide 메시지로 하기 -->
	<div style="--value:{progress}; --size: 1em; --thickness: 0.2em;

	transform: scaleX(-1);
	inline-size: 1em;
	block-size: 1em;
	" class="radial-progress" aria-valuenow={progress} role="progressbar" title={`${visitedCount} / ${totalCount} posts visited`}></div>
	{/if}
</div>


<div>
	<PostList {allMetadata} />
</div>




<div id="Page_Check"></div>
