# Comprehensive Guide to Property-Based E2E Testing with Playwright and fast-check

## Introduction to Testing Web Applications with External Dependencies

Property-based testing combined with end-to-end testing provides a powerful approach to verify web applications, especially those connected to databases, APIs, and other external services. This guide focuses on using Playwright with fast-check to thoroughly test web applications while paying special attention to race conditions that frequently occur in real-world applications.

## Setting Up the Environment

```javascript
// test-setup.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

/**
 * Helper function to create property-based tests with Playwright
 *
 * @param {string} title - Test title
 * @param {fc.Arbitrary<any>} arbitrary - The arbitrary for generating test inputs
 * @param {function} testFn - The test function that takes the generated input and page object
 */
function propertyTest(title, arbitrary, testFn) {
	test(title, async ({ page }) => {
		await fc.assert(
			fc.asyncProperty(arbitrary, async (input) => {
				return await testFn(page, input)
			}),
			{ numRuns: 10 }, // Adjust based on test complexity
		)
	})
}

module.exports = { propertyTest }
```

## Race Condition Testing for Database Operations

When testing web applications connected to databases, race conditions can occur when multiple operations are performed concurrently. Here's how to test these scenarios:

```javascript
// database-race-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('should handle concurrent database operations correctly', async ({ page }) => {
	// Go to the application page
	await page.goto('https://your-app.com/data-management')

	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(
				fc.record({
					action: fc.constantFrom('create', 'read', 'update', 'delete'),
					id: fc.integer(1, 100),
					data: fc.string(5, 20),
				}),
				{ minLength: 2, maxLength: 10 },
			),
			async (s, operations) => {
				// Setup tracking for operations
				const completedOperations = []

				// Track concurrent operations to database
				let activeOperations = 0
				let maxConcurrentOperations = 0

				// Schedule all database operations
				const operationPromises = operations.map((op) => {
					return s.schedule(
						// The promise that will be scheduled
						(async () => {
							activeOperations++
							maxConcurrentOperations = Math.max(maxConcurrentOperations, activeOperations)

							try {
								// Perform the database operation via UI
								switch (op.action) {
									case 'create':
										await page.click('#create-button')
										await page.fill('#data-input', op.data)
										await page.click('#submit')
										break
									case 'read':
										await page.click(`#read-item-${op.id}`)
										break
									case 'update':
										await page.click(`#edit-item-${op.id}`)
										await page.fill('#data-input', op.data)
										await page.click('#update')
										break
									case 'delete':
										await page.click(`#delete-item-${op.id}`)
										await page.click('#confirm-delete')
										break
								}

								// Check for error states
								const errorVisible = await page.isVisible('.error-message')
								if (errorVisible) {
									const errorText = await page.textContent('.error-message')
									completedOperations.push({ ...op, status: 'error', message: errorText })
								} else {
									completedOperations.push({ ...op, status: 'success' })
								}

								return { op, success: !errorVisible }
							} finally {
								activeOperations--
							}
						})(),
						`${op.action}-${op.id}`, // Label for better debugging
					)
				})

				// Wait for all scheduled operations to complete
				await s.waitAll()

				// Verify application state
				const dataItems = await page.$$eval('.data-item', (items) =>
					items.map((i) => ({
						id: i.getAttribute('data-id'),
						content: i.textContent,
					})),
				)

				// Verify business rules hold true
				// For example: no duplicate IDs for created items
				const createdIds = completedOperations
					.filter((op) => op.action === 'create' && op.status === 'success')
					.map((op) => op.id)

				const uniqueIds = new Set(createdIds)

				// Return true if the property holds
				return (
					uniqueIds.size === createdIds.length &&
					// Check if any consistency violations occurred
					!completedOperations.some(
						(op) => op.status === 'error' && op.message.includes('consistency violation'),
					)
				)
			},
		),
		{ numRuns: 5 }, // Lower number due to complexity
	)
})
```

## Handling Network Race Conditions

Network requests often introduce race conditions. Here's how to test them:

```javascript
// network-race-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('should handle concurrent API requests correctly', async ({ page, context }) => {
	// Mock API responses to control timing
	await context.route('**/api/**', (route) => {
		// We'll let fast-check scheduler determine when these resolve
		return new Promise((resolve) => {
			globalThis.pendingRoutes = globalThis.pendingRoutes || []
			globalThis.pendingRoutes.push({ route, resolve })
		})
	})

	await page.goto('https://your-app.com/dashboard')

	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(
				fc.record({
					endpoint: fc.constantFrom('/api/users', '/api/products', '/api/orders'),
					action: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
					payload: fc.record({
						id: fc.nat(1000),
						data: fc.string(1, 50),
					}),
				}),
				{ minLength: 3, maxLength: 15 },
			),
			async (s, apiCalls) => {
				// Reset tracking
				globalThis.pendingRoutes = []
				const completedRequests = []

				// Function to trigger API calls from the UI
				const triggerApiCall = async (call) => {
					switch (call.action) {
						case 'GET':
							await page.click(`#fetch-${call.endpoint.split('/').pop()}`)
							break
						case 'POST':
							await page.click(`#create-${call.endpoint.split('/').pop()}`)
							await page.fill('#id-field', String(call.payload.id))
							await page.fill('#data-field', call.payload.data)
							await page.click('#submit')
							break
						// Handle other methods similarly
					}
					return { call, timestamp: Date.now() }
				}

				// Schedule API triggers
				const scheduledCalls = apiCalls.map((call) => {
					return s.schedule(
						(async () => {
							const result = await triggerApiCall(call)
							completedRequests.push(result)
							return result
						})(),
						`${call.action}-${call.endpoint}-${call.payload.id}`,
					)
				})

				// Create a scheduled function for resolving routes
				const resolveRoute = s.scheduleFunction((index) => {
					if (globalThis.pendingRoutes[index]) {
						const { route, resolve } = globalThis.pendingRoutes[index]
						route.fulfill({
							status: 200,
							body: JSON.stringify({ success: true, timestamp: Date.now() }),
						})
						resolve()
					}
					return Promise.resolve(true)
				})

				// Schedule resolutions in a potentially different order
				const pendingRoutesAtStart = [...globalThis.pendingRoutes]
				for (let i = 0; i < pendingRoutesAtStart.length; i++) {
					s.schedule(resolveRoute(i), `resolve-route-${i}`)
				}

				// Wait for all operations to complete
				await s.waitAll()

				// Check UI for consistency
				const notifications = await page.$$eval('.notification', (nodes) =>
					nodes.map((n) => ({
						type: n.getAttribute('data-type'),
						message: n.textContent,
					})),
				)

				const errors = notifications.filter((n) => n.type === 'error')

				// Check if the application state is consistent
				const dataConsistency = await page.evaluate(() => {
					// Custom logic to check if the application state is consistent
					// This will depend on your application
					return window.appState && window.appState.isConsistent()
				})

				return errors.length === 0 && dataConsistency
			},
		),
		{ numRuns: 3 }, // Complex test, so fewer runs
	)
})
```

## Testing Login Race Conditions

Authentication flows are particularly vulnerable to race conditions:

```javascript
// auth-race-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('should handle concurrent login/logout operations correctly', async ({ browser }) => {
	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(
				fc.record({
					action: fc.constantFrom('login', 'logout', 'check-profile'),
					username: fc.emailAddress(),
					password: fc.string(8, 20),
				}),
				{ minLength: 5, maxLength: 15 },
			),
			async (s, authOperations) => {
				// Create a context for the test
				const context = await browser.newContext()
				let page = await context.newPage()
				await page.goto('https://your-app.com/')

				// To track the expected state
				let isLoggedIn = false
				let currentUser = null
				const authHistory = []

				// Schedule all authentication operations
				const operations = authOperations.map((op) => {
					return s.schedule(
						(async () => {
							try {
								switch (op.action) {
									case 'login':
										await page.goto('https://your-app.com/login')
										await page.fill('#username', op.username)
										await page.fill('#password', op.password)
										await page.click('#login-button')
										// Record expected state change
										isLoggedIn = true
										currentUser = op.username
										break

									case 'logout':
										await page.goto('https://your-app.com/dashboard')
										await page.click('#logout-button')
										// Record expected state change
										isLoggedIn = false
										currentUser = null
										break

									case 'check-profile':
										await page.goto('https://your-app.com/profile')
										break
								}

								// Record what happened
								const actualLoggedIn = await page.isVisible('#user-profile')
								const actualUsername =
									actualLoggedIn ? await page.textContent('#username-display') : null

								authHistory.push({
									operation: op,
									expectedLoggedIn: isLoggedIn,
									expectedUser: currentUser,
									actualLoggedIn,
									actualUsername,
									timestamp: Date.now(),
								})

								return true
							} catch (error) {
								authHistory.push({
									operation: op,
									error: error.message,
									timestamp: Date.now(),
								})
								return false
							}
						})(),
						`${op.action}-${op.username}`,
					)
				})

				// Wait for all operations to complete
				await s.waitAll()

				// Close the context
				await context.close()

				// Check for inconsistencies
				const inconsistencies = authHistory.filter(
					(entry) =>
						!entry.error &&
						(entry.expectedLoggedIn !== entry.actualLoggedIn ||
							(entry.expectedLoggedIn && entry.expectedUser !== entry.actualUsername)),
				)

				// The property holds if there are no inconsistencies
				return inconsistencies.length === 0
			},
		),
		{ numRuns: 5 },
	)
})
```

## Testing Form Submission with Database Validation

Forms with backend validation are common race condition sources:

```javascript
// form-validation-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('form submissions maintain data integrity even with race conditions', async ({ page }) => {
	await page.goto('https://your-app.com/registration')

	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(
				fc.record({
					email: fc.emailAddress(),
					username: fc.string(5, 15).filter((s) => /^[a-zA-Z0-9_]+$/.test(s)),
					password: fc.string(8, 20),
				}),
				{ minLength: 2, maxLength: 5 },
			),
			async (s, registrations) => {
				// Track registered users for validation
				const registeredUsers = new Set()
				const registrationResults = []

				// Schedule multiple registration submissions
				const submissions = registrations.map((userData) => {
					return s.schedule(
						(async () => {
							await page.goto('https://your-app.com/registration')

							// Fill out form
							await page.fill('#email', userData.email)
							await page.fill('#username', userData.username)
							await page.fill('#password', userData.password)
							await page.fill('#confirm-password', userData.password)

							// Submit form
							await page.click('#register-button')

							// Wait for response
							await page.waitForResponse((resp) => resp.url().includes('/api/register'))

							// Check for success or error messages
							const success = await page.isVisible('.success-message')
							const error = await page.isVisible('.error-message')
							const errorMessage = error ? await page.textContent('.error-message') : null

							const result = {
								userData,
								success,
								error,
								errorMessage,
								timestamp: Date.now(),
							}

							registrationResults.push(result)

							if (success) {
								registeredUsers.add(userData.username)
								registeredUsers.add(userData.email)
							}

							return result
						})(),
						`register-${userData.username}`,
					)
				})

				// Wait for all registrations to complete
				await s.waitAll()

				// Verify database consistency by checking the users list
				await page.goto('https://your-app.com/admin/users')

				// Mock login as admin if needed
				await page.fill('#admin-username', 'admin')
				await page.fill('#admin-password', 'admin123')
				await page.click('#admin-login')

				// Get all registered users from the UI
				const listedUsers = await page.$$eval('.user-item', (items) =>
					items.map((item) => ({
						username: item.querySelector('.username').textContent,
						email: item.querySelector('.email').textContent,
					})),
				)

				// Check for duplicated emails or usernames
				const emails = listedUsers.map((u) => u.email)
				const usernames = listedUsers.map((u) => u.username)

				const uniqueEmails = new Set(emails)
				const uniqueUsernames = new Set(usernames)

				// Check successes match our expectations
				const successfulRegistrations = registrationResults.filter((r) => r.success)

				// The property holds if:
				// 1. No duplicate emails or usernames in the database
				// 2. All successful registrations are in the database
				// 3. Failed registrations with "already exists" messages are consistent
				return (
					uniqueEmails.size === emails.length &&
					uniqueUsernames.size === usernames.length &&
					successfulRegistrations.every((r) =>
						listedUsers.some(
							(u) => u.email === r.userData.email && u.username === r.userData.username,
						),
					) &&
					registrationResults
						.filter((r) => r.error && r.errorMessage.includes('already exists'))
						.every(
							(r) =>
								registeredUsers.has(r.userData.email) || registeredUsers.has(r.userData.username),
						)
				)
			},
		),
		{ numRuns: 3 }, // Reduce runs due to complexity
	)
})
```

## Advanced Techniques for Race Condition Testing

### Using the scheduler report for debugging

```javascript
// scheduler-report-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

