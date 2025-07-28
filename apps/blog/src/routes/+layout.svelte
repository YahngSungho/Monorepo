<script>
import '@library/base/fontStyle.css'

import { R } from '@library/helpers/R'
import { getLocale, setLocale } from '@library/paraglide/helpers'
import Button from '@library/ui/button_daisy'
import ConfettiButton from '@library/ui/confettiButton'
import BaseLayout from '@library/ui/layouts/root'
import Link from '@library/ui/link'
import SharingButtons from '@library/ui/sharingButtons'
import VariationSetter from '@library/ui/variationSetter'
import store from 'store'
import { onMount, setContext } from 'svelte'
import { slide } from 'svelte/transition'

import { page } from '$app/state'

import { APP_NAME } from './base'

/** @type {import('./$types').LayoutProps} */
let { children, data } = $props()
let visited = $state({})

onMount(() => {
	visited = store.get('visited') || {}

	function handleStorageChange_action(event) {
		if (event.key && event.newValue) {
			try {
				const newValue = JSON.parse(event.newValue)
				if (event.key === 'visited') {
					visited = newValue || {}
				}
			} catch (error) {
				console.error(`${event.key} 상태 동기화 실패:`, error)
			}
		}
	}

	globalThis.addEventListener('storage', handleStorageChange_action)

	return () => {
		globalThis.removeEventListener('storage', handleStorageChange_action)
	}
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
let visitedCount = $derived(allMetadata.filter((item) => item.visited).length)
let progress = $derived(Math.floor((visitedCount / (totalCount || 1)) * 100))

let sharingButtonsOpen = $state(false)

let y = $state(0)

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}
</script>

<svelte:head>
	<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
	<title>sungho.blog</title>
</svelte:head>

<svelte:window bind:scrollY={y} />

<BaseLayout appName={APP_NAME}>
	<div class="with-sidebar">
		<div class="sidebar boxed">
			<div
				style=" position: relative;display: flex; flex-flow: column; gap: var(--space-em-cqi-3xs-2xs);"
			>
				<div
					style:--value={progress}
					class="radial-progress"
					class:progress_0={progress === 0}
					class:progress_100={progress === 100}
					aria-valuenow={progress}
					role="progressbar"
				></div>

				<div style=" z-index: 1;display: flex; flex-direction: column; inline-size: fit-content;">
					<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
					<!-- <div style="font-size: var(--font-size-fluid-em-cqi-02);">
					sunghoyahng@gmail.com
				</div> -->
					<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
					<Link style="font-size: var(--font-size-fluid-em-cqi-5); font-weight: 900;" href="/">
						sungho.blog
					</Link>
				</div>

				<div style="z-index: 1; inline-size: fit-content; background-color: var(--color-base-100);">
					<VariationSetter {getLocale} {setLocale} size="sm" />
				</div>

				<div
					style="z-index: 1; inline-size: fit-content; max-inline-size: 18em; background-color: var(--color-base-100);"
					class="join"
				>
					<div>
						<label
							style="border: 1px solid currentcolor !important;"
							class="input input-sm floating-label join-item"
						>
						<input placeholder="나의@이메일.com" required type="email" />
							<span>이메일</span>
						</label>
					</div>
					<ConfettiButton
						amount={50}
						colorArray={['var(--gray-0)', 'var(--gray-4)', 'var(--gray-8)', 'var(--gray-12)']}
						duration={750}
						isConfettiActivated
						noGravity
						x={[-0.5, 0.5]}
						y={[-0.5, 0.5]}
					>
						<Button class="join-item" size="sm" type="submit">구독하기</Button>
					</ConfettiButton>
				</div>

				<div style=" z-index: 1;overflow: visible;">
					<Button
						style="min-block-size: auto;"
						onclick={() => {
							sharingButtonsOpen = !sharingButtonsOpen
						}}
						size="sm"
						variant="outline"
					>
						{page.url.pathname.includes('posts') ?
							'이 포스트 공유하기...'
						:	'이 블로그 공유하기...'}
					</Button>
					{#if sharingButtonsOpen}
						<div style="cursor: default;" transition:slide={{ duration: 300 }}>
							<div
								style=" inline-size: 100%; padding: var(--space-em-cqi-xs-s); font-size: var(--font-size-fluid-em-cqi-01);
							background-color: var(--background);
							"
							>
								<SharingButtons />
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="main boxed">
			{@render children()}
		</div>
	</div>

	{#if y > 400}
		<Button
			style="
			position: fixed;
			z-index: var(--layer-important);
			inset-block-end: var(--space-em-cqi-m);
			inset-inline-start: var(--space-em-cqi-m);
		"
			iconName="mdi:transfer-up"
			onclick={scrollToTop}
		>
			맨 위로
		</Button>
	{/if}
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
	padding-block-end: calc(var(--space-em-cqi-m) + var(--space-em-cqi-xl));
}

.with-sidebar {
	display: flex;
	flex-wrap: wrap;
	gap: 0;

	& > :first-child {
		flex-basis: 28rem;
		flex-grow: 1;
	}

	& > :last-child {
		flex-basis: 0;
		flex-grow: 999;
		min-inline-size: 60%;
	}
}

.radial-progress {
	--size: 10em;
	--thickness: 0.5em;

	position: absolute;
	inset-block-start: 0;
	inset-inline-end: 0;
	transform: scaleY(-1) scaleX(-1);
}
</style>
