import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }
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
	test(`${title}`, async ({ page }) => {
		// 캐시 비활성화를 위한 라우트 설정
		// await page.route('**', (route) => route.continue())

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
		await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 5000 })
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

		expect(consoleErrors, '콘솔 에러 체크').toHaveLength(0)
		expect(failedRequests, '네트워크 에러 체크').toHaveLength(0)

		// UI 컴포넌트 에러 정보 첨부
		const errorMessages = (results.errors ?? []).map((error) => `- ${error.message}`).join('\n')
		test.info().attach(`UI Component Errors (${results.errors?.length ?? 0})`, {
			body: errorMessages,
			contentType: 'text/plain',
		})

		expect(results.errors.length).toBe(0)
		expect(results.success).toBe(true)
	})
}