test('should analyze scheduler execution order for debugging', async ({ page }) => {
	await page.goto('https://your-app.com/cart')

	try {
		await fc.assert(
			fc.asyncProperty(
				fc.scheduler(),
				fc.array(
					fc.record({
						action: fc.constantFrom('add', 'remove', 'update', 'checkout'),
						productId: fc.integer(1, 100),
						quantity: fc.integer(1, 10),
					}),
					{ minLength: 5, maxLength: 10 },
				),
				async (s, cartOperations) => {
					// Schedule cart operations
					const operations = cartOperations.map((op) => {
						return s.schedule(
							(async () => {
								// Perform cart operation
								switch (op.action) {
									case 'add':
										await page.click(`#add-to-cart-${op.productId}`)
										await page.fill('#quantity', String(op.quantity))
										await page.click('#confirm-add')
										break
									// Handle other cases
								}
								return true
							})(),
							`${op.action}-product-${op.productId}-qty-${op.quantity}`,
						)
					})

					// Wait for all operations
					await s.waitAll()

					// Verify cart state
					const cartItems = await page.$$eval('.cart-item', (items) =>
						items.map((i) => ({
							id: i.getAttribute('data-product-id'),
							quantity: Number(i.querySelector('.quantity').textContent),
						})),
					)

					// For this example, we'll just force a failure to see the report
					return cartItems.length === 0 // This will fail if any items were added
				},
			),
			{ numRuns: 1 },
		)
	} catch (error) {
		if (error.counterexample && error.counterexample[0]) {
			// Get the scheduler from the counterexample
			const scheduler = error.counterexample[0]

			// Get the report of how tasks were executed
			const report = scheduler.report()

			console.log('Scheduler execution report:')
			report.forEach((item, index) => {
				console.log(`${index + 1}. Label: ${item.label}`)
				console.log(`   Status: ${item.status}`)
				console.log(`   Task started at: ${new Date(item.startTime).toISOString()}`)
				if (item.endTime) {
					console.log(`   Task ended at: ${new Date(item.endTime).toISOString()}`)
					console.log(`   Duration: ${item.endTime - item.startTime}ms`)
				}
				if (item.output) {
					console.log(`   Output: ${item.output}`)
				}
				if (item.error) {
					console.log(`   Error: ${item.error}`)
				}
			})

			// Take a screenshot for visual debugging
			await page.screenshot({ path: 'race-condition-failure.png' })
		}

		throw error
	}
})
```

### Combining with Model-Based Testing

```javascript
// model-based-race-test.js
const { test, expect } = require('@playwright/test')
const fc = require('fast-check')

