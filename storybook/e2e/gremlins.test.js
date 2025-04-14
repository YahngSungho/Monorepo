// storybook/e2e/gremlins.test.js
import path from 'node:path'

import { R } from '@library/helpers/R'
import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }
import { CACHE_DIR, isSameState, readCache, serializePage, writeCache } from './cache.js'

/**
 * 페이지 컨텍스트에서 Gremlins를 실행합니다. Playwright와 함께 사용하기 위한 함수입니다.
 *
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>} - Promise 객체
 */
async function unleashGremlins(page) {
	// Horde 생성 및 실행
	await page.evaluate(async () => {
		// @ts-ignore - window.gremlins는 addScriptTag/addInitScript에 의해 로드됨
		const horde = globalThis.gremlins.createHorde({
			species: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.clicker({
					clickTypes: ['click'],
					// 클릭 가능한지 확인하는 로직 수정 (이전 응답 참고 - 네비게이션 방지 강화)
					canClick: (element) => {
						const anchor = element.closest('a')
						if (anchor && anchor.href && anchor.href !== '#') {
							console.log(`Gremlins: 링크 클릭 시도 (차단됨): ${anchor.href}`)
							return false // 링크 클릭 방지
						}
						if (
							element.type === 'submit' ||
							element.closest('button[type="submit"]') ||
							(element.tagName === 'BUTTON' && element.closest('form'))
						) {
							console.log(`Gremlins: 양식 제출 관련 클릭 시도 (차단됨): ${element.tagName}`)
							return false // 폼 제출 방지
						}
						return true
					},
				}),
				// globalThis.gremlins.species.clicker(), // 위에서 설정했으므로 제거
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.toucher(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.formFiller(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.scroller(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.typer(),
			],
			mogwais: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.mogwais.gizmo(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.mogwais.fps(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.mogwais.alert(),
			],
			strategies: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.strategies.distribution(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.strategies.allTogether(),
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.strategies.bySpecies(),
			],
		})

		try {
			await horde.unleash({ nb: 10 })
			console.log('Gremlins 공격 완료')
		} catch (error) {
			console.error('Gremlins horde.unleash() 실행 중 오류:', error)
			// 오류를 던져서 테스트 실패로 만들 수 있지만, 네비게이션 오류는 이미 발생했을 수 있음
			// throw e; // 필요에 따라 주석 해제
		}
	})
}

for (const entry of Object.values(manifest.entries)) {
	// if (!process.env.CI) {
	// 	break
	// }

	if (!entry?.id) {
		continue
	}
	const { id } = entry
	if (id.endsWith('docs')) {
		continue
	}

	const title = id.replaceAll('--', ' @ ').replaceAll('-', ' > ')

	const cacheFileName = `${id}.html`
	const cacheFilePath = path.join(CACHE_DIR, `gremlins-${cacheFileName}`)

	test(`${title}`, async ({ page }) => {
		// --- 네비게이션 차단 설정 ---
		let allowNavigation = true // 초기 네비게이션 허용 플래그

		await page.route('**/*', (route, request) => {
			if (request.resourceType() === 'document') {
				if (allowNavigation) {
					// console.log(`네비게이션 허용 (초기): ${request.url()}`)
					allowNavigation = false // 첫 번째 document 요청 후 플래그 변경
					route.continue()
				} else {
					// console.log(`네비게이션 차단 시도: ${request.url()}`)
					route.abort('aborted') // 이후 모든 document 요청 차단
				}
			} else {
				route.continue() // 다른 리소스(css, js 등)는 허용
			}
		})
		// --- ---

		// --- 추가: gremlins.js 스크립트 주입 ---
		await page.addInitScript({
			path: '../node_modules/gremlins.js/dist/gremlins.min.js',
		})
		// --- ---

		const pageErrors = []
		page.on('pageerror', (err) => {
			// 네비게이션 중단으로 인한 오류는 예상될 수 있으므로 필터링하거나 무시 고려
			if (
				err.message.includes('net::ERR_ABORTED') ||
				err.message.includes('Navigation failed because page was closed')
			) {
				console.log(`예상된 네비게이션 중단 관련 오류 무시: ${err.message}`)
				return
			}
			pageErrors.push(err.message)
			console.error(`페이지 오류 발생 감지: ${err.message}`)
		})

		const consoleErrors = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				// Gremlins가 유발하는 특정 콘솔 오류는 무시할 수 있음 (선택 사항)
				// if (msg.text().includes('some expected error')) return;
				consoleErrors.push(msg.text())
				console.log(`콘솔 에러 감지: ${msg.text()}`)
			}
		})

		const failedRequests = []
		page.on('response', (response) => {
			// aborted된 요청은 실패로 간주하지 않음
			if (
				response.status() === 0 &&
				response.request().failure()?.errorText === 'net::ERR_ABORTED'
			) {
				// console.log(`차단된 요청 응답 무시: ${response.url()}`)
				return
			}
			if (response.status() >= 400) {
				failedRequests.push(`${response.url()} (${response.status()})`)
			}
		})

		try {
			// 네비게이션 차단 플래그 리셋 (테스트 시작 시 항상 초기 로딩 허용)
			allowNavigation = true
			await page.goto(`./iframe.html?id=${id}&viewMode=story`)
			await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 5000 })
			// 이제 allowNavigation은 false 상태일 것임

			const cachedState = readCache(cacheFilePath)
			const currentState = await serializePage(page)

			if (isSameState(cachedState, currentState)) {
				console.log(
					`[캐시 히트] ${title} - 페이지 상태 변경 없음. UI 컴포넌트 테스트를 건너뛰니다.`,
				)
				test.info().annotations.push({ type: 'cache-status', description: 'hit' })
				expect(consoleErrors, '콘솔 에러 체크 (캐시 히트)').toHaveLength(0)
				expect(failedRequests, '네트워크 에러 체크 (캐시 히트)').toHaveLength(0)
				await page.unroute('**/*') // 테스트 종료 전 라우팅 해제
				return
			}
			console.log(
				`[캐시 미스] ${title} - 캐시 없거나 상태 변경됨. UI 컴포넌트 테스트를 실행합니다.`,
			)
			test.info().annotations.push({ type: 'cache-status', description: 'miss' })

			await page.emulateMedia({ reducedMotion: 'reduce' })

			// Gremlins 실행 - 이제 네비게이션 시도가 차단될 것임
			await unleashGremlins(page)

			// 페이지 상태가 안정화될 시간을 잠시 줌 (선택 사항)
			// await page.waitForTimeout(500);

			// 테스트 정보 기록
			const dateNow = new Date()
			test.info().attach(`Date`, {
				body: dateNow.toLocaleString('ko-KR'),
			})

			const errors = R.concat(pageErrors, failedRequests)
			if (errors.length > 0) {
				test.info().attach('발견된 에러', {
					body: errors.join('\n'),
					contentType: 'text/plain',
				})
			}
			if (consoleErrors.length > 0) {
				test.info().attach('로그', {
					body: consoleErrors.join('\n'),
					contentType: 'text/plain',
				})
			}

			expect(pageErrors, '페이지 에러 체크').toHaveLength(0)
			expect(failedRequests, '네트워크 에러 체크').toHaveLength(0) // Aborted된 요청은 failedRequests에 포함되지 않음

			if (pageErrors.length === 0 && failedRequests.length === 0) {
				// 네트워크 에러도 체크
				console.log(`[캐시 쓰기] ${title} - 테스트 성공. 새로운 상태를 캐시합니다.`)
				// 캐시 쓰기 전에 현재 상태를 다시 한번 가져오는 것이 더 정확할 수 있음
				const finalState = await serializePage(page)
				writeCache(finalState, cacheFilePath)
			}
		} catch (error) {
			console.error('Gremlins 테스트 중 예상치 못한 오류 발생:', error)
			test.fail(true, `Gremlins 테스트 중 오류 발생: ${error.message}`)
		} finally {
			// 테스트 종료 시 라우팅 규칙 제거 (중요)
			await page.unroute('**/*')
		}
	})
}
