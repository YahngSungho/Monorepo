<script>
import { create } from '@library/helpers/mutative'
import { getLocale, setLocale } from '@library/paraglide/helpers'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Button from '@library/ui/button_daisy'
import Markdown from '@library/ui/markdown-blog'
import * as Popover from "@library/ui/popover"
import SharingButtons from '@library/ui/sharingButtons'
import VariationSetter from '@library/ui/variationSetter'
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

	const nearCount = 4
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
margin: var(--space-em-cqi-m)"
>
	<VariationSetter {getLocale} {setLocale} />

	<div>
		<Button href="/">Home</Button>
	</div>
</div>

<div>
	<PostList allMetadata={nearMetadata} />
</div>

<div style="inline-size: fit-content">
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
			<Button size="xs" variant="secondary" {...props}>
				Open
			</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content>
			<div style="max-inline-size: 100svi padding: var(--space-em-cqi-m) font-size: var(--font-size-fluid-em-cqi-01)">
				<SharingButtons title={data.currentMetadata.title} />
			</div>
		</Popover.Content>
	</Popover.Root>
</div>

<div>
	<SharingButtons title={data.currentMetadata.title} />
</div>

<div>
	{JSON.stringify(data.currentMetadata)}
</div>

<div>
	{JSON.stringify(nearMetadata)}
</div>

<div
	style="
	overflow: visible
	margin: auto
	padding-inline: var(--space-em-cqi-m)
"
	class="boxed long-text"
>
	{#if data.post}
		<Markdown value={data.post} />
	{/if}
</div>

<div id="Page_Check"></div>
