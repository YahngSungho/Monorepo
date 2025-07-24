<script>
import { create } from '@library/helpers/mutative'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Markdown from '@library/ui/markdown-blog'
import { getContext } from 'svelte'

import PostList from '$lib/components/postList.svelte'

const getAllMetadata = getContext('getAllMetadata')
const markAsVisited = getContext('markAsVisited')

/** @type {import('./$types').PageProps} */
let { data } = $props()

let allMetadata = $derived(getAllMetadata())
let nearMetadata = $derived.by(() => {
	const currentIndex = allMetadata.findIndex((item) => item.slug === data.currentMetadata.slug)

	const allMetadata2 = create(allMetadata, (draft) => {
		const prevCurrent = draft[currentIndex]
		draft[currentIndex] = {
			...prevCurrent,
			current: true,
		}
	})

	const nearCount = 3
	const windowSize = nearCount * 2 + 1

	// 이상적인 시작점을 계산
	let startIndex = currentIndex - nearCount

	// 시작점이 배열 범위를 벗어나는지 확인하고 보정
	if (startIndex < 0) {
		startIndex = 0
	}

	// 시작점이 보정된 후, 끝점이 배열 범위를 벗어나는지 확인하고 보정
	// (배열 끝에서 windowSize만큼을 확보하기 위함)
	if (startIndex + windowSize > allMetadata.length) {
		startIndex = Math.max(0, allMetadata.length - windowSize)
	}

	const endIndex = Math.min(allMetadata.length, startIndex + windowSize)

	return allMetadata2.slice(startIndex, endIndex)
})

$effect(() => {
	markAsVisited(data.currentMetadata?.slug)
})
</script>

<svelte:head>
	<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
	<title>{data.currentMetadata.title} - sungho.blog</title>
</svelte:head>

<div
	style="
	overflow: visible;
	max-inline-size: var(--size-content-4);
	margin: auto;
"
	class="boxed long-text"
>
	<div>
		<h1>
			{data.currentMetadata.title}
		</h1>
		{#if data.post}
			<Markdown value={data.post} />
		{/if}
	</div>

	<div style="margin-block-start: var(--space-em-cqi-xl);" class="divider"></div>

	<div>
		<PostList allMetadata={nearMetadata} />
	</div>
</div>

<div id="Page_Check"></div>
