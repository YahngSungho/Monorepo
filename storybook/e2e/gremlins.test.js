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
	// gremlins.js 스크립트를 페이지에 추가 (테스트 파일에서 호출하므로 여기서 제거 가능)
	// await page.addScriptTag({
	// 	path: '../node_modules/gremlins.js/dist/gremlins.min.js', // 경로 수정 금지
	// })

	// 에러 핸들링 (테스트 파일에서 처리하므로 제거)
	// page.on('pageerror', (err) => {
	// 	throw err
	// })

	// Horde 생성 및 실행
	await page.evaluate(async () => {
		// @ts-ignore - window.gremlins는 addScriptTag/addInitScript에 의해 로드됨
		const horde = globalThis.gremlins.createHorde({
			species: [
				// @ts-ignore - 타입 오류 무시
				globalThis.gremlins.species.clicker({
					clickTypes: ['click'],
					canClick: () => true,
				}),
				globalThis.gremlins.species.clicker(),
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

		// unleash()가 반환하는 Promise를 직접 await
		// 에러 발생 시 page.evaluate가 reject되어 Playwright 테스트 실패 유발
		await horde.unleash({ nb: 1000 })
		console.log('Gremlins 공격 완료')
	})
}

for (const entry of Object.values(manifest.entries)) {
	if (!process.env.CI) {
		break
	}

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
		// --- 추가: gremlins.js 스크립트 주입 ---
		// addInitScript는 페이지 로드 전에 실행되어 안정적
		await page.addInitScript({
			path: '../node_modules/gremlins.js/dist/gremlins.min.js', // 경로 확인 필요
		})
		// --- ---

		const pageErrors = []
		// 에러 핸들링 - 페이지에서 발생하는 오류를 테스트 오류로 전파
		page.on('pageerror', (err) => {
			pageErrors.push(err.message)
			// Annotation 대신 명확한 에러 메시지 전달 시도
			console.error(`페이지 오류 발생 감지: ${err.message}`)
		})

		// 콘솔 오류 감지 설정
		const consoleErrors = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text())
				console.log(`콘솔 에러 감지: ${msg.text()}`)
			}
		})

		// 네트워크 오류 감지
		const failedRequests = []
		page.on('response', (response) => {
			if (response.status() >= 400) {
				failedRequests.push(`${response.url()} (${response.status()})`)
			}
		})

		try {
			// 페이지 이동
			await page.goto(`./iframe.html?id=${id}&viewMode=story`)
			await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 5000 })

			const cachedState = readCache(cacheFilePath)
			const currentState = await serializePage(page)

			if (isSameState(cachedState, currentState)) {
				console.log(
					`[캐시 히트] ${title} - 페이지 상태 변경 없음. UI 컴포넌트 테스트를 건너뛰니다.`,
				)
				test.info().annotations.push({ type: 'cache-status', description: 'hit' })
				expect(consoleErrors, '콘솔 에러 체크 (캐시 히트)').toHaveLength(0)
				expect(failedRequests, '네트워크 에러 체크 (캐시 히트)').toHaveLength(0)
				return
			}
			console.log(
				`[캐시 미스] ${title} - 캐시 없거나 상태 변경됨. UI 컴포넌트 테스트를 실행합니다.`,
			)
			test.info().annotations.push({ type: 'cache-status', description: 'miss' })

			await page.emulateMedia({ reducedMotion: 'reduce' })
			// Gremlins 실행
			await unleashGremlins(page)

			// 테스트 정보 기록
			const dateNow = new Date()
			test.info().attach(`Date`, {
				body: dateNow.toLocaleString('ko-KR'),
			})

			const errors = R.concat(pageErrors, failedRequests)
			// consoleErrors 내용 출력 (디버깅용)
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
			expect(failedRequests, '네트워크 에러 체크').toHaveLength(0)

			if (pageErrors.length === 0) {
				console.log(`[캐시 쓰기] ${title} - 테스트 성공. 새로운 상태를 캐시합니다.`)
				writeCache(currentState, cacheFilePath)
			}
		} catch (error) {
			console.error('Gremlins 테스트 중 오류 발생:', error)
			// 에러를 다시 throw하여 테스트 실패 상태 유지
			test.fail(true, `Gremlins 테스트 중 오류 발생: ${error.message}`)
		}
	})
}
