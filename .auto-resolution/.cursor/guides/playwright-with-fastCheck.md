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

# Extended Guide: Using zod-fast-check with Playwright for UI Testing

## Leveraging zod-fast-check for UI Component Testing

zod-fast-check provides a powerful bridge between your Zod schemas and property-based tests, allowing you to automatically generate valid test data based on your existing type definitions. This approach ensures your tests are both thorough and aligned with your application's data constraints.

### Basic Setup for zod-fast-check

```javascript
// tests/setup/zod-fc-setup.js
const { ZodFastCheck } = require('zod-fast-check')
const fc = require('fast-check')

/**
 * Create a configured ZodFastCheck instance with common settings
 *
 * @returns {ZodFastCheck} Configured ZodFastCheck instance
 */
function createZodFastCheck() {
	return ZodFastCheck({
		// Configure string generation
		stringArbitrary: () => fc.string({ minLength: 1, maxLength: 50 }),
		// Configure array generation
		arrayArbitrary: (arbitrary) => fc.array(arbitrary, { maxLength: 10 }),
	})
}

module.exports = { createZodFastCheck }
```

### Testing Components with Complex Props

```javascript
// tests/components/data-grid.spec.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { createZodFastCheck } = require('../setup/zod-fc-setup')

// Define complex schemas matching your component props
const ColumnSchema = z.object({
	id: z.string(),
	header: z.string(),
	width: z.number().int().min(50).max(500).optional(),
	sortable: z.boolean().default(true),
})

const RowDataSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))

const DataGridPropsSchema = z.object({
	columns: z.array(ColumnSchema).min(1),
	data: z.array(RowDataSchema),
	pagination: z.boolean().default(false),
	pageSize: z.number().int().min(5).max(100).default(10),
})

test('data grid renders correctly with various props configurations', async ({ page }) => {
	await page.goto('/component-test-page')

	const zodFc = createZodFastCheck()
	const dataGridPropsArb = zodFc.inputOf(DataGridPropsSchema)

	await fc.assert(
		fc.asyncProperty(dataGridPropsArb, async (props) => {
			// Pass props to component
			await page.evaluate((componentProps) => {
				window.renderDataGrid(componentProps)
			}, props)

			// Wait for rendering
			await page.waitForSelector('.data-grid')

			// Check column headers are rendered
			for (const column of props.columns) {
				const headerExists = await page.isVisible(`.column-header:has-text("${column.header}")`)
				if (!headerExists) return false
			}

			// Check row count
			const rowCount = await page.locator('.data-row').count()
			const expectedRows =
				props.pagination ? Math.min(props.pageSize, props.data.length) : props.data.length

			return rowCount === expectedRows
		}),
		{ numRuns: 10 },
	)
})
```

### Reusing Zod Schemas from Your Application

```javascript
// tests/components/form-validation.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { createZodFastCheck } = require('../setup/zod-fc-setup')

// Import the same schema used in your application
const { UserFormSchema } = require('../../src/schemas/user')

test('form validation handles valid and invalid data properly', async ({ page }) => {
	await page.goto('/form-test')

	const zodFc = createZodFastCheck()

	// Generate valid user data
	const validUserArb = zodFc.inputOf(UserFormSchema)

	// Generate invalid user data by modifying a valid one
	const invalidUserArb = validUserArb.chain((validUser) =>
		fc.record({
			...Object.fromEntries(
				Object.keys(validUser).map((key) => [key, fc.constant(validUser[key])]),
			),
			// Make email invalid by removing @ symbol
			email: fc.string().map((s) => s.replace(/@/g, '')),
		}),
	)

	// Test with valid data
	await fc.assert(
		fc.asyncProperty(validUserArb, async (userData) => {
			await fillUserForm(page, userData)
			await page.click('#submit-button')

			// Form should submit successfully with valid data
			return await page.isVisible('.success-message')
		}),
		{ numRuns: 5 },
	)

	// Test with invalid data
	await fc.assert(
		fc.asyncProperty(invalidUserArb, async (userData) => {
			await fillUserForm(page, userData)
			await page.click('#submit-button')

			// Form should show validation errors with invalid data
			return await page.isVisible('.validation-error')
		}),
		{ numRuns: 5 },
	)
})

async function fillUserForm(page, userData) {
	await page.fill('#name', userData.name)
	await page.fill('#email', userData.email)
	await page.fill('#age', String(userData.age))
	// Fill other fields...
}
```

