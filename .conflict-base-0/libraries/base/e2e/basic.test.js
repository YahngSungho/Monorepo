import { expect, test } from '@playwright/test'

test('실행: Playwright', async ({ page }) => {
	await page.goto('/')

	await expect(page.locator('html')).toBeVisible()
	await expect(page.locator('body')).toBeVisible()
})
