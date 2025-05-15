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

	const storyId = id;
	const storyUrlWithoutHash = `./iframe.html?id=${storyId}&viewMode=story`;
	const expectedStoryPathAndQuery = `/iframe.html?id=${storyId}&viewMode=story`;

	let allowInitialNavigation = true; // 첫 페이지 로드 허용 플래그

	test(`${title}`, async ({ page }) => {
		// 캐시 비활성화를 위한 라우트 설정
		// await page.route('**', (route) => route.continue())

		// --- 네비게이션 차단 설정 ---
		await page.route('**/*', (route, request) => {
			if (request.resourceType() === 'document') {
				// eslint-disable-next-line no-restricted-syntax
				const requestedUrlObj = new URL(request.url());
				const actualRequestedPathAndQuery = requestedUrlObj.pathname + requestedUrlObj.search;

				if (allowInitialNavigation) {
					// 테스트 시작 시 page.goto(storyUrlWithoutHash)에 의해 호출됨
					if (actualRequestedPathAndQuery === expectedStoryPathAndQuery) {
						allowInitialNavigation = false; // 초기 로드 완료
						route.continue();
						return;
					}
						// 예상치 못한 첫 내비게이션 (예: page.goto가 storyUrlWithoutHash가 아닌 다른 곳으로 요청된 경우)
						// console.error(`[FastCheckRoute] 예상치 못한 초기 내비게이션 차단: ${request.url()}`);
						route.abort('aborted');
						return;

				}

				// 초기 로드 이후의 내비게이션 처리
				// 1. about:blank로의 이동 허용
				if (request.url().startsWith('about:blank')) {
					// console.log(`[FastCheckRoute] about:blank 허용: ${request.url()}`);
					route.continue();
					return;
				}

				// 2. 원래 스토리 URL로의 이동/새로고침 허용 (about:blank에서 돌아오거나, 자체 새로고침)
				if (actualRequestedPathAndQuery === expectedStoryPathAndQuery) {
					// console.log(`[FastCheckRoute] 스토리 URL로 이동/새로고침 허용: ${request.url()}`);
					route.continue();
					return;
				}

				// 3. 그 외 모든 document 타입 내비게이션 차단
				// console.log(`[FastCheckRoute] 기타 내비게이션 차단: ${request.url()} (현재: ${page.url()})`);
				route.abort('aborted');

			} else {
				route.continue(); // 다른 리소스(css, js 등)는 허용
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

		await page.goto(storyUrlWithoutHash)
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
