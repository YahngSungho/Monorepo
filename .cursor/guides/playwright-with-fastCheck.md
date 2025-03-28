# Guide to Property-Based Testing for UI Components with Playwright and fast-check

## Setting Up Property-Based Testing with Playwright and fast-check

Property-based testing with Playwright and fast-check enables you to verify that your UI components and pages maintain certain properties across a wide range of inputs. This approach dramatically increases test coverage and helps catch edge cases that might be missed with traditional example-based testing.

### Basic Setup

```javascript
// tests/playwright.setup.js
const { expect } = require('@playwright/test')
const fc = require('fast-check')

/**
 * Helper function to run property-based tests with Playwright
 *
 * @param {function} testFn - Function containing the test logic
 * @param {fc.Arbitrary<any>} arbitrary - The arbitrary for generating test inputs
 * @param {object} fcOptions - Options for fast-check
 * @returns {Promise<void>}
 */
async function assertProperty(testFn, arbitrary, fcOptions = { numRuns: 10 }) {
	return fc.assert(fc.asyncProperty(arbitrary, testFn), fcOptions)
}

module.exports = { assertProperty }
```

## Strategies for UI Component Testing

### 1. Testing Form Components

```javascript
// tests/components/form.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { assertProperty } = require('../playwright.setup')

test('input field handles various valid inputs correctly', async ({ page }) => {
	await page.goto('/component-test-page')

	await assertProperty(
		async (input) => {
			// Clear previous input
			await page.fill('#username', '')

			// Type the generated input
			await page.fill('#username', input)

			// Validate component behavior
			const value = await page.inputValue('#username')
			return value === input // Property: input value is preserved
		},
		// Generate reasonable usernames
		fc.string({ minLength: 3, maxLength: 20 }).filter((s) => /^[A-Za-z0-9_-]+$/.test(s)),
		{ numRuns: 25 },
	)
})
```

### 2. Testing Responsive UI

```javascript
// tests/components/responsive.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { assertProperty } = require('../playwright.setup')

test('card component remains readable at various viewport sizes', async ({ page }) => {
	await page.goto('/cards-demo')

	await assertProperty(
		async (size) => {
			// Resize viewport
			await page.setViewportSize({
				width: size.width,
				height: size.height,
			})

			// Verify text elements remain visible
			const titleVisible = await page.isVisible('.card-title')
			const textVisible = await page.isVisible('.card-text')

			// Property: Text should remain visible at all sizes
			return titleVisible && textVisible
		},
		fc.record({
			width: fc.integer(320, 1920),
			height: fc.integer(568, 1080),
		}),
		{ numRuns: 15 },
	)
})
```

### 3. Using zod-fast-check for Component Props

```javascript
// tests/components/user-profile.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { ZodFastCheck } = require('zod-fast-check')
const { assertProperty } = require('../playwright.setup')

// Define schema for component props
const UserProps = z.object({
	name: z.string().min(1).max(50),
	age: z.number().int().min(18).max(100),
	role: z.enum(['admin', 'user', 'guest']),
	isActive: z.boolean(),
})

test('user profile displays all information correctly', async ({ page }) => {
	const userArbitrary = ZodFastCheck().inputOf(UserProps)

	await page.goto('/component-test-harness')

	await assertProperty(
		async (user) => {
			// Set component props via exposed function
			await page.evaluate((userData) => {
				window.setUserProfileProps(userData)
			}, user)

			// Wait for component to update
			await page.waitForTimeout(100)

			// Check rendering
			const nameText = await page.textContent('.user-name')
			const ageText = await page.textContent('.user-age')

			return nameText.includes(user.name) && ageText.includes(String(user.age))
		},
		userArbitrary,
		{ numRuns: 20 },
	)
})
```

## Best Practices and Tips

### 1. Limit Test Runs

Property-based tests with Playwright can be slow due to browser interactions. Limit `numRuns` to a reasonable number:

```javascript
// tests/components/efficient.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')

test('dropdown menu handles different option counts', async ({ page }) => {
	await page.goto('/dropdown-test')

	await fc.assert(
		fc.asyncProperty(fc.array(fc.string(), { minLength: 1, maxLength: 20 }), async (options) => {
			// Set options via page function
			await page.evaluate((opts) => {
				window.setDropdownOptions(opts)
			}, options)

			// Open dropdown
			await page.click('.dropdown-toggle')

			// Verify all options are present
			for (const option of options) {
				const isVisible = await page.isVisible(`.dropdown-item:has-text("${option}")`)
				if (!isVisible) return false
			}
			return true
		}),
		{ numRuns: 5 }, // Limit runs for UI tests
	)
})
```

### 2. Handle Async Operations Carefully

