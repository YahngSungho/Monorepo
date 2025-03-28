import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }
import { unleashGremlins } from './gremlins.js'

test.describe('Gremlins Unleashed', () => {
	// 타임아웃 설정 - Gremlins 실행에 충분한 시간을 제공
	test.setTimeout(120_000) // 2분

	for (const entry of Object.values(manifest.entries)) {
		if (!entry?.id) {
			continue
		}
		const { id } = entry
		if (id.endsWith('docs')) {
			continue
		}

		const title = id.replaceAll('--', ' @ ').replaceAll('-', ' > ')

		test(`${title}`, async ({ page }) => {
			// --- 추가: gremlins.js 스크립트 주입 ---
			// addInitScript는 페이지 로드 전에 실행되어 안정적
			await page.addInitScript({
				path: '../node_modules/gremlins.js/dist/gremlins.min.js', // 경로 확인 필요
			})
			// --- ---

			// 에러 핸들링 - 페이지에서 발생하는 오류를 테스트 오류로 전파
			page.on('pageerror', (err) => {
				// Annotation 대신 명확한 에러 메시지 전달 시도
				console.error(`페이지 오류 발생 감지: ${err.message}`)
				// test.fail(true, `페이지 오류 발생: ${err.message}`) // test.fail 대신 에러 throw
				throw new Error(`페이지 오류 발생: ${err.message}`) // 에러를 직접 throw하여 테스트 실패 유발
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

				// 스크린샷 (시작 전)
				await page.screenshot({ path: `./test-results/gremlins-${id}-before.png` })

				await page.waitForLoadState('networkidle') // 네트워크 안정화 대기

				// Gremlins 실행
				await unleashGremlins(page)

				// 스크린샷 (종료 후)
				await page.screenshot({ path: `./test-results/gremlins-${id}-after.png` })

				// 테스트 정보 기록
				const dateNow = new Date()
				test.info().attach(`Date`, {
					body: dateNow.toLocaleString('ko-KR'),
				})

				// consoleErrors 내용 출력 (디버깅용)
				if (consoleErrors.length > 0) {
					test.info().attach('발견된 콘솔 에러', {
						body: consoleErrors.join('\n'),
						contentType: 'text/plain',
					})
				}

				// --- 추가: 콘솔 에러 검증 ---
				// pageerror로 잡히지 않은 콘솔 에러도 실패 처리
				expect(consoleErrors, '콘솔 에러 체크').toHaveLength(0)
				// --- ---
				expect(failedRequests, '네트워크 에러 체크').toHaveLength(0)
			} catch (error) {
				console.error('Gremlins 테스트 중 오류 발생:', error)
				// 오류 발생 시 스크린샷 캡처
				await page.screenshot({ path: `./test-results/gremlins-${id}-error.png` })
				// 에러를 다시 throw하여 테스트 실패 상태 유지
				throw error
			}
		})
	}
})
