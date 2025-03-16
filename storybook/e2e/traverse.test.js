import { expect, test } from '@playwright/test'

import manifest from '../storybook-static/index.json' with { type: 'json' }
for (const entry of Object.values(manifest.entries)) {
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
				// eslint-disable-next-line functional/immutable-data
				consoleErrors.push(msg.text())
			}
		})

		// 네트워크 오류 감지 (페이지 이동 전에 설정)
		const failedRequests = []
		page.on('response', (response) => {
			if (response.status() >= 400) {
				// eslint-disable-next-line functional/immutable-data
				failedRequests.push(`${response.url()} (${response.status()})`)
			}
		})

		await page.goto(`./iframe.html?id=${id}&viewMode=story`)
		await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 5000 })

		// 에러 체크
		expect(consoleErrors, '콘솔 에러가 없어야 합니다').toHaveLength(0)
		expect(failedRequests, '네트워크 오류가 없어야 합니다').toHaveLength(0)

		const dateNow = new Date()
		test.info().attach(`Time:${title}`, {
			body: dateNow.toLocaleString('ko-KR'),
		})
	})
}
