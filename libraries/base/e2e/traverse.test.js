import { test, expect } from '@playwright/test'
import { readdirSync } from 'fs'
import path, { join } from 'path'

const VALID_ROUTE_FILE = '+page.svelte'
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/g

/**
 * @param {string} baseUrl
 * @param {string} testRoute
 * @param {import('@playwright/test').Page} page
 */
async function visitPage(baseUrl, testRoute, page) {
	const consoleErrors = []
	page.on('console', msg => {
		if (msg.type() === 'error') {
			consoleErrors.push(msg.text())
		}
	})

	const failedRequests = []
	page.on('response', response => {
		if (response.status() >= 400) {
			failedRequests.push(`${response.url()} (${response.status()})`)
		}
	})

	const targetUrl = `${baseUrl}${testRoute}`
	const response = await page.goto(targetUrl, { waitUntil: 'load' })
	if (!response) {
		throw new Error(`Failed to load page: ${targetUrl}`)
	}

	expect(response?.status()).toBeGreaterThanOrEqual(200)
	expect(response?.status()).toBeLessThan(400)
	await expect(page.locator('html')).toBeVisible()
	await expect(page.locator('body')).toBeVisible()
	// 스모크 테스트 div 체크 추가: 페이지에 #topDivForSmokeTest div가 하나 존재해야 합니다
	const topDivCount = await page.locator('#topDivForSmokeTest').count()
	expect(topDivCount).toBe(1)

	await speedCheck(page)

	// 비동기 오류 수집을 위한 대기
	await page.waitForTimeout(500)
	await page.waitForLoadState('networkidle')

	if (consoleErrors.length > 0 || failedRequests.length > 0) {
		const errorMessage = [
			consoleErrors.length > 0 ? '콘솔 에러:' : '',
			...consoleErrors,
			failedRequests.length > 0 ? '네트워크 에러:' : '',
			...failedRequests
		].filter(Boolean).join('\n')

		throw new Error(errorMessage)
	}
}

const PERFORMANCE_THRESHOLDS = {
	maxLoadTime: 5000,
	maxLCP: 1500,
	maxCLS: 0.1
}

async function speedCheck(page) {
	// 네트워크 유휴 상태까지 대기
	await page.waitForLoadState('networkidle')

	// Navigation Timing API 대신 Performance API 사용
	const loadTime = await page.evaluate(() => {
		const navigation = performance.getEntriesByType('navigation')[0]
		// @ts-ignore
		return navigation.loadEventEnd - navigation.startTime
	})

	expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime)

	const lcp = await page.evaluate(() =>
		new Promise(resolve => {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries()
				observer.disconnect()
				const lastEntry = entries[entries.length - 1]
				resolve(lastEntry ? lastEntry.startTime : 0)
			})

			observer.observe({ type: 'largest-contentful-paint', buffered: true })

			setTimeout(() => {
				observer.disconnect()
				test.info().attach('performance-timeout', { body: 'largest-contentful-paint 지연시간 만료`' })
				console.error('largest-contentful-paint 지연시간 만료')
				resolve(0)
			}, 10000)
		})
	)
	expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLCP)

	const cls = await page.evaluate(() =>
		new Promise(resolve => {
			let clsValue = 0
			const observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					// @ts-ignore
					if (!entry.hadRecentInput) {
						// @ts-ignore
						clsValue += entry.value
					}
				}
				observer.disconnect()
				resolve(clsValue)
			})

			observer.observe({ type: 'layout-shift', buffered: true })

			setTimeout(() => {
				observer.disconnect()
				test.info().attach('performance-timeout', { body: 'layout-shift 지연시간 만료`' })
				console.error('layout-shift 지연시간 만료')
				resolve(0)
			}, 10000)
		})
	)
	expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.maxCLS)

	// Playwright 내장 메트릭과 결합
	const performanceMetrics = await page.evaluate(() =>
		JSON.parse(JSON.stringify(window.performance.timing))
	)

	console.log(`성능 메트릭 - LCP: ${lcp}ms, CLS: ${cls}, Load: ${loadTime}ms`)
}

