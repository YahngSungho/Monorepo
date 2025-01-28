
/* eslint-disable unicorn/numeric-separators-style */

import { expect, test } from '@playwright/test'
import manifest from '../storybook-static/index.json' assert{ type: "json"}

for (const key of Object.keys(manifest.entries)) {
	const { id, title } = manifest.entries[key]

	test(`Visiting ${title}:${id}`, async ({ page }) => {
		await page.goto(`./iframe.html?id=${id}&viewMode=story`)
		await expect(page.locator('body')).toBeVisible({ timeout: 5000 })
	})
}
