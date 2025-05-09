import path from 'node:path'

import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }
import { CACHE_DIR, isSameState, readCache, serializePage, writeCache } from './cache.js'
import { testUIComponent } from './universal-testers.js'

for (const entry of Object.values(manifest.entries)) {
	if (!entry?.id) {
		continue
	}
	const { id } = entry
	if (id.endsWith('docs')) {
		continue
	}

	const title = id.replaceAll('--', ' @ ').replaceAll('-', ' > ')

	const cacheFileName = `${id}.html`
	const cacheFilePath = path.join(CACHE_DIR, `storybook-${cacheFileName}`)

	test(`${title}`, async ({ page }) => {
		// 캐시 비활성화를 위한 라우트 설정
		// await page.route('**', (route) => route.continue())

		// --- 네비게이션 차단 설정 ---
		let allowNavigation = true // 초기 네비게이션 허용 플래그

		await page.route('**/*', (route, request) => {
			if (request.resourceType() === 'document') {
				if (allowNavigation) {
					// console.log(`네비게이션 허용 (초기): ${request.url()}`)
					allowNavigation = false // 첫 번째 document 요청 후 플래그 변경
					route.continue()
				} else {
					// 현재 페이지 URL과 요청 URL 비교
					const currentPageUrl = page.url()
					const requestedUrl = request.url()
					if (currentPageUrl === requestedUrl) {
						// console.log(`네비게이션 허용 (새로고침): ${requestedUrl}`)
						route.continue() // 새로고침 허용
					} else {
						// console.log(`네비게이션 차단 시도: ${requestedUrl}`)
						route.abort('aborted') // 다른 페이지로의 이동 차단
					}
				}
			} else {
				route.continue() // 다른 리소스(css, js 등)는 허용
			}
		})
		// --- ---

		// 콘솔 오류 감지 설정 (페이지 이동 전에 설정)
		const consoleErrors = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text())
			}
		})

		// 네트워크 오류 감지 (페이지 이동 전에 설정)
		const failedRequests = []
		page.on('response', (response) => {
			if (response.status() >= 400) {
				failedRequests.push(`${response.url()} (${response.status()})`)
			}
		})

		await page.goto(`./iframe.html?id=${id}&viewMode=story`)
		await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 15_000 })

		const cachedState = readCache(cacheFilePath)
		const currentState = await serializePage(page)

		if (isSameState(cachedState, currentState)) {
			// console.log(`[캐시 히트] ${title} - 페이지 상태 변경 없음. UI 컴포넌트 테스트를 건너뛰니다.`)
			test.info().annotations.push({ type: 'cache-status', description: 'hit' })
			expect(consoleErrors, '콘솔 에러 체크 (캐시 히트)').toHaveLength(0)
			expect(failedRequests, '네트워크 에러 체크 (캐시 히트)').toHaveLength(0)
			return
		}
		// console.log(`[캐시 미스] ${title} - 캐시 없거나 상태 변경됨. UI 컴포넌트 테스트를 실행합니다.`)
		test.info().annotations.push({ type: 'cache-status', description: 'miss' })

		await page.emulateMedia({ reducedMotion: 'reduce' })
		const results = await testUIComponent(page, {
			numRuns: 5,
			sequenceLength: 3,
			waitAfterInteraction: 50,
			verbose: false,
		})

		// 테스트 정보 기록
		test.info().attach(`Debug Info`, {
			body: JSON.stringify(results, undefined, 2),
		})

		const dateNow = new Date()
		test.info().attach(`Date`, {
			body: dateNow.toLocaleString('ko-KR'),
		})

		// UI 컴포넌트 에러 정보 첨부
		const errorMessages = (results.errors ?? []).map((error) => `- ${error.message}`).join('\n')
		test.info().attach(`UI Component Errors (${results.errors?.length ?? 0})`, {
			body: errorMessages,
			contentType: 'text/plain',
		})

		expect(results.errors.length).toBe(0)
		expect(results.success).toBe(true)

		if (results.success && results.errors.length === 0) {
			// console.log(`[캐시 쓰기] ${title} - 테스트 성공. 새로운 상태를 캐시합니다.`)
			writeCache(currentState, cacheFilePath)
		}
	})
}