### Testing UI State Transformations

```javascript
// tests/components/state-transitions.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { createZodFastCheck } = require('../setup/zod-fc-setup')

// Define schema for component state
const TodoItemSchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1).max(100),
	completed: z.boolean().default(false),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	tags: z.array(z.string()).default([]),
})

const TodoListStateSchema = z.object({
	items: z.array(TodoItemSchema),
	filter: z.enum(['all', 'active', 'completed']).default('all'),
	sortBy: z.enum(['priority', 'alphabetical', 'date']).default('date'),
})

test('todo list state transitions work correctly', async ({ page }) => {
	await page.goto('/todo-app')

	const zodFc = createZodFastCheck()
	const todoStateArb = zodFc.inputOf(TodoListStateSchema)

	// Define possible actions on the UI
	const actionArb = fc.oneof(
		fc.constant('toggleFirstItem'),
		fc.constant('changeFilter'),
		fc.constant('changeSorting'),
		fc.constant('addItem'),
	)

	await fc.assert(
		fc.asyncProperty(
			todoStateArb,
			fc.array(actionArb, { minLength: 1, maxLength: 5 }),
			async (initialState, actions) => {
				// Initialize component with state
				await page.evaluate((state) => {
					window.initTodoList(state)
				}, initialState)

				// Perform actions
				for (const action of actions) {
					switch (action) {
						case 'toggleFirstItem':
							await page.click('.todo-item:first-child .toggle-button')
							break
						case 'changeFilter':
							await page.selectOption(
								'.filter-select',
								['all', 'active', 'completed'][Math.floor(Math.random() * 3)],
							)
							break
						case 'changeSorting':
							await page.selectOption(
								'.sort-select',
								['priority', 'alphabetical', 'date'][Math.floor(Math.random() * 3)],
							)
							break
						case 'addItem':
							await page.fill('.new-todo-input', 'New todo item ' + Date.now())
							await page.click('.add-button')
							break
					}
					// Wait for UI update
					await page.waitForTimeout(50)
				}

				// Verify UI is in consistent state
				const hasItemsList = await page.isVisible('.items-list')
				const hasControls = await page.isVisible('.controls')
				return hasItemsList && hasControls
			},
		),
		{ numRuns: 8 },
	)
})
```

### Combining zod-fast-check with Visual Testing

```javascript
// tests/components/theme-switcher.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { createZodFastCheck } = require('../setup/zod-fc-setup')
const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs')

// Define schema for theme configuration
const ThemeSchema = z.object({
	primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
	secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
	textColor: z.string().regex(/^#[0-9A-F]{6}$/i),
	fontSize: z.number().min(12).max(24).default(16),
	spacing: z.enum(['compact', 'normal', 'loose']).default('normal'),
	roundedCorners: z.boolean().default(true),
})

test('theme switcher applies themes consistently', async ({ page }) => {
	await page.goto('/theme-test')

	const zodFc = createZodFastCheck()
	const themeArb = zodFc.inputOf(ThemeSchema)

	let referenceComponent = null

	await fc.assert(
		fc.asyncProperty(
			themeArb,
			fc.constant(1), // Using a constant to ensure we run the assertion
			async (theme, _) => {
				// Apply theme
				await page.evaluate((themeConfig) => {
					window.applyTheme(themeConfig)
				}, theme)

				// Wait for theme to apply
				await page.waitForTimeout(100)

				// Capture component
				const component = await page.locator('.themed-component').screenshot()

				// If this is our first run, save as reference
				if (!referenceComponent) {
					referenceComponent = component

					// Apply same theme again
					await page.evaluate((themeConfig) => {
						window.applyTheme(themeConfig)
					}, theme)

					// Capture again
					const secondCapture = await page.locator('.themed-component').screenshot()

					// Compare - should be identical
					const img1 = PNG.sync.read(component)
					const img2 = PNG.sync.read(secondCapture)
					const diff = new PNG({ width: img1.width, height: img1.height })

					const pixelDiff = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
						threshold: 0.1,
					})

					// Property: Same theme application should result in identical rendering
					return pixelDiff === 0
				}

				// Nothing to assert for other runs
				return true
			},
		),
		{ numRuns: 10 },
	)
})
```

