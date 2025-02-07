import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'
import path, { join } from 'node:path'

const VALID_ROUTE_FILE = '+page.svelte'
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/g

/**
 * @param {string} baseUrl
 * @param {string} testRoute
 * @param {import('@playwright/test').Page} page
 */
async function visitPage(baseUrl, testRoute, page) {
	const consoleErrors = []
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			consoleErrors.push(msg.text())
		}
	})

	const failedRequests = []
	page.on('response', (response) => {
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

	await speedCheck(page, testRoute)

	// 비동기 오류 수집을 위한 대기
	await page.waitForTimeout(500)
	await page.waitForLoadState('networkidle')

	if (consoleErrors.length > 0 || failedRequests.length > 0) {
		const errorMessage = [
			consoleErrors.length > 0 ? '콘솔 에러:' : '',
			...consoleErrors,
			failedRequests.length > 0 ? '네트워크 에러:' : '',
			...failedRequests,
		]
			.filter(Boolean)
			.join('\n')

		throw new Error(errorMessage)
	}
}

const PERFORMANCE_THRESHOLDS = {
	maxCLS: 0.1,
	maxLCP: 1500,
	maxLoadTime: 5000,
}

async function speedCheck(page, testRoute) {
	await page.waitForTimeout(1000)
	// 네트워크 유휴 상태까지 대기
	try {
		await page.waitForLoadState('networkidle', { timeout: 10_000 })
	} catch (error) {
		throw new Error(`Page load timeout: ${error.message}`)
	}

	// Navigation Timing API 대신 Performance API 사용
	const loadTime = await page.evaluate(() => {
		const navigation = performance.getEntriesByType('navigation')[0]
		// @ts-ignore
		return navigation.loadEventEnd - navigation.startTime
	})

	expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime)

	const lcp = await page.evaluate(
		() =>
			new Promise((resolve) => {
				const observer = new PerformanceObserver((list) => {
					const entries = list.getEntries()
					observer.disconnect()
					const lastEntry = entries.at(-1)
					resolve(lastEntry ? lastEntry.startTime : 0)
				})

				observer.observe({ buffered: true, type: 'largest-contentful-paint' })

				setTimeout(() => {
					observer.disconnect()
					test
						.info()
						.attach('performance-timeout', { body: 'largest-contentful-paint 지연시간 만료`' })
					console.error('largest-contentful-paint 지연시간 만료')
					resolve(0)
				}, 10_000)
			}),
	)
	expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLCP)

	const cls = await page.evaluate(
		() =>
			new Promise((resolve) => {
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

				observer.observe({ buffered: true, type: 'layout-shift' })

				setTimeout(() => {
					observer.disconnect()
					test.info().attach('performance-timeout', { body: 'layout-shift 지연시간 만료`' })
					console.error('layout-shift 지연시간 만료')
					resolve(0)
				}, 10_000)
			}),
	)
	expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.maxCLS)

	const routeName = testRoute.slice(1, -1).replace('\\', '/') || 'ROOT'
	const loadTime0 = Math.round(loadTime)
	const lcp0 = Math.round(lcp)
	const cls0 = Number(cls).toFixed(5)

	console.log(`
	< 성능: ${routeName} >
	Load: ${loadTime0}ms | LCP: ${lcp0}ms | CLS: ${cls0}`)

	// Playwright 내장 메트릭과 결합
	const performanceMetrics = {
		metrics: {
			cls0,
			lcp0,
			loadTime0,
		},
		route: routeName,
		timestamp: Date.now(),
	}
	test.info().attach(`성능: ${routeName}`, { body: JSON.stringify(performanceMetrics) })
}

/**
 * @param {string} projectRouteRoot
 * @param {{ [key: string]: string[] }} dynamicRouteParams
 */
function runTests(projectRouteRoot, dynamicRouteParams) {
	test.describe('스모크 테스트', () => {
		const routes = getRoutes(projectRouteRoot)
		const uniqueRoutes = [...new Set(routes.map((r) => r.route))].filter((route) => route !== '')
		const baseUrl = '.'
		const routeMap = new Map(routes.map((r) => [r.route, r]))

		for (const routePath of uniqueRoutes) {
			const routeInfo = routeMap.get(routePath)
			const testRoute = routePath || '/'

			if (routeInfo?.dynamic) {
				if (dynamicRouteParams[routePath]) {
					// 동적 라우트 테스트
					for (const paramExample of dynamicRouteParams[routePath]) {
						const dynamicTestRoute = testRoute.replaceAll(DYNAMIC_ROUTE_PATTERN, paramExample)
						// 파라미터 배열을 순차적으로 적용 (예: [id]/[slug] → 123/my-post)
						test(`방문: ${dynamicTestRoute} (dynamic)`, async ({ page }) => {
							const params = paramExample.split('/') // 예시: "123/my-post" → ["123", "my-post"]
							const expectedParams = testRoute.match(DYNAMIC_ROUTE_PATTERN) || []
							if (params.length !== expectedParams.length) {
								throw new Error(
									`Parameter count mismatch for route ${testRoute}. ` +
										`Expected ${expectedParams.length}, got ${params.length}`,
								)
							}
							const encodedParams = params.map((p) => encodeURIComponent(p))

							// 모든 동적 세그먼트를 순차적으로 치환
							let replacedRoute = testRoute
							let paramIndex = 0
							replacedRoute = replacedRoute.replaceAll(DYNAMIC_ROUTE_PATTERN, () => {
								return encodedParams[paramIndex++] || 'MISSING_PARAM'
							})

							await visitPage(baseUrl, replacedRoute, page)
						})
					}
				} else {
					console.warn(`동적 라우트 ${testRoute}에 대한 테스트 파라미터가 제공되지 않았습니다.`)
					test.skip(`방문: ${testRoute} (dynamic - 파라미터 없음)`, async () => {})
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
			test.skip('No routes found in src/routes', () => {})
		}
	})
}

/**
 * Recursively finds all valid routes within the SvelteKit project's route directory.
 *
 * @param {string} projectRouteRoot - The root directory of the SvelteKit project's routes.
 * @param {string} [dir=''] - The current directory being scanned (relative to projectRouteRoot).
 *   Default is `''`
 * @param {{ route: string; dynamic: boolean }[]} [routes=[]] - Accumulator for discovered routes.
 *   Default is `[]`
 * @returns {{ route: string; dynamic: boolean }[]} - An array of route objects.
 */
function getRoutes(projectRouteRoot, dir = '', routes = []) {
	const items = readdirSync(join(projectRouteRoot, dir), { withFileTypes: true })

	for (const item of items) {
		const fullPath = join(dir, item.name)

		if (item.isDirectory()) {
			getRoutes(projectRouteRoot, fullPath, routes)
		} else if (item.isFile() && item.name === VALID_ROUTE_FILE) {
			let routePath = path.posix
				.normalize(fullPath)
				.replace(VALID_ROUTE_FILE, '')
				.replace(/^src\/routes/, '')
				.replaceAll(/\(.*?\)\//g, '')
				.replace(/\/index$/, '/')

			if (!routePath.startsWith('/')) {
				routePath = '/' + routePath
			}

			const isDynamic = DYNAMIC_ROUTE_PATTERN.test(routePath)
			routes.push({ dynamic: isDynamic, route: routePath })
		}
	}
	return routes
}

export { runTests }
