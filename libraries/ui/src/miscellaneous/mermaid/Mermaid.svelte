<script module>
import './mermaid.css'

import { idleRun_action } from '@library/helpers/functions'
import { getLocale } from '@library/paraglide/helpers'
import { nanoid } from 'nanoid'
import store from 'store'

import { initMermaidTheme_action } from './mermaid-theme.js'
import { initializeMermaidHover_action } from './helpers.js'

// 테마+정의 기반으로 SVG 결과를 캐시하여 재사용 (LRU + TTL)
// key: `${mode}:${locale}:${definition}` -> value: { svg, expiresAt }
/** @typedef {{ svg: string, expiresAt: number }} SvgCacheEntry */
/** @typedef {{ entries: Record<string, SvgCacheEntry>, order: string[] }} SvgCache */

// 최대 50개 보관, 10일 TTL
const CACHE_MAX_ENTRIES = 50
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 10
const STORAGE_KEY = 'ui:mermaid:svg-cache'

/**
 * 현재 캐시를 읽습니다. 없으면 초기 구조를 반환합니다.
 * @returns {SvgCache}
 */
function readCache_action() {
	const data = store.get(STORAGE_KEY)
	if (!data || typeof data !== 'object') {
		return { entries: Object.create(null), order: [] }
	}
	// entries 혹은 order가 비정상일 경우 복구
	const entries = data.entries && typeof data.entries === 'object' ? data.entries : Object.create(null)
	const order = Array.isArray(data.order) ? data.order.slice() : []
	return { entries, order }
}

/**
 * 캐시를 localStorage에 저장합니다.
 * @param {SvgCache} cache
 */
function writeCache_action(cache) {
	store.set(STORAGE_KEY, cache)
}

/**
 * 캐시에서 SVG를 조회합니다. 만료되었으면 제거하고 빈 문자열을 반환합니다.
 * LRU 정책을 위해 조회 시 최신으로 갱신합니다.
 * @param {string} cacheKey
 * @returns {string} svg 문자열 또는 빈 문자열
 */
function getCachedSvg_action(cacheKey) {
	const cache = readCache_action()
	const entry = cache.entries[cacheKey]
	if (!entry) return ''
	if (Date.now() > entry.expiresAt) {
		delete cache.entries[cacheKey]
		removeKeyFromOrder_action(cache, cacheKey)
		writeCache_action(cache)
		return ''
	}
	// LRU: 가장 최근 조회로 갱신 (끝으로 이동)
	moveKeyToEnd_action(cache, cacheKey)
	writeCache_action(cache)
	return entry.svg
}

/**
 * 캐시에 SVG를 저장하고 용량 초과 시 LRU로 제거합니다.
 * @param {string} cacheKey
 * @param {string} svg
 */
function setCachedSvg_action(cacheKey, svg) {
	const cache = readCache_action()
	cache.entries[cacheKey] = { svg, expiresAt: Date.now() + CACHE_TTL_MS }
	moveKeyToEnd_action(cache, cacheKey)
	pruneCacheIfNeeded_action(cache)
	writeCache_action(cache)
	schedulePurge_action()
}

function moveKeyToEnd_action(cache, cacheKey) {
	const idx = cache.order.indexOf(cacheKey)
	if (idx !== -1) cache.order.splice(idx, 1)
	cache.order.push(cacheKey)
}

function removeKeyFromOrder_action(cache, cacheKey) {
	const idx = cache.order.indexOf(cacheKey)
	if (idx !== -1) cache.order.splice(idx, 1)
}

/** 용량 초과 시 오래된 항목부터 제거 */
function pruneCacheIfNeeded_action(cache) {
	while (cache.order.length > CACHE_MAX_ENTRIES) {
		const oldestKey = cache.order.shift()
		if (oldestKey == null) break
		delete cache.entries[oldestKey]
	}
}