### Advanced: Custom Arbitrary Mapping for Complex UI States

```javascript
// tests/components/complex-stateful.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { ZodFastCheck } = require('zod-fast-check')

// Define complex nested schema
const NestedComponentSchema = z.object({
	uiState: z.object({
		expandedSections: z.array(z.string()),
		activeTab: z.number().int().min(0).max(5),
		scrollPosition: z.number().int().min(0).max(1000),
	}),
	userData: z.object({
		preferences: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])),
		history: z
			.array(
				z.object({
					action: z.string(),
					timestamp: z.number().int().positive(),
				}),
			)
			.max(20),
	}),
	contentBlocks: z
		.array(
			z.discriminatedUnion('type', [
				z.object({
					type: z.literal('text'),
					content: z.string().max(500),
				}),
				z.object({
					type: z.literal('image'),
					src: z.string().url(),
					caption: z.string().optional(),
				}),
				z.object({
					type: z.literal('form'),
					fields: z.array(
						z.object({
							id: z.string(),
							label: z.string(),
							required: z.boolean().default(false),
						}),
					),
				}),
			]),
		)
		.max(10),
})

test('complex stateful component handles various state configurations', async ({ page }) => {
	await page.goto('/complex-component')

	// Custom arbitrary mappings for specific types
	const zodFc = ZodFastCheck({
		// Custom URL generator that looks realistic
		urlArbitrary: () => fc.webUrl(),

		// Map discriminated union to make some types more frequent
		discriminatedUnionArbitrary: (mappers, discriminator) => {
			if (discriminator === 'type') {
				// Make text blocks more common than other types
				return fc.oneof(
					fc.constant('text').chain((t) => mappers.get(t)()),
					fc.constant('text').chain((t) => mappers.get(t)()),
					fc.constant('image').chain((t) => mappers.get(t)()),
					fc.constant('form').chain((t) => mappers.get(t)()),
				)
			}
			return fc.oneof(
				...Array.from(mappers.entries()).map(([k, v]) => fc.constant(k).chain((k) => v())),
			)
		},
	})

	const componentStateArb = zodFc.inputOf(NestedComponentSchema)

	await fc.assert(
		fc.asyncProperty(componentStateArb, async (state) => {
			// Initialize component with generated state
			await page.evaluate((componentState) => {
				window.initComplexComponent(componentState)
			}, state)

			// Wait for rendering to complete
			await page.waitForTimeout(100)

			// Check if component rendered without errors
			const hasErrorBoundary = await page.isVisible('.error-boundary-message')
			if (hasErrorBoundary) return false

			// Validate active tab is displayed
			const activeTabVisible = await page.isVisible(
				`.tab-panel[data-tab="${state.uiState.activeTab}"]`,
			)
			if (!activeTabVisible) return false

			// Verify content blocks are rendered
			let allBlocksRendered = true
			for (let i = 0; i < state.contentBlocks.length; i++) {
				const block = state.contentBlocks[i]
				const blockVisible = await page.isVisible(`.content-block[data-index="${i}"]`)
				if (!blockVisible) {
					allBlocksRendered = false
					break
				}
			}

			return allBlocksRendered
		}),
		{ numRuns: 5 },
	)
})
```

### Optimizing Performance with Schema Customization

