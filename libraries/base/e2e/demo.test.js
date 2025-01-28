import { expect, test } from '@playwright/test'

test('Playwright Running', async ({ page }) => {
	await page.goto('/')

	await expect(page.locator('html')).toBeVisible()
	await expect(page.locator('body')).toBeVisible()
})
