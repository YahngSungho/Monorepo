import { test, expect } from '@playwright/test'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import path from 'node:path'

console.log('visit.test.js')

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url) // eslint-disable-line
const __dirname = path.dirname(__filename)

// SvelteKit 라우트 디렉토리 구조 기반으로 경로 생성
const PROJECT_ROOT = join(__dirname, '../src/routes')
const IGNORED_FILES = ['+error.svelte', '+layout.svelte', '+page.svelte']
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/

function getRoutes(dir = '', routes = []) {
	const items = readdirSync(join(PROJECT_ROOT, dir), { withFileTypes: true })

	console.log('items: ', items)

	for (const item of items) {
		if (IGNORED_FILES.includes(item.name)) continue

		const routePath = join(dir, item.name.replace(/\.svelte$/, ''))
		console.log('routePath: ', routePath)

		if (item.isDirectory()) {
			getRoutes(routePath, routes)
		} else if (item.isFile()) {
			if (!DYNAMIC_ROUTE_PATTERN.test(routePath)) {
				const formattedRoute = routePath
					.replace(/\(.*?\)\//g, '') // 그룹 라우트 제거
					.replace(/\/index$/, '/')  // 인덱스 라우트 변환
					.replace(/\\/g, '/')      // Windows 경로 변환

				routes.push(formattedRoute)
			}
		}
	}

	return routes
}

test.describe('Basic page smoke tests', () => {
	const routes = getRoutes()
	console.log('getRoutes: ', routes)

	for (const route of routes) {
		test(`Should load ${route} without errors`, async ({ page }) => {
			const response = await page.goto(`http://localhost:5173${route}`)

			// 기본 HTTP 상태 코드 검증
			expect(response?.status()).toBeLessThan(400)

			await expect(page.locator('html')).toBeVisible()
			await expect(page.locator('body')).toBeVisible()
		})
	}
})