```javascript
// tests/components/async-component.spec.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('pagination controls handle different page counts', async ({ page }) => {
	await page.goto('/pagination-test')

	await fc.assert(
		fc.asyncProperty(
			fc.integer(1, 10), // Total pages
			fc.integer(1, 10).map((n) => Math.min(n, totalPages)), // Current page
			async (totalPages, currentPage) => {
				// Configure pagination
				await page.evaluate(
					({ total, current }) => {
						window.configurePagination(total, current)
					},
					{ total: totalPages, current: currentPage },
				)

				// Wait for component to update
				await page.waitForSelector('.pagination', { state: 'attached' })

				// Check active page indicator
				const activePageText = await page.textContent('.page-item.active')
				return activePageText.trim() === String(currentPage)
			},
		),
		{ numRuns: 8 },
	)
})
```

### 3. Use Realistic Input Generators

```javascript
// tests/components/search.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')

test('search component handles realistic queries', async ({ page }) => {
	await page.goto('/search-test')

	// More realistic search query generator
	const searchQueryArb = fc.oneof(
		fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789 '.split('')), {
			minLength: 1,
			maxLength: 30,
		}),
		fc.constant(''), // Empty search
		fc.string(1, 3), // Very short searches
	)

	await fc.assert(
		fc.asyncProperty(searchQueryArb, async (query) => {
			await page.fill('.search-input', query)
			await page.click('.search-button')

			// Wait for search results or empty state
			await page.waitForSelector('.search-results, .empty-results')

			// Property: Component should always show either results or empty state
			const hasResults = await page.isVisible('.search-results')
			const hasEmptyState = await page.isVisible('.empty-results')

			return hasResults || hasEmptyState
		}),
		{ numRuns: 10 },
	)
})
```

## Advanced Techniques

### 1. Shrinking to Find Minimal Failing Cases

When a property test fails, leverage fast-check's shrinking to find a minimal failing case:

```javascript
// tests/components/debug-failures.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')

test('calendar component handles date selection correctly', async ({ page }) => {
	await page.goto('/calendar-test')

	try {
		await fc.assert(
			fc.asyncProperty(
				fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31) }),
				async (date) => {
					// Format date
					const formatted = date.toISOString().split('T')[0]

					// Set date via component API
					await page.evaluate((dateStr) => {
						window.setSelectedDate(dateStr)
					}, formatted)

					// Check if displayed correctly
					const displayed = await page.textContent('.selected-date')
					return displayed.includes(formatted)
				},
			),
			{
				numRuns: 20,
				verbose: true, // Show more details on failure
			},
		)
	} catch (error) {
		console.log('Minimal failing case:', error.counterexample)
		throw error
	}
})
```

### 2. Testing with Controlled Randomness

Ensure deterministic testing with controlled randomness:

```javascript
// tests/components/deterministic.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')

test('randomized UI component behaves consistently', async ({ page }) => {
	await page.goto('/random-component-test')

	await fc.assert(
		fc.asyncProperty(fc.integer().noBias().noShrink(), async (seed) => {
			// Set random seed for component
			await page.evaluate((s) => {
				window.setRandomSeed(s)
			}, seed)

			// Take screenshot for visual comparison
			const screenshot = await page.screenshot()

			// Run the same test again with same seed
			await page.evaluate((s) => {
				window.resetAndSetRandomSeed(s)
			}, seed)

			const screenshot2 = await page.screenshot()

			// Property: Same seed should produce identical UI
			return screenshot.toString() === screenshot2.toString()
		}),
		{
			numRuns: 5,
			seed: 42, // Fixed seed for reproducibility
		},
	)
})
```

## Combining with Visual Testing

```javascript
// tests/components/visual-properties.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG

test('button component maintains visual consistency across states', async ({ page }) => {
	await page.goto('/button-test')

	const buttonStates = fc.record({
		text: fc.string(1, 20),
		disabled: fc.boolean(),
		variant: fc.constantFrom('primary', 'secondary', 'danger', 'success'),
	})

	await fc.assert(
		fc.asyncProperty(buttonStates, async (state) => {
			// Configure button
			await page.evaluate((config) => {
				window.configureButton(config)
			}, state)

			// Take screenshot
			const screenshot = await page.locator('.test-button').screenshot()

			// Property: Button height should not change based on text length
			const img = PNG.sync.read(screenshot)
			const previousHeight = await page.evaluate(() => {
				return window.lastButtonHeight || null
			})

			const currentHeight = img.height
			await page.evaluate((h) => {
				window.lastButtonHeight = h
			}, currentHeight)

			return previousHeight === null || currentHeight === previousHeight
		}),
		{ numRuns: 10 },
	)
})
```

Remember to adjust these examples to your specific testing needs while maintaining the focus on UI components without network or database dependencies.