// Define a model for the shopping cart
class CartModel {
	constructor() {
		this.items = new Map()
		this.isCheckoutComplete = false
	}

	addItem(productId, quantity) {
		const currentQty = this.items.get(productId) || 0
		this.items.set(productId, currentQty + quantity)
		return this
	}

	removeItem(productId) {
		this.items.delete(productId)
		return this
	}

	updateQuantity(productId, quantity) {
		if (quantity <= 0) {
			this.items.delete(productId)
		} else {
			this.items.set(productId, quantity)
		}
		return this
	}

	checkout() {
		this.isCheckoutComplete = true
		this.items.clear()
		return this
	}

	getTotal() {
		let total = 0
		for (const [id, qty] of this.items.entries()) {
			// In a real model, you'd have price information
			total += qty
		}
		return total
	}
}

test('cart model matches real cart even with race conditions', async ({ page }) => {
	await page.goto('https://your-app.com/shop')

	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(
				fc.record({
					action: fc.constantFrom('add', 'remove', 'update', 'checkout'),
					productId: fc.integer(1, 20),
					quantity: fc.integer(1, 5),
				}),
				{ minLength: 5, maxLength: 15 },
			),
			async (s, operations) => {
				// Create a model of the expected state
				const model = new CartModel()

				// Create scheduled function for cart operations
				const performCartOperation = s.scheduleFunction(async (op) => {
					// Update the model first
					switch (op.action) {
						case 'add':
							model.addItem(op.productId, op.quantity)
							break
						case 'remove':
							model.removeItem(op.productId)
							break
						case 'update':
							model.updateQuantity(op.productId, op.quantity)
							break
						case 'checkout':
							model.checkout()
							break
					}

					// Then perform the UI operation
					switch (op.action) {
						case 'add':
							await page.goto(`https://your-app.com/product/${op.productId}`)
							await page.fill('#quantity', String(op.quantity))
							await page.click('#add-to-cart')
							break
						case 'remove':
							await page.goto('https://your-app.com/cart')
							await page.click(`#remove-item-${op.productId}`)
							break
						case 'update':
							await page.goto('https://your-app.com/cart')
							await page.fill(`#quantity-${op.productId}`, String(op.quantity))
							await page.click(`#update-${op.productId}`)
							break
						case 'checkout':
							await page.goto('https://your-app.com/cart')
							await page.click('#checkout')
							await page.fill('#card-number', '4111111111111111')
							await page.fill('#expiry', '12/25')
							await page.fill('#cvv', '123')
							await page.click('#complete-purchase')
							break
					}

					return { op, timestamp: Date.now() }
				})

				// Schedule all operations
				for (const op of operations) {
					await performCartOperation(op)
				}

				// Wait for all operations to finish
				await s.waitAll()

				// Navigate to cart to verify final state
				await page.goto('https://your-app.com/cart')

				// Extract the actual cart state from the UI
				const cartItems = await page.$$eval('.cart-item', (items) =>
					items.map((i) => ({
						id: Number(i.getAttribute('data-product-id')),
						quantity: Number(i.querySelector('.quantity').textContent),
					})),
				)

				const isCheckoutComplete = await page.isVisible('.order-confirmation')

				// Compare model with actual state
				if (model.isCheckoutComplete) {
					// If checkout completed in model, cart should be empty and confirmation visible
					return cartItems.length === 0 && isCheckoutComplete
				} else {
					// Otherwise, cart items should match model
					if (cartItems.length !== model.items.size) return false

					for (const item of cartItems) {
						if (model.items.get(item.id) !== item.quantity) return false
					}

					return true
				}
			},
		),
		{ numRuns: 3 },
	)
})
```

## Best Practices for E2E Property-Based Testing with External Dependencies

1. **Mock External Services**: Use `context.route()` to mock responses from external APIs and databases for more controlled testing.

2. **Control Time**: Combine fast-check with time manipulation to test time-dependent operations:

```javascript
test('time-dependent operations remain consistent', async ({ page, context }) => {
	// Override Date.now and setTimeout in the browser
	await page.addInitScript(() => {
		let currentTime = Date.now()

		// Override time functions
		window.__originalDateNow = Date.now
		window.__originalSetTimeout = window.setTimeout

		Date.now = () => currentTime

		window.advanceTimeBy = (ms) => {
			currentTime += ms
		}

		// Track setTimeout calls
		window.__timeouts = []
		window.setTimeout = (fn, delay, ...args) => {
			const id = window.__originalSetTimeout(() => {}, 999999999)
			window.__timeouts.push({ id, fn, scheduledTime: currentTime + delay, args })
			return id
		}

		// Function to trigger pending timeouts
		window.runPendingTimeouts = () => {
			const now = currentTime
			const due = window.__timeouts.filter((t) => t.scheduledTime <= now)
			window.__timeouts = window.__timeouts.filter((t) => t.scheduledTime > now)

			due.forEach(({ fn, args }) => {
				fn(...args)
			})

			return due.length
		}
	})

	// Rest of your test using scheduler and window.advanceTimeBy
})
```

3. **Use Realistic Data Types**: Generate realistic test data for your domain:

```javascript
// Create arbitraries for your domain
const userArbitrary = fc.record({
	id: fc.uuid(),
	name: fc.string(1, 50),
	email: fc.emailAddress(),
	role: fc.constantFrom('admin', 'user', 'guest'),
	lastLogin: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
})

