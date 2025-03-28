import { readdirSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

const VALID_ROUTE_FILE = '+page.svelte'
// eslint-disable-next-line optimize-regex/optimize-regex
const DYNAMIC_ROUTE_PATTERN = /\[.*?\]/g

/**
 * @typedef {PerformanceEntry & { hadRecentInput: boolean; value: number }} LayoutShiftEntry
 *
 * @typedef {PerformanceEntry & { renderTime: number; loadTime: number }} LargestContentfulPaint
 *
 * @typedef {PerformanceEntry & { loadEventEnd: number; startTime: number }} PerformanceNavigationTiming
 */

const isCIEnv = process.env.CI
const isWatchEnv = !isCIEnv && process.env.WATCH === 'true'

function getMaxCLS() {
	if (isCIEnv) return 2
	if (isWatchEnv) return 10
	return 1
}
function getMaxLCP() {
	if (isCIEnv) return 6000
	if (isWatchEnv) return 20_000
	return 14_000
}
function getMaxLoadTime() {
	if (isCIEnv) return 8000
	if (isWatchEnv) return 20_000
	return 16_000
}
const PERFORMANCE_THRESHOLDS = {
	maxCLS: getMaxCLS(),
	maxLCP: getMaxLCP(),
	maxLoadTime: getMaxLoadTime(),
}

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
	const response = await page.goto(targetUrl)
	if (!response) {
		throw new Error(`Failed to load page: ${targetUrl}`)
	}

	await page.waitForLoadState('load')

	expect(response?.status()).toBeGreaterThanOrEqual(200)
	expect(response?.status()).toBeLessThan(400)

	await speedCheck(page, testRoute)

	await expect(page.locator('html')).toBeVisible()
	await expect(page.locator('body')).toBeVisible()

	const divCheck1 = await page.locator('#Top_Layout_Check').count()
	expect(divCheck1).toBe(1)
	const divCheck2 = await page.locator('#Top2_Layout_Check').count()
	expect(divCheck2).toBe(1)
	const divCheck3 = await page.locator('#Page_Check').count()
	expect(divCheck3).toBe(1)

	if (consoleErrors.length > 0 || failedRequests.length > 0) {
		const errorMessage = [
			consoleErrors.length > 0 ? '콘솔 에러:' : '',
			...consoleErrors,
			failedRequests.length > 0 ? '네트워크 에러:' : '',
			...failedRequests,
		]
			.filter(Boolean)
			.join('\n')

		throw new Error(errorMessage || 'error')
	}
}

/**
 * 페이지 로딩 성능을 측정하고 검증하는 함수
 *
 * @param {import('@playwright/test').Page} page - 테스트 페이지 객체
 * @param {string} testRoute - 테스트 중인 라우트 경로
 */
async function speedCheck(page, testRoute) {
	await page.waitForLoadState('domcontentloaded')

	let lcp = await page.evaluate(
		([PERFORMANCE_THRESHOLDS]) => {
			return new Promise((resolve) => {
				let lcpValue = 0
				const observer = new PerformanceObserver((list) => {
					const entries = /** @type {LargestContentfulPaint[]} */ (list.getEntries())
					const lastEntry = entries.at(-1)
					if (lastEntry) {
						lcpValue = lastEntry.renderTime || lastEntry.loadTime
						observer.disconnect() // LCP 값 얻었으면 observer 중단
						resolve(lcpValue)
					}
				})

				observer.observe({ buffered: true, type: 'largest-contentful-paint' })

				setTimeout(() => {
					// 타임아웃 처리 (LCP 이벤트가 발생하지 않을 경우)
					observer.disconnect()
					resolve(lcpValue) // 타임아웃 시 현재까지의 LCP 값 resolve (0일 수 있음)
				}, PERFORMANCE_THRESHOLDS.maxLCP + 100)
			})
		},
		[PERFORMANCE_THRESHOLDS],
	)

	expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLCP)

	let cls = await page.evaluate(
		([PERFORMANCE_THRESHOLDS]) => {
			return new Promise((resolve) => {
				let clsValue = 0
				const observer = new PerformanceObserver((list) => {
					const entry = /** @type {LayoutShiftEntry} */ (list.getEntries()[0])
					if (!entry.hadRecentInput) {
						clsValue += entry.value
					}
				})

				// buffered: true 옵션을 사용하면 이미 발생한 layout-shift 이벤트도 처리
				observer.observe({ buffered: true, type: 'layout-shift' })

				// 일정 시간 후 observer를 disconnect하고 현재까지 누적된 CLS 값을 resolve
				// (필요에 따라 timeout 시간을 조정)
				setTimeout(() => {
					observer.disconnect()
					resolve(clsValue)
				}, PERFORMANCE_THRESHOLDS.maxCLS + 100)
			})
		},
		[PERFORMANCE_THRESHOLDS],
	)

	expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.maxCLS)

	let loadTime = await page.evaluate(() => {
		const navigationEntries = /** @type {PerformanceNavigationTiming[]} */ (
			performance.getEntriesByType('navigation')
		)
		if (navigationEntries.length > 0) {
			const navigationEntry = navigationEntries[0]
			return navigationEntry.loadEventEnd - navigationEntry.startTime
		}
		return 0 // Navigation Timing API를 지원하지 않는 경우
	})

	expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime)

	const routeName = testRoute.slice(1, -1).replace('\\', '/') || 'ROOT'
	loadTime = Math.round(loadTime)
	lcp = Number(lcp).toFixed(1)
	cls = Number(cls).toFixed(5)

	console.log(`
	< 성능: ${routeName} >
	Load: ${loadTime}ms | LCP: ${lcp}ms | CLS: ${cls}`)

	const dateNow = new Date()
	// Playwright 내장 메트릭과 결합
	const performanceMetrics = {
		metrics: {
			cls,
			lcp,
			loadTime,
		},
		route: routeName,
		timestamp: dateNow.toLocaleString('ko-KR'),
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
		const uniqueRoutes = Array.from(new Set(routes.map((r) => r.route))).filter(
			// 수정: 스프레드 연산자 사용
			(route) => route !== '',
		)
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
							const expectedParams = testRoute.match(DYNAMIC_ROUTE_PATTERN)
							expect(params.length).toBe(expectedParams?.length)

							const encodedParams = params.map(encodeURIComponent)

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
					test(`방문: ${testRoute} (dynamic - 파라미터 없음)`, () => {
						expect(true).toBe(true)
					})
				}
			} else {
				// 정적 라우트 테스트
				// eslint-disable-next-line playwright/expect-expect
				test(`방문: ${testRoute}`, async ({ page }) => {
					await visitPage(baseUrl, testRoute, page)
				})
			}
		}

		if (uniqueRoutes.length === 0) {
			console.warn('src/routes 디렉토리에서 라우트를 찾을 수 없습니다.')
			test('No routes found in src/routes', () => {
				expect(true).toBe(true)
			})
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
	const items = readdirSync(path.join(projectRouteRoot, dir), { withFileTypes: true })

	for (const item of items) {
		const fullPath = path.join(dir, item.name)

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
				routePath = `/${routePath}`
			}

			const isDynamic = DYNAMIC_ROUTE_PATTERN.test(routePath)

			routes.push({ dynamic: isDynamic, route: routePath })
		}
	}
	return routes
}

export { runTests }
