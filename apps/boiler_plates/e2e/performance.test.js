// tests/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance benchmarks', () => {
	const PERFORMANCE_THRESHOLDS = {
		maxLoadTime: 2000,
		maxLCP: 1500,
		maxCLS: 0.1
	}

	test('Homepage performance metrics', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' })

		const metrics = await page.evaluate(() =>
			JSON.parse(JSON.stringify(window.performance))
		)

		const navigationTiming = metrics.timing
		const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart

		expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime)

		const lcp = await page.evaluate(() =>
			new Promise(resolve => {
				new PerformanceObserver(list => {
					const entries = list.getEntries()
					resolve(entries[entries.length - 1]?.startTime || 0)
				}).observe({ type: 'largest-contentful-paint', buffered: true })
			})
		)

		expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLCP)
	})
})