/**
 * @param {string} projectRouteRoot
 * @param {{ [key: string]: string[] }} dynamicRouteParams
 */
function runTests(projectRouteRoot, dynamicRouteParams) {
	test.describe('스모크 테스트', () => {
		const routes = getRoutes(projectRouteRoot)
		const uniqueRoutes = [...new Set(routes.map(r => r.route))].filter(route => route !== '')
		const baseUrl = '.'
		const routeMap = new Map(routes.map(r => [r.route, r]))

		for (const routePath of uniqueRoutes) {
			const routeInfo = routeMap.get(routePath)
			const testRoute = routePath || '/'

			if (routeInfo?.dynamic) {
				if (dynamicRouteParams[routePath]) {
					// 동적 라우트 테스트
					for (const paramExample of dynamicRouteParams[routePath]) {
						const dynamicTestRoute = testRoute.replace(DYNAMIC_ROUTE_PATTERN, paramExample)
						// 파라미터 배열을 순차적으로 적용 (예: [id]/[slug] → 123/my-post)
						test(`방문: ${dynamicTestRoute} (dynamic)`, async ({ page }) => {
							const params = paramExample.split('/') // 예시: "123/my-post" → ["123", "my-post"]
							let replacedRoute = testRoute
							let paramIndex = 0

							// 모든 동적 세그먼트를 순차적으로 치환
							replacedRoute = replacedRoute.replaceAll(DYNAMIC_ROUTE_PATTERN, () => {
								return params[paramIndex++] || 'MISSING_PARAM'
							})

							await visitPage(baseUrl, replacedRoute, page)
						})
					}
				} else {
					console.warn(`동적 라우트 ${testRoute}에 대한 테스트 파라미터가 제공되지 않았습니다.`)
					test.skip(`방문: ${testRoute} (dynamic - 파라미터 없음)`, async () => { })
				}
			} else {
				// 정적 라우트 테스트
				test(`방문: ${testRoute}`, async ({ page }) => {
					await visitPage(baseUrl, testRoute, page)
				})
			}
		}

		if (uniqueRoutes.length === 0) {
			console.warn('src/routes 디렉토리에서 라우트를 찾을 수 없습니다.')
			test.skip('No routes found in src/routes', () => { })
		}
	})
}

/**
 * Recursively finds all valid routes within the SvelteKit project's route directory.
 *
 * @param {string} projectRouteRoot - The root directory of the SvelteKit project's routes.
 * @param {string} [dir=''] - The current directory being scanned (relative to projectRouteRoot).
 * @param {Array<{route: string, dynamic: boolean}>} [routes=[]] - Accumulator for discovered routes.
 * @returns {Array<{route: string, dynamic: boolean}>} - An array of route objects.
 */
function getRoutes(projectRouteRoot, dir = '', routes = []) {
	const items = readdirSync(join(projectRouteRoot, dir), { withFileTypes: true })

	for (const item of items) {
		const fullPath = join(dir, item.name)

		if (item.isDirectory()) {
			getRoutes(projectRouteRoot, fullPath, routes)
		} else if (item.isFile() && item.name === VALID_ROUTE_FILE) {
			let routePath = path
				.posix
				.normalize(fullPath)
				.replace(VALID_ROUTE_FILE, '')
				.replace(/^src\/routes/, '')
				.replace(/\(.*?\)\//g, '')
				.replace(/\/index$/, '/')

			if (!routePath.startsWith('/')) {
				routePath = '/' + routePath
			}

			const isDynamic = DYNAMIC_ROUTE_PATTERN.test(routePath)
			routes.push({ route: routePath, dynamic: isDynamic })
		}
	}
	return routes
}

export { runTests }