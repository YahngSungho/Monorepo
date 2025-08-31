<script>
import { create } from '@library/helpers/mutative'
// 'as * from m'이 Sherlock extension의 inline annotation을 작동시키는 트리거
import * as m from '@library/paraglide/messages'
import Markdown from '@library/ui/markdown-blog'
import { getContext } from 'svelte'

import { page } from '$app/state'
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

// 현재 URL 계산 (경로의 마지막 부분만 사용)
let currentCanonicalUrl = $derived.by(() => {
	// 경로의 마지막 segment(slug)만 추출
	const pathSegments = page.url.pathname.split('/').filter(Boolean)
	const slug = pathSegments.at(-1)
	return `https://sungho.blog/posts/${slug}`
})

// JSON-LD 데이터 생성
let jsonLd = $derived({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	author: {
		'@type': 'Person',
		name: 'Sungho Yahng',
	},
	datePublished: data.currentMetadata.date,
	description: data.description,
	headline: data.currentMetadata.title,
	mainEntityOfPage: {
		'@id': currentCanonicalUrl,
		'@type': 'WebPage',
	},
	publisher: {
		'@type': 'Organization',
		name: 'sungho.blog',
	},
	url: currentCanonicalUrl,
})
</script>

<svelte:head>
	<!-- 📄 페이지별 메타 태그들 -->
	<title>{data.currentMetadata.title} - sungho.blog</title>
	<meta name="description" content={data.description} />

	<!-- Canonical URL -->
	<link href={currentCanonicalUrl} rel="canonical" />

	<!-- Open Graph 메타 태그들 -->
	<meta content="article" property="og:type" />
	<meta content={data.currentMetadata.title} property="og:title" />
	<meta content={data.description} property="og:description" />
	<meta content={currentCanonicalUrl} property="og:url" />
	<meta content="sungho.blog" property="og:site_name" />

	<!-- Article 관련 Open Graph -->
	{#if data.currentMetadata.date}
		<meta content={data.currentMetadata.date} property="article:published_time" />
	{/if}
	<meta content="Sungho Yahng" property="article:author" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.currentMetadata.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:url" content={currentCanonicalUrl} />
	<!-- <meta name="twitter:site" content="@sungho_yahng" /> -->
	<!-- <meta name="twitter:creator" content="@sungho_yahng" /> -->

	<!-- 구조화된 데이터 (JSON-LD) -->
	<!-- eslint-disable-next-line -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<div>
	<h1>
		{data.currentMetadata.title}
	</h1>
	{#if data.post}
		<Markdown value={data.post.body} mermaidSVGObject={data.post.mermaid_svg_object} />
	{/if}
</div>

<div class="divider divider-neutral"></div>

<div>
	<PostList allMetadata={nearMetadata} />
</div>

<div id="Page_Check"></div>
