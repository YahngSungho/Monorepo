import { test, expect } from '@playwright/test'
import { readdirSync } from 'fs'
import { join } from 'path'

const VALID_ROUTE_FILE = '+page.svelte' // Valid SvelteKit page route file
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/


/**
 * @param {string} baseUrl
 * @param {string} testRoute
 * @param {import('@playwright/test').Page} page
 */
async function visitPage(baseUrl, testRoute, page) {
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

	const targetUrl = `${baseUrl}${testRoute}`
	const response = await page.goto(targetUrl, { waitUntil: 'load' })

	expect(response?.status()).toBeGreaterThanOrEqual(200)
	expect(response?.status()).toBeLessThan(400)
	await expect(page.locator('html')).toBeVisible()
	await expect(page.locator('body')).toBeVisible()

	await sppeedCheck(page)

	// 약간의 대기 시간 추가 (비동기 오류 수집을 위해)
	await page.waitForTimeout(500)

	// 에러 기록
	if (consoleErrors.length > 0 || failedRequests.length > 0) {
		throw new Error([
			...consoleErrors,
			...failedRequests
		].join('\n'))
	}
}


const PERFORMANCE_THRESHOLDS = {
	maxLoadTime: 2000,
	maxLCP: 1500,
	maxCLS: 0.1
}

async function sppeedCheck(page) {
	const metrics = await page.evaluate(() =>
		JSON.parse(JSON.stringify(window.performance))
	)

	const navigationTiming = metrics.timing
	const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart

	expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime)

	const lcp = await page.evaluate(() =>
		new Promise(resolve => {
			let observer
			observer = new PerformanceObserver(list => {
				observer.disconnect()
				const entries = list.getEntries()
				const lastEntry = entries[entries.length - 1]
				resolve(lastEntry ? lastEntry.startTime : 0)
			})
			observer.observe({ type: 'largest-contentful-paint', buffered: true })
		})
	)
	expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLCP)

	const cls = await page.evaluate(() =>
		new Promise(resolve => {
			let clsValue = 0
			let observer
			observer = new PerformanceObserver(list => {
				/** @type {PerformanceEntry[]} entries */
				const entries = list.getEntries()
				entries.forEach(entry => {
					if (entry.entryType === 'layout-shift') {
						const layoutShiftEntry = entry
						// hadRecentInput 속성 존재 여부 체크 후 접근
						const hadRecentInput = 'hadRecentInput' in layoutShiftEntry ? layoutShiftEntry.hadRecentInput : false
						// value 속성 존재 여부 체크 후 접근

						const value = 'value' in layoutShiftEntry ? Number(layoutShiftEntry.value) : 0

						if (!hadRecentInput) {
							clsValue += value
						} else {
							clsValue += value
						}
					}
				})
				resolve(clsValue)
			})
			observer.observe({ type: 'layout-shift', buffered: true })
		})
	)
	expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.maxCLS)
}


/**
 *
 * @param {string} projectRouteRoot
 * @param {{ [key: string]: string[] }} dynamicRouteParams
 */
function runTests(projectRouteRoot, dynamicRouteParams) {
	test.describe('스모크 테스트', () => {
		const routes = getRoutes(projectRouteRoot)
		const uniqueRoutes = [...new Set(routes.map(r => r.route))].filter(route => route !== '')
		const baseUrl = '.'
		const routeMap = new Map(routes.map(r => [r.route, r])) // Route 정보를 Map으로 관리 (dynamic 속성 접근 용이)

		for (const routePath of uniqueRoutes) {
			const routeInfo = routeMap.get(routePath)
			const testRoute = routePath || '/'

			if (routeInfo?.dynamic && dynamicRouteParams[routePath]) {
				// Test dynamic routes with parameter examples
				const paramExamples = dynamicRouteParams[routePath]
				for (const paramExample of paramExamples) {
					const dynamicTestRoute = testRoute.replace(DYNAMIC_ROUTE_PATTERN, paramExample) // 파라미터 적용
					test(`방문: ${dynamicTestRoute} (dynamic)`, async ({ page }) => {
						await visitPage(baseUrl, dynamicTestRoute, page)
					})
				}
			} else {
				// Test static routes
				test(`방문: ${testRoute}`, async ({ page }) => {
					await visitPage(baseUrl, testRoute, page)
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
 * @param {string} projectRouteRoot - The root directory of the SvelteKit project's routes.
 * @param {string} [dir=''] - The current directory being scanned (relative to projectRouteRoot).
 * @param {Array<{route: string, dynamic: boolean, paramExamples?: string[]}>} [routes=[]] - Accumulator for discovered routes.
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