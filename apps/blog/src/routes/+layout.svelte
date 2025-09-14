<script>
import '@library/base/fontStyle.css'

import { idleRun_action } from '@library/helpers/functions'
import { R } from '@library/helpers/R'
import { emailSchema } from '@library/helpers/zod-schemas'
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

import { afterNavigate } from '$app/navigation'
import { page } from '$app/state'
import { APP_NAME, URL, EMAIL_SENDER_NAME } from '$lib/info.js'

/** @type {import('./$types').LayoutProps} */
let { children, data } = $props()
let visited = $state({})

let emailValue = $state('')
/**
 * @type {null | { submittedEmail: string, success: boolean }}
 */
let formResult = $state(null)
// 제출 진행 상태가 필요하면 UI에 연결하세요. 현재는 내부 사용만 함
let isSubscribed = $state(false)
let emailErrorMessage = $state('')
let isSubmitting = $state(false)

function validateEmail(emailValue0) {
	const result = emailSchema.safeParse(emailValue0)
	return result.success
}
function handleInput_action() {
	emailErrorMessage = ''
	isSubscribed = false
}

const emailErrorMessageList = {
	incorrectFormat: '이메일 형식 잘못됨',
	unknownError: '이유는 뭔지 몰라도 구독에 실패함',
}

/**
 * 구독 폼 제출 처리 (API 엔드포인트로 POST)
 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }} event
 */
async function handleSubscribeSubmit_action(event) {
	event.preventDefault()
	if (isSubmitting) {
		return
	}
	isSubmitting = true

	isSubscribed = false
	const isValid = validateEmail(emailValue)
	if (!isValid) {
		emailErrorMessage = emailErrorMessageList.incorrectFormat
		return
	}
	emailErrorMessage = ''
	formResult = null

	try {
		const formEl = event.currentTarget
		const response = await fetch(formEl.action, {
			body: new FormData(formEl),
			method: 'POST',
		})
		const responseData = await response.json()
		const success = response.ok && response.status === 200
		formResult = {
			submittedEmail: responseData?.email,
			success,
		}
		if (success) {
			isSubscribed = true
		} else {
			if (response.status === 400) {
				emailErrorMessage = emailErrorMessageList.incorrectFormat
			} else {
				emailErrorMessage = emailErrorMessageList.unknownError
			}
		}
	} catch {
		emailErrorMessage = emailErrorMessageList.unknownError
	} finally {
		// eslint-disable-next-line require-atomic-updates
		isSubmitting = false
	}
}

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
	if (!slug) return

	const currentVisited = store.get('visited') || {}

	if (currentVisited[slug]) return // 이미 방문했으면 중단

	// 메모리(visited)가 아닌, 방금 읽어온 localStorage 값을 기준으로 새로운 객체를
	const newVisited = { ...currentVisited, [slug]: true }

	// localStorage와 Svelte 상태를 모두 업데이트
	store.set('visited', newVisited)
	visited = newVisited
}

setContext('getAllMetadata', () => allMetadata)
setContext('markAsVisited', markAsVisited)

let totalCount = $derived(allMetadata.length)
let visitedCount = $derived(allMetadata.filter((item) => item.visited).length)
let progress = $derived(Math.floor((visitedCount / (totalCount || 1)) * 100))

let sharingButtonsOpen = $state(false)

// 스크롤 타겟 요소 및 상태 관리
// svelte-ignore non_reactive_update
let withSidebarEl
// svelte-ignore non_reactive_update
let mainEl
let activeEl = $state(null)
let scrollTop = $state(0)
let scrollHeight = $state(0)
let clientHeight = $state(0)

function isScrollable(el) {
	return !!el && el.scrollHeight > el.clientHeight + 1
}
function setupScrollElement_action(element) {
	scrollHeight = element.scrollHeight
	clientHeight = element.clientHeight
	scrollTop = element.scrollTop
}

