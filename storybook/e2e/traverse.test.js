import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }

console.log('storybook/e2e/traverse.test.js')

for (const entry of Object.values(manifest.entries)) {
	console.log('💬 entry:', entry)
	console.log('💬 entry?.id:', entry?.id)
	if (!entry?.id) {
		continue
	}
	const { id } = entry
	if (id.endsWith('docs')) {
		continue
	}

	const title = id.replaceAll('-', ' > ')
	test(`방문: ${title}`, async ({ page }) => {
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

		// 약간의 대기 시간 추가 (비동기 오류 수집을 위해)
		await page.waitForTimeout(500)

		// 에러 체크
		if (consoleErrors.length > 0 || failedRequests.length > 0) {
			// eslint-disable-next-line unicorn/error-message
			throw new Error([...consoleErrors, ...failedRequests].join('\n'))
		}

		const dateNow = new Date()
		test.info().attach(`Time:${title}`, {
			body: dateNow.toLocaleString('ko-KR'),
		})
	})
}
