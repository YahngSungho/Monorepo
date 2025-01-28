import { expect, test } from '@playwright/test'
import manifest from '../storybook-static/index.json' assert { type: "json"}

for (const key of Object.keys(manifest.entries)) {
	const { id } = manifest.entries[key]

	if (id.endsWith('docs')) {
		continue
	}

	test(`방문: ${id.replace(/\-/g, ' > ')}`, async ({ page }) => {
		// 콘솔 오류 감지 설정 (페이지 이동 전에 설정)
		const consoleErrors = []
		page.on('console', msg => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text())
			}
		})

		// 네트워크 오류 감지 (페이지 이동 전에 설정)
		const failedRequests = []
		page.on('response', response => {
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
			throw new Error([
				...consoleErrors,
				...failedRequests
			].join('\n'))
		}
	})
}