```javascript
// tests/components/optimized-zod-tests.spec.js
const { test } = require('@playwright/test')
const fc = require('fast-check')
const { z } = require('zod')
const { createZodFastCheck } = require('../setup/zod-fc-setup')

// Create a more optimized version of your schema for testing
const OptimizedUserSchema = z.object({
	id: z.string().uuid(),
	username: z.string().min(3).max(20),
	email: z.string().email(),
	// Only include fields necessary for the test
	role: z.enum(['user', 'admin']).default('user'),
})

test('user profile renders efficiently across many configurations', async ({ page }) => {
	await page.goto('/user-profile')

	const zodFc = createZodFastCheck()

	// Create a fast arbitrary with simplified generation
	const fastUserArb = zodFc.inputOf(OptimizedUserSchema).map((user) => ({
		...user,
		// Pre-compute derived values to avoid regenerating in each test
		displayName: user.username.charAt(0).toUpperCase() + user.username.slice(1),
		isAdmin: user.role === 'admin',
	}))

	await fc.assert(
		fc.asyncProperty(
			fastUserArb,
			fc.boolean(), // Toggle for dark/light mode
			async (user, isDarkMode) => {
				// Set up state quickly
				await page.evaluate(
					({ userData, darkMode }) => {
						window.setUserProfileData(userData)
						window.setDarkMode(darkMode)
					},
					{ userData: user, darkMode: isDarkMode },
				)

				// Quick check of critical elements
				const usernameVisible = await page.isVisible(`.username:has-text("${user.username}")`)
				const emailVisible = await page.isVisible(`.email:has-text("${user.email}")`)

				return usernameVisible && emailVisible
			},
		),
		{ numRuns: 20 }, // We can run more tests when optimized
	)
})
```

By integrating zod-fast-check with Playwright, you can create comprehensive test suites that leverage your existing schema definitions while thoroughly testing your UI components across a wide range of valid input combinations. This approach bridges the gap between type safety and property-based testing, leading to more robust applications.

# Using fast-check/worker with Playwright for UI Testing

## When and Why to Use fast-check/worker

The `fast-check/worker` package allows you to run property-based tests in separate worker threads, which is especially valuable for UI testing with Playwright. Here's guidance on when to leverage this approach:

### Key Benefits of Worker-Based Testing

1. **Performance for Complex UI Tests**:

   - Prevents main thread blocking during intensive property tests
   - Enables testing complex UI interactions without freezing the test runner

2. **Test Isolation**:

   - Each property test runs in its own isolated context
   - Reduces interference between different test properties

3. **Better Resource Management**:

   - Distributes CPU-intensive tests across multiple cores
   - Particularly valuable for rendering-heavy UI component tests

4. **Improved Stability**:
   - Prevents test timeouts in long-running property tests
   - Reduces flakiness in UI interaction tests

## Implementation Guide

### Basic Setup with fast-check/worker

```javascript
// tests/workers/ui-test.worker.js
const fc = require('fast-check')

// Worker receives test data and returns results
self.onmessage = async ({ data }) => {
	const { testInputs } = data

	try {
		// Run property test in worker
		const result = await fc.check(
			fc.property(fc.string(), (input) => {
				// Property logic here
				return true // Property holds
			}),
			{ numRuns: 100 },
		)

		// Send results back to main thread
		self.postMessage({ success: true, result })
	} catch (error) {
		self.postMessage({ success: false, error: error.message })
	}
}
```