const productArbitrary = fc.record({
	id: fc.uuid(),
	name: fc.string(1, 100),
	price: fc.float(0.1, 9999.99),
	inStock: fc.boolean(),
	categories: fc.array(fc.string(1, 20), { minLength: 1, maxLength: 5 }),
})
```

4. **Isolate Test Cases**: Use separate browser contexts for each property test:

```javascript
test('isolated property tests', async ({ browser }) => {
	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			fc.array(userArbitrary, { minLength: 2, maxLength: 5 }),
			async (s, users) => {
				// Create a fresh context for this test iteration
				const context = await browser.newContext()
				const page = await context.newPage()

				try {
					// Your test logic here

					return true // Property holds
				} finally {
					// Clean up
					await context.close()
				}
			},
		),
		{ numRuns: 5 },
	)
})
```

5. **Handle Database State**: For tests that require database interaction, build reset capabilities:

```javascript
// Reset the database between test runs
beforeEach(async ({ request }) => {
	await request.post('https://your-app.com/api/test/reset-db', {
		headers: {
			Authorization: `Bearer ${testApiKey}`,
		},
	})
})
```

6. **Focus on Critical Paths**: Target the most important user journeys for property testing:

```javascript
// Define a model of your critical paths
const criticalUserJourneys = fc.oneof(
	fc.constant('signup-to-purchase'),
	fc.constant('browse-add-to-cart-checkout'),
	fc.constant('search-compare-purchase'),
	fc.constant('return-refund-flow'),
)

test('critical user journeys maintain integrity under load', async ({ page }) => {
	await fc.assert(
		fc.asyncProperty(
			fc.scheduler(),
			criticalUserJourneys,
			fc.array(userArbitrary, { minLength: 1, maxLength: 3 }),
			async (s, journey, users) => {
				// Test the specified journey with the given users
				// ...
			},
		),
	)
})
```

7. **Shrink Test Cases**: When a failure is found, fast-check will automatically shrink to find a minimal failing case. Record this minimal case for regression testing:

```javascript
try {
	await fc.assert(/* your property */)
} catch (error) {
	if (error.counterexample) {
		// Save counterexample to a file for future testing
		fs.writeFileSync('regression-case.json', JSON.stringify(error.counterexample))
	}
	throw error
}
```

## Conclusion

Property-based testing with Playwright and fast-check provides a powerful approach to finding edge cases and race conditions in web applications connected to external services. By focusing on properties that should hold true regardless of timing or input order, you can build more robust applications that handle real-world conditions effectively.

Remember that while property-based tests are valuable, they should complement rather than replace traditional example-based tests. Use property testing to probe the boundaries of your system and discover edge cases, then add specific example tests to verify fixes for any issues discovered.