function pickScrollTarget() {
	// 1) 최근 사용한 엘리먼트가 스크롤 가능하면 우선
	if (activeEl && isScrollable(activeEl)) return activeEl
	// 2) 스크롤 가능 후보 중에서 스크롤 여유가 큰 것 우선
	const candidates = [withSidebarEl, mainEl].filter(isScrollable)
	if (candidates.length > 0) {
		const sorted = candidates.toSorted(
			(a, b) => b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight),
		)
		return sorted[0]
	}
	// 3) 마지막 수단
	return withSidebarEl || mainEl || null
}

function handleWithScroll_action() {
	if (!withSidebarEl) return
	idleRun_action(() => {
		activeEl = withSidebarEl
		scrollTop = withSidebarEl.scrollTop
		scrollHeight = withSidebarEl.scrollHeight
		clientHeight = withSidebarEl.clientHeight
	})
}

function handleMainScroll_action() {
	if (!mainEl) return
	idleRun_action(() => {
		activeEl = mainEl
		scrollTop = mainEl.scrollTop
		scrollHeight = mainEl.scrollHeight
		clientHeight = mainEl.clientHeight
	})
}

// 초기 활성 스크롤 타겟 설정
$effect(() => {
	idleRun_action(() => {
		if (!activeEl) {
			if (isScrollable(withSidebarEl)) {
				activeEl = withSidebarEl
				setupScrollElement_action(withSidebarEl)
			} else if (isScrollable(mainEl)) {
				activeEl = mainEl
				setupScrollElement_action(mainEl)
			}
		}
	})
})

afterNavigate(() => {
	// 3. window 전체 스크롤을 맨 위로 올립니다.
	window.scrollTo(0, 0)

	// 4. (만약 특정 요소가 스크롤 컨테이너라면) 그 요소의 스크롤을 맨 위로 올립니다.
	// scrollableContainer가 마운트된 후에만 실행되도록 확인합니다.
	if (withSidebarEl) {
		withSidebarEl.scrollTop = 0
	}
	if (mainEl) {
		mainEl.scrollTop = 0
	}
	scrollTop = 0

	activeEl = pickScrollTarget()
	setupScrollElement_action(activeEl)
})

onMount(() => {
	const ro = new ResizeObserver(() => {
		idleRun_action(() => {
			activeEl = pickScrollTarget()
		})
	})
	if (withSidebarEl) ro.observe(withSidebarEl)
	if (mainEl) ro.observe(mainEl)
	queueMicrotask(() => {
		activeEl = pickScrollTarget()
		setupScrollElement_action(activeEl)
	})
	return () => {
		ro.disconnect()
	}
})

function getActiveEl() {
	return activeEl || pickScrollTarget()
}

function scrollToTop_action() {
	const el = getActiveEl()
	if (el && typeof el.scrollTo === 'function') {
		el.scrollTo({ behavior: 'smooth', top: 0 })
		return
	}
	window.scrollTo({ behavior: 'smooth', top: 0 })
}

function scrollToBottom_action() {
	const el = getActiveEl()
	if (el && typeof el.scrollTo === 'function') {
		el.scrollTo({ behavior: 'smooth', top: el.scrollHeight })
	}
}

let showScrollTop = $derived.by(() => {
	return scrollTop !== 0
})

let showScrollBottom = $derived.by(() => {
	return scrollTop + clientHeight !== scrollHeight
})

const currentCanonicalUrl = `https://${URL}`

// 페이지별 공유 데이터 계산
let sharingData = $derived.by(() => {
	const isPostPage = page.url.pathname.includes('/posts/')
	const postTitle = page.data?.currentMetadata?.title

	let url = currentCanonicalUrl
	if (isPostPage) {
		const pathSegments = page.url.pathname.split('/').filter(Boolean)
		const slug = pathSegments.at(-1)
		url = `${currentCanonicalUrl}/posts/${slug}`
	}

	return {
		title: isPostPage && postTitle ? postTitle : URL,
		url,
	}
})