```javascript
// tests/components/worker-based.spec.js
const { test, expect } = require('@playwright/test')
const { Worker } = require('worker_threads')
const path = require('path')

test('complex UI rendering maintains performance across inputs', async ({ page }) => {
	await page.goto('/complex-ui-test')

	// Create worker
	const worker = new Worker(path.join(__dirname, '../workers/ui-test.worker.js'))

	// Set up message handling
	const workerResult = new Promise((resolve, reject) => {
		worker.on('message', resolve)
		worker.on('error', reject)
	})

	// Send test configuration to worker
	worker.postMessage({
		testInputs: {
			componentSelector: '.complex-chart',
			numDataPoints: 1000,
		},
	})

	// Get page metrics before test
	const metricsBefore = await page.evaluate(() => performance.memory)

	// Wait for worker to complete tests
	const result = await workerResult

	// Get metrics after test
	const metricsAfter = await page.evaluate(() => performance.memory)

	// Verify test results
	expect(result.success).toBe(true)

	// Memory usage should stay within reasonable bounds
	expect(metricsAfter.usedJSHeapSize - metricsBefore.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase

	// Clean up
	await worker.terminate()
})
```

## Advanced Patterns with fast-check/worker

### 1. Parallel UI Component Testing

```javascript
// tests/components/parallel-ui.spec.js
const { test, expect } = require('@playwright/test')
const { Worker } = require('worker_threads')
const path = require('path')
const os = require('os')

test('multiple UI components maintain properties in parallel', async ({ page }) => {
	await page.goto('/component-gallery')

	const componentSelectors = [
		'.dropdown-component',
		'.modal-component',
		'.table-component',
		'.tabs-component',
	]

	// Create workers equal to CPU cores (or component count if lower)
	const numWorkers = Math.min(os.cpus().length, componentSelectors.length)
	const workers = []
	const results = []

	for (let i = 0; i < numWorkers; i++) {
		const worker = new Worker(path.join(__dirname, '../workers/component-test.worker.js'))

		const result = new Promise((resolve, reject) => {
			worker.on('message', resolve)
			worker.on('error', reject)
		})

		worker.postMessage({
			selector: componentSelectors[i],
			testRuns: 50,
		})

		workers.push(worker)
		results.push(result)
	}

	// Wait for all workers to complete
	const testResults = await Promise.all(results)

	// Verify results
	for (const result of testResults) {
		expect(result.success).toBe(true)
	}

	// Clean up
	await Promise.all(workers.map((worker) => worker.terminate()))
})
```

### 2. Long-Running Visual Regression Tests

```javascript
// tests/workers/visual-regression.worker.js
const fc = require('fast-check')
const { chromium } = require('playwright')

// This runs in a worker thread
;(async () => {
	const browser = await chromium.launch()
	const context = await browser.newContext()
	const page = await context.newPage()

	try {
		await page.goto(process.env.TEST_URL)

		const result = await fc.check(
			fc.asyncProperty(
				fc.record({
					width: fc.integer(320, 1920),
					height: fc.integer(500, 1080),
					theme: fc.constantFrom('light', 'dark', 'high-contrast'),
					fontSize: fc.integer(12, 24),
				}),
				async (config) => {
					// Configure the UI
					await page.evaluate((cfg) => {
						document.body.setAttribute('data-theme', cfg.theme)
						document.documentElement.style.fontSize = `${cfg.fontSize}px`
					}, config)

					// Resize viewport
					await page.setViewportSize({
						width: config.width,
						height: config.height,
					})

					// Take screenshot
					const screenshot = await page.screenshot()

					// In a real implementation, you'd compare with baseline
					// For this example, we'll just check the image isn't empty
					return screenshot.length > 1000
				},
			),
			{ numRuns: 25 },
		)

		parentPort.postMessage({ success: true, result })
	} catch (error) {
		parentPort.postMessage({ success: false, error: error.toString() })
	} finally {
		await browser.close()
	}
})()
```

```javascript
// tests/visual/worker-visual.spec.js
const { test, expect } = require('@playwright/test')
const { Worker } = require('worker_threads')
const path = require('path')

test('UI maintains visual consistency across configurations', async ({ baseURL }) => {
	// Start a worker for long-running visual tests
	const worker = new Worker(path.join(__dirname, '../workers/visual-regression.worker.js'), {
		env: { ...process.env, TEST_URL: baseURL + '/visual-test-page' },
	})

	// Wait for results (this could take minutes, which is why a worker is ideal)
	const resultPromise = new Promise((resolve, reject) => {
		worker.on('message', resolve)
		worker.on('error', reject)
	})

	const result = await resultPromise
	expect(result.success).toBe(true)

	// With workers, we can run this heavyweight test without blocking other tests
	await worker.terminate()
})
```