/** 만료된 항목만 일괄 제거 (O(n)) */
function purgeExpiredEntries_action() {
	const cache = readCache_action()
	const now = Date.now()
	/** @type {string[]} */
	const keysToRemove = []
	for (const key of cache.order) {
		const entry = cache.entries[key]
		if (!entry || entry.expiresAt <= now) keysToRemove.push(key)
	}
	for (const key of keysToRemove) {
		delete cache.entries[key]
		removeKeyFromOrder_action(cache, key)
	}
	if (keysToRemove.length > 0) writeCache_action(cache)
}

function schedulePurge_action() {
    idleRun_action(purgeExpiredEntries_action)
}

// 전역 렌더 큐 (탭 전역, 동시성 1)
const QUEUE_KEY = '__ui_mermaid_render_queue__'
if (!globalThis[QUEUE_KEY]) {
    globalThis[QUEUE_KEY] = { tasks: [], running: false }
}

/** 백그라운드/idle 시점까지 대기 */
/**
 * @param {number} [timeout=1000]
 */
/**
 * @param {number} [timeout=1000]
 * @returns {Promise<void>}
 */
function waitForIdle_action(timeout = 1000) {
    return new Promise((resolve) => {
        // @ts-ignore - scheduler may not exist in all browsers
        if (globalThis.scheduler && typeof globalThis.scheduler.postTask === 'function') {
            // @ts-ignore
            globalThis.scheduler.postTask(() => resolve(undefined), { priority: 'background' })
            return
        }
        if (typeof globalThis.requestIdleCallback === 'function') {
            // @ts-ignore
            globalThis.requestIdleCallback(() => resolve(undefined), { timeout })
            return
        }
        globalThis.setTimeout(() => resolve(undefined), 0)
    })
}

/** 메인 스레드에 잠깐 양보 */
/**
 * @returns {Promise<void>}
 */
function yieldToMain_action() {
    return new Promise((resolve) => { setTimeout(() => resolve(undefined), 0) })
}

async function processQueue_action() {
    const state = globalThis[QUEUE_KEY]
    if (state.running) return
    state.running = true
    try {
        while (state.tasks.length > 0) {
            const task = state.tasks.shift()
            await waitForIdle_action()
            await task()
            await yieldToMain_action()
        }
    } finally {
        state.running = false
    }
}

function enqueueMermaidRender_action(task) {
    const state = globalThis[QUEUE_KEY]
    state.tasks.push(task)
    idleRun_action(processQueue_action)
}

// 전역 접근(다른 인스턴스와 공유) 가능하게 노출
globalThis.__ui_mermaid_enqueueRender_action = enqueueMermaidRender_action
</script>

<script>
import { mode } from 'mode-watcher'
import { tick } from 'svelte'
import { getAstNode } from 'svelte-exmarkdown'

const ast = getAstNode()
let rawText = $state(ast.current.children?.[0]?.value ?? '')

let element = $state() // 컨테이너 요소에 바인딩
let svgContent = $state('') // 렌더링된 SVG 저장
let errorMessage = $state('') // 오류 메시지 저장
const id = `mermaid-${nanoid()}` // 각 인스턴스별 고유 ID

// AST 노드에서 원본 텍스트 추출

// 테마 모드에 반응적으로 의존하는 초기화 Promise를 인스턴스 컨텍스트에서 관리
const initMermaidThemePromise = $derived.by(() => initMermaidTheme_action(mode.current))

// 동시 실행되는 렌더의 순서를 제어하기 위한 시퀀스 토큰
let renderSequence = 0

// 동적 import로 mermaid 로딩 비용 지연
let mermaidModulePromise
async function getMermaid_action() {
    if (!mermaidModulePromise) mermaidModulePromise = import('mermaid')
    const mod = await mermaidModulePromise
    return mod.default || mod
}

// 화면 근처로 올 때만 렌더하도록 가시성 추적
let isVisible = $state(false)
let io
$effect(() => {
	const el = element
	if (!el) return
	io?.disconnect?.()
	io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.target === el) {
					isVisible = e.isIntersecting
				}
			}
		},
		{ rootMargin: '200px 0px', threshold: 0 },
	)
	io.observe(el)
	return () => io.disconnect()
})