// JSON-LD 데이터 생성
let jsonLd = $derived({
	'@context': 'https://schema.org',
	'@type': 'Blog',
	author: {
		'@type': 'Person',
		name: EMAIL_SENDER_NAME,
	},
	description: data.description,
	headline: URL,
	mainEntityOfPage: {
		'@id': currentCanonicalUrl,
		'@type': 'WebPage',
	},
	publisher: {
		'@type': 'Organization',
		name: URL,
	},
	url: currentCanonicalUrl,
})
</script>

<svelte:head>
	<!-- 🌐 사이트 공통 메타태그 (모든 페이지에 적용) -->
	<meta name="author" content={EMAIL_SENDER_NAME} />
	<meta content={URL} property="og:site_name" />
	<!-- <meta name="twitter:site" content="@sungho_yahng" /> -->
	<!-- <meta name="twitter:creator" content="@sungho_yahng" /> -->

	<!-- 🏠 홈페이지 전용 메타태그 -->
	{#if !page.url.pathname.includes('posts')}
		<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
		<title>{URL}</title>
		<meta name="description" content={data.description} />
		<link href={currentCanonicalUrl} rel="canonical" />
		<meta content="website" property="og:type" />
		<meta content={URL} property="og:title" />
		<meta content={data.description} property="og:description" />
		<meta content={currentCanonicalUrl} property="og:url" />
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:title" content={URL} />
		<meta name="twitter:description" content={data.description} />
		<meta name="twitter:url" content={currentCanonicalUrl} />

		<!-- eslint-disable-next-line -->
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
	{/if}
</svelte:head>

{#snippet scrollButtons()}
	{#if showScrollTop || showScrollBottom}
		<div class="join join-vertical scroll-buttons">
			<Button
				class="join-item"
				dimBackground
				disabled={!showScrollTop}
				iconName="mdi:chevron-double-up"
				onclick={scrollToTop_action}
				variant="outline"
			/>
			<Button
				class="join-item"
				dimBackground
				disabled={!showScrollBottom}
				iconName="mdi:chevron-double-down"
				onclick={scrollToBottom_action}
				variant="outline"
			/>
		</div>
	{/if}
{/snippet}

<BaseLayout appName={APP_NAME}>
	{#if activeEl === withSidebarEl}
		{@render scrollButtons()}
	{/if}

	<div bind:this={withSidebarEl} class="with-sidebar boxed" onscroll={handleWithScroll_action}>
		{#if activeEl === mainEl}
			{@render scrollButtons()}
		{/if}

		<div bind:this={mainEl} class="main boxed" onscroll={handleMainScroll_action}>
			<div class="long-text">
				{@render children()}
			</div>
		</div>

		<div class="sidebar boxed">
			<div
				style:position="relative"
				style:flex-flow="column"
				style:gap="var(--space-em-cqi-3xs-2xs)"
				style:display="flex"
			>
				<div
					style:--value={progress}
					class="radial-progress"
					class:progress_0={progress === 0}
					class:progress_100={progress === 100}
					aria-valuenow={progress}
					role="progressbar"
				></div>

				<div
					style:z-index="1"
					style:inline-size="fit-content"
					style:background-color="var(--color-base-100)"
				>
					<VariationSetter {getLocale} {setLocale} size="sm" />
				</div>

				<div
					style:z-index="1"
					style:display="flex"
					style:inline-size="fit-content"
					style:flex-direction="column"
				>
					<!-- eslint-disable-next-line @intlify/svelte/no-raw-text -->
					<Link style="font-size: min(calc(100cqi / 6.2), 5em); font-weight: 900;" href="/">
						{URL}
					</Link>
				</div>

				<form
					action="/api/subscribe"
					autocomplete="on"
					method="post"
					onsubmit={handleSubscribeSubmit_action}
				>
					<div
						style:z-index="1"
						style:inline-size="17em"
						style:background-color="var(--background)"
						style:max-inline-size="90%"
						class="join"
					>
						<div style:flex-grow="1">
							<label
								style="border: 1px solid currentcolor !important;"
								class="input input-sm floating-label join-item"
								for="email"
							>
								<input
									id="email"
									name="email"
									autocomplete="email"
									disabled={isSubmitting}
									oninput={handleInput_action}
									placeholder="나의@이메일.com"
									required
									type="email"
									bind:value={emailValue}
								/>
								<span>이메일</span>
							</label>
						</div>
						<ConfettiButton
							class="join-item"
							amount={10}
							colorArray={['var(--gray-0)', 'var(--gray-4)', 'var(--gray-8)', 'var(--gray-12)']}
							duration={750}
							isConfettiActivated={isSubscribed && !isSubmitting}
							noGravity
							x={[-0.5, 0.5]}
							y={[-0.5, 0.5]}
						>
							<Button class="join-item" loading={isSubmitting} size="sm" type="submit">
								{isSubscribed ? '구독 됨!' : '구독하기'}
							</Button>
						</ConfettiButton>
					</div>

					<div
						style:font-size="var(--font-size-fluid-em-cqi-01)"
						style:z-index="1"
						style:position="relative"
					>
						{#if emailErrorMessage}
							<div
								style:color="var(--color-destructive)"
								role="alert"
								transition:slide={{ duration: 300 }}
							>
								{emailErrorMessage}
							</div>
						{/if}

						{#if isSubscribed && formResult?.submittedEmail && !emailErrorMessage}
							<div role="status" transition:slide={{ duration: 300 }}>
								{`구독이 완료되었습니다: ${formResult?.submittedEmail}`}
							</div>
						{/if}
					</div>
				</form>

				<div style:z-index="1" style:overflow="visible">
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
						<div style:cursor="default" transition:slide={{ duration: 300 }}>
							<div
								style:inline-size="100%"
								style:padding="var(--space-em-cqi-xs-s)"
								style:background-color="var(--background)"
								style:font-size="var(--font-size-fluid-em-cqi-01)"
							>
								<SharingButtons title={sharingData.title} url={sharingData.url} />
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div id="Top2_Layout_Check"></div>
</BaseLayout>

<style>
.scroll-buttons {
	position: absolute;
	z-index: var(--layer-important);
	inset-block-end: var(--space-m);
	inset-inline-end: var(--space-m);
}

.progress_0 {
	opacity: 0;
}

.progress_100 {
	color: var(--color-success);
}

.with-sidebar {
	scrollbar-gutter: stable;

	overflow: auto;
	display: flex;
	flex-wrap: wrap;
	gap: 0;

	block-size: 100svb;

	--shared-padding: var(--space-s-l);

	& > .sidebar {
		display: flex;
		/* flex-basis를 밑의 breakpoint랑 일치시켜야함 */
		flex-basis: 25rem;
		flex-direction: column;
		flex-grow: 1;
		gap: var(--space-em-cqi-m);

		margin-block-start: auto;
		padding: var(--shared-padding);
		padding-block-end: calc(var(--shared-padding) + var(--space-cqi-xl));
	}

	& > .main {
		overflow: visible;
		flex-basis: 0;
		flex-grow: 999;
		/* min-inline-size를 밑의 breakpoint랑 일치시켜야함 */
		min-inline-size: 60%;
		max-block-size: none;
		padding: var(--shared-padding);
	}

	& > .scroll-buttons {
		inset-block-start: var(--shared-padding);
		inset-inline-end: calc(var(--shared-padding) + 25rem);
	}
}

/* flex-wrap이 작동하지 **않았을** 시의 CSS */
@container (min-width: calc(25rem / (1 - 0.6))) {
	.with-sidebar {
		scrollbar-gutter: auto;
		overflow: hidden;

		& > .main {
			overflow: auto;
			max-block-size: 100svb;
		}

		& > .sidebar {
			margin-block-start: 0;
			padding: var(--shared-padding);
		}
	}
}

.radial-progress {
	--size: 10em;
	--thickness: 0.5em;

	position: absolute;
	inset-block-start: 0;
	inset-inline-end: 0;
	transform: scaleY(-1) scaleX(-1);
	z-index: 0;
}
</style>
