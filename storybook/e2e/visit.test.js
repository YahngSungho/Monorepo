
/* eslint-disable unicorn/numeric-separators-style */

import { expect, test } from '@playwright/test'
import manifest from '../storybook-static/index.json' assert{ type: "json"}

for (const key of Object.keys(manifest.entries)) {
	const { id, title } = manifest.entries[key]

	if (id.endsWith('docs')) {
		continue
	}

	test(`Visiting ${title}: ${id}`, async ({ page }) => {
		await page.goto(`./iframe.html?id=${id}&viewMode=story`)
		await expect(page.locator('#storybook-root')).toBeVisible({ timeout: 5000 })

		// 콘솔 오류 감지 설정
		const consoleErrors = []
		page.on('console', msg => {
			if (msg.type() === 'error') consoleErrors.push(msg.text())
		})

		// 네트워크 오류 감지
		const failedRequests = []
		page.on('response', response => {
			if (response.status() >= 400) {
				failedRequests.push(`${response.url()} (${response.status()})`)
			}
		})

		// 에러 체크
		if (consoleErrors.length > 0 || failedRequests.length > 0) {
			throw new Error([
				...consoleErrors,
				...failedRequests
			].join('\n'))
		}
	})
}