// 테마 변경 및 원본 텍스트 변경에 반응하여 Mermaid 차트를 렌더링/재렌더링하는 $effect
$effect(() => {
	// 1) 동기 구간에서 의존성 등록: 테마와 원본 텍스트, 초기화 프라미스
	const currentMode = mode.current
	const raw = rawText
	const initPromise = initMermaidThemePromise
	const thisRenderSeq = ++renderSequence

	// 2) 비동기 작업
	if (!globalThis.__ui_mermaid_enqueueRender_action) return
	const visibleNow = isVisible
	globalThis.__ui_mermaid_enqueueRender_action(async () => {
		if (!visibleNow) return
		// 등록된 의존성의 값을 사용
		await initPromise

		const definition = raw
			.split(String.raw`\n`) // 줄 단위로 분리
			.filter((line) => !/^\s*%%/.test(line)) // '%%' 주석 라인 제거
			.join(String.raw`\n`) // 다시 문자열로 합침
			.trim() // 앞뒤 공백 제거

		if (!definition) {
			svgContent = ''
			errorMessage = ''
			return // 정의가 없으면 아무것도 안 함
		}

		errorMessage = ''

		try {
			// 2) 캐시 조회: 동일 테마 + 동일 정의면 즉시 사용 (LRU/TTL)
			const cacheKey = `${currentMode}:${getLocale()}:${definition}`
			const cached = getCachedSvg_action(cacheKey)
			if (cached) {
				if (thisRenderSeq !== renderSequence) return
				svgContent = cached
				// hover 초기화는 아래에서 idle로 지연 처리
				await tick()
				const svgElementCached = element?.querySelector('svg')
				if (svgElementCached) {
					idleRun_action(() => initializeMermaidHover_action(svgElementCached))
				}
				return
			}

			// 비동기적으로 Mermaid 렌더링 실행
			const mermaid = await getMermaid_action()
			const { svg, bindFunctions } = await mermaid.render(id, definition)

			// 최신 렌더가 아닐 경우 폐기
			if (thisRenderSeq !== renderSequence) return
			// 캐시에 저장 후 반영 (LRU/TTL)
			setCachedSvg_action(cacheKey, svg)
			svgContent = svg // 성공 시 SVG 콘텐츠 업데이트

			await tick() // DOM 업데이트 기다리기

			if (bindFunctions) {
				bindFunctions(element) // Mermaid의 기본 바인딩 (클릭 등)
			}
			const svgElement = element?.querySelector('svg') // 렌더링된 SVG 찾기 (element가 있을 때만)
			if (svgElement) {
				// 4) Hover 초기화는 유휴 시간에 지연 수행하여 초기 페인트 방해 최소화
				idleRun_action(() => initializeMermaidHover_action(svgElement))
			}
		} catch (error) {
			// 오류 발생 시, 이전 렌더링을 유지하기보다는 오류 메시지를 명확히 보여주는 것이 좋을 수 있습니다.
			// console.error('Mermaid rendering error:', error);
			errorMessage = `Mermaid Rendering Error: ${error.message || String(error)}`
			// svgContent = ''; // 오류 발생 시 이전 SVG를 지울지 여부는 선택사항
		}
	})
})
</script>

<div bind:this={element} style="content-visibility: auto; contain-intrinsic-size: 300px 200px;" class="mermaid-container">
	{#if errorMessage}
		<!-- 오류 발생 시 메시지와 원본 텍스트 표시 -->
		<pre style:color="red;">{errorMessage}</pre>
		<pre>{rawText}</pre>
	{:else if svgContent}
		<!-- 성공 시 렌더링된 SVG 표시 -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html svgContent}
		<!-- Mermaid가 생성한 SVG는 안전하다고 가정합니다. XSS 위험 인지. -->
	{/if}
</div>
