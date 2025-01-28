import { test, expect } from '@playwright/test'
import { readdirSync } from 'fs'
import { join } from 'path'

const VALID_ROUTE_FILE = '+page.svelte' // Valid SvelteKit page route file
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/ // 패턴 재활용

/**
 *
 * @param {*} projectRouteRoot
 * @param {{ [key: string]: string[] }} dynamicRouteParams
 */
function runTests(projectRouteRoot, dynamicRouteParams) {
	test.describe('SvelteKit Route Smoke Tests', () => {
		const routes = getRoutes(projectRouteRoot)
		const uniqueRoutes = [...new Set(routes.map(r => r.route))].filter(route => route !== '')
		const baseUrl = '.'
		const routeMap = new Map(routes.map(r => [r.route, r])) // Route 정보를 Map으로 관리 (dynamic 속성 접근 용이)


		console.log(`Testing routes: ${routes.length} found`)


		for (const routePath of uniqueRoutes) {
			const routeInfo = routeMap.get(routePath)
			const testRoute = routePath || '/'


			if (routeInfo?.dynamic && dynamicRouteParams[routePath]) {
				// Test dynamic routes with parameter examples
				const paramExamples = dynamicRouteParams[routePath]
				for (const paramExample of paramExamples) {
					const dynamicTestRoute = testRoute.replace(DYNAMIC_ROUTE_PATTERN, paramExample) // 파라미터 적용
					test(`Load ${dynamicTestRoute} (dynamic) successfully`, async ({ page }) => {
						const targetUrl = `${baseUrl}${dynamicTestRoute}`
						console.log(`  Testing Dynamic Route: ${targetUrl}`)
						const response = await page.goto(targetUrl)
						expect(response?.status()).toBeGreaterThanOrEqual(200)
						expect(response?.status()).toBeLessThan(400)
						await expect(page.locator('html')).toBeVisible()
						await expect(page.locator('body')).toBeVisible()
					})
				}
			} else {
				// Test static routes
				test(`Load ${testRoute} successfully`, async ({ page }) => {
					const targetUrl = `${baseUrl}${testRoute}`
					console.log(`  Testing Static Route: ${targetUrl}`)
					const response = await page.goto(targetUrl)
					expect(response?.status()).toBeGreaterThanOrEqual(200)
					expect(response?.status()).toBeLessThan(400)
					await expect(page.locator('html')).toBeVisible()
					await expect(page.locator('body')).toBeVisible()
				})
			}
		}


		if (uniqueRoutes.length === 0) {
			test.skip('No routes found in src/routes', () => {
				console.warn('No routes found in src/routes directory. Skipping route tests.')
			})
		}
	})
}

/**
 * Recursively finds all valid routes within the SvelteKit project's route directory.
 * Detects if a route is dynamic and returns parameter examples if available.
 *
 * @param {string} dir - The current directory being scanned (relative
 * to projectRouteRoot).
 * @param {Array<{route: string, dynamic: boolean, paramExamples?: string[]}>} routes - Accumulator for discovered routes.
 * @returns {Array<{route: string, dynamic: boolean, paramExamples?: string[]}>} - An array of route objects.
 */
function getRoutes(projectRouteRoot, dir = '', routes = []) {
	const items = readdirSync(join(projectRouteRoot, dir), { withFileTypes: true })

	for (const item of items) {
		const fullPath = join(dir, item.name)

		if (item.isDirectory()) {
			getRoutes(projectRouteRoot, fullPath, routes) // Recursively scan subdirectories
		} else if (item.isFile() && item.name === VALID_ROUTE_FILE) {
			let routePath = fullPath
				.replace(VALID_ROUTE_FILE, '') // Remove '+page.svelte' filename
				.replace(/^src\/routes/, '')   // Remove base routes path
				.replace(/\\/g, '/')          // Normalize Windows paths
				.replace(/\(.*?\)\//g, '')     // Remove group routes
				.replace(/\/index$/, '/')     // Index routes to root

			if (!routePath.startsWith('/')) {
				routePath = '/' + routePath // Ensure leading slash
			}

			const isDynamic = DYNAMIC_ROUTE_PATTERN.test(routePath)
			routes.push({ route: routePath, dynamic: isDynamic }) // 동적 여부 정보 추가
		}
	}
	return routes
}


export { runTests }