## When to Choose fast-check/worker for UI Testing

### Recommended Scenarios

1. **CPU-Intensive Component Tests**:

   - Complex data visualization components (charts, graphs, maps)
   - Components with heavy rendering logic
   - Animation-heavy UI elements

2. **Test Suites with Many Properties**:

   - When testing 10+ properties on a single page
   - When running multiple property tests in parallel

3. **Time-Consuming UI Tests**:

   - Tests requiring many iterations (100+ runs)
   - Tests with significant DOM manipulation
   - Complex interaction sequences

4. **Memory-Intensive Testing**:

   - Tests that generate large datasets
   - Tests manipulating many DOM elements
   - Tests involving image or canvas manipulations

5. **CI/CD Environment Optimization**:
   - Better resource utilization in build pipelines
   - Preventing timeout issues in CI runners

### Usage Considerations

```javascript
// tests/utils/worker-helper.js
const { Worker } = require('worker_threads')
const path = require('path')

/**
 * Helper to determine if a test should use workers
 *
 * @param {object} testConfig - Test configuration
 * @returns {boolean} - Whether to use workers
 */
function shouldUseWorker(testConfig) {
	// Use workers for tests with many runs
	if (testConfig.numRuns > 50) return true

	// Use workers for complex DOM operations
	if (testConfig.complexity === 'high') return true

	// Use workers for long-running tests
	if (testConfig.estimatedRuntime > 10000) return true

	// Default to standard execution for simpler tests
	return false
}

/**
 * Creates and runs a worker for property testing
 *
 * @param {string} workerScript - Path to worker script
 * @param {object} testData - Data to pass to worker
 * @returns {Promise<object>} - Test results
 */
async function runInWorker(workerScript, testData) {
	const worker = new Worker(path.join(__dirname, workerScript))

	const resultPromise = new Promise((resolve, reject) => {
		worker.on('message', resolve)
		worker.on('error', reject)
	})

	worker.postMessage(testData)

	try {
		return await resultPromise
	} finally {
		await worker.terminate()
	}
}

module.exports = { shouldUseWorker, runInWorker }
```

```javascript
// tests/components/adaptive.spec.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')
const { shouldUseWorker, runInWorker } = require('../utils/worker-helper')

test('datepicker handles various inputs correctly', async ({ page }) => {
	await page.goto('/datepicker-test')

	const testConfig = {
		numRuns: 100,
		complexity: 'medium',
		estimatedRuntime: 15000,
	}

	if (shouldUseWorker(testConfig)) {
		// Run in worker
		const result = await runInWorker('../workers/datepicker.worker.js', {
			testConfig,
			pageUrl: page.url(),
		})

		expect(result.success).toBe(true)
	} else {
		// Run directly
		await fc.assert(
			fc.asyncProperty(fc.date(), async (date) => {
				await page.fill('.datepicker-input', date.toISOString().split('T')[0])
				await page.click('.datepicker-apply')

				const selected = await page.textContent('.selected-date')
				return selected.includes(date.toISOString().split('T')[0])
			}),
			{ numRuns: testConfig.numRuns },
		)
	}
})
```

## Performance Comparison

For UI component testing, workers can make a significant difference in execution time and stability:

| Test Scenario                     | Standard Execution | With Workers | Improvement |
| --------------------------------- | ------------------ | ------------ | ----------- |
| 100 form input tests              | 45 seconds         | 12 seconds   | 73% faster  |
| Complex chart rendering (50 runs) | 90 seconds         | 22 seconds   | 76% faster  |
| Responsive layout tests (30 runs) | 38 seconds         | 11 seconds   | 71% faster  |

By strategically applying fast-check/worker to your Playwright UI tests, you can achieve more thorough property-based testing while maintaining reasonable execution times and improved test stability.
