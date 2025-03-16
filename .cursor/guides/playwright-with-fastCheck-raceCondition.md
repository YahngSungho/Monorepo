
# Testing Race Conditions with Playwright and fast-check

## Understanding Race Conditions in Web Applications

```javascript
// example-race-condition.js
// A typical race condition in a web app
async function updateUserProfile() {
  const userData = await fetchUserData(); // Request 1
  const preferences = await fetchUserPreferences(); // Request 2

  // Race condition: If Request 2 fails but Request 1 succeeds,
  // we might have an inconsistent state
  saveUserData({ ...userData, preferences });
}
```

## Core Testing Approach

```javascript
// race-condition-test.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test('concurrent user actions should maintain data consistency', async ({ page, context }) => {
  await page.goto('https://your-app.com/dashboard');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password');
  await page.click('#login-button');

  // Generate concurrent action sequences
  await fc.assert(
    fc.asyncProperty(
      fc.array(
        fc.oneof(
          fc.constant({ type: 'update-profile', data: { name: 'New Name' } }),
          fc.constant({ type: 'change-password', data: { password: 'newpass123' } }),
          fc.constant({ type: 'toggle-setting', setting: 'notifications' })
        ),
        { minLength: 2, maxLength: 5 }
      ),
      async (actions) => {
        // Execute actions concurrently to trigger potential race conditions
        await Promise.all(actions.map(async (action) => {
          const newPage = await context.newPage();
          await newPage.goto('https://your-app.com/dashboard');
          // Reuse same session

          switch(action.type) {
            case 'update-profile':
              await newPage.fill('#profile-name', action.data.name);
              await newPage.click('#save-profile');
              break;
            case 'change-password':
              await newPage.fill('#new-password', action.data.password);
              await newPage.click('#save-password');
              break;
            case 'toggle-setting':
              await newPage.click(`#setting-${action.setting}`);
              break;
          }

          await newPage.close();
        }));

        // Verify system is in a consistent state
        await page.reload();
        const hasError = await page.isVisible('.error-banner');
        const dataConsistency = await page.evaluate(() => {
          // Custom logic to check data consistency
          return window.appState.isConsistent();
        });

        return !hasError && dataConsistency;
      }
    ),
    { numRuns: 15 }
  );
});
```

## Advanced Race Condition Testing Strategies

### 1. Controlled Request Timing

```javascript
// controlled-timing.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test('should handle delayed API responses correctly', async ({ page }) => {
  // Mock API to control timing
  await page.route('**/api/user', async (route) => {
    // Delay response randomly
    await new Promise(r => setTimeout(r, Math.random() * 1000));
    return route.continue();
  });

  await page.route('**/api/settings', async (route) => {
    // Different delay pattern
    await new Promise(r => setTimeout(r, Math.random() * 2000));
    return route.continue();
  });

  await fc.assert(
    fc.asyncProperty(
      fc.array(
        fc.record({
          action: fc.oneof(
            fc.constant('updateProfile'),
            fc.constant('updateSettings')
          ),
          timing: fc.integer(0, 500) // Additional timing variations
        }),
        { minLength: 2, maxLength: 4 }
      ),
      async (operations) => {
        await page.goto('https://your-app.com');

        // Execute operations with controlled timing
        await Promise.all(operations.map(async op => {
          await new Promise(r => setTimeout(r, op.timing));

          if (op.action === 'updateProfile') {
            await page.click('#profile-tab');
            await page.fill('#name', 'Test User');
            await page.click('#save-profile');
          } else {
            await page.click('#settings-tab');
            await page.click('#toggle-notifications');
            await page.click('#save-settings');
          }
        }));

        // Verify application state is consistent
        await page.reload();
        const errorPresent = await page.isVisible('.error-message');
        return !errorPresent;
      }
    ),
    { numRuns: 10 }
  );
});
```

### 2. Network Condition Simulation

```javascript
// network-conditions.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test('application handles poor network conditions without race conditions', async ({ context }) => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({
        // Parameters that affect network conditions
        latency: fc.integer(100, 1000),
        timeout: fc.boolean(), // Whether some requests should timeout
        requestOrder: fc.array(fc.integer(1, 5), { minLength: 3, maxLength: 5 })
          .map(arr => [...new Set(arr)]) // Unique request ordering
      }),
      async (networkParams) => {
        const page = await context.newPage();

        // Setup network interception with provided parameters
        await page.route('**/*', async (route) => {
          const url = route.request().url();

          // Apply simulated network conditions
          if (url.includes('/api/')) {
            // Apply latency based on request order
            const requestType = getRequestType(url);
            const requestIndex = networkParams.requestOrder.indexOf(requestType);
            const delay = networkParams.latency * (requestIndex + 1);

            if (networkParams.timeout && Math.random() < 0.3) {
              // Simulate timeout for some requests
              await new Promise(r => setTimeout(r, 5000));
              return route.abort('timedout');
            }

            await new Promise(r => setTimeout(r, delay));
          }

          return route.continue();
        });

        await page.goto('https://your-app.com/dashboard');

        // Perform multiple concurrent actions
        const promises = [
          page.click('#refresh-data'),
          page.click('#load-settings'),
          page.click('#update-profile')
        ];

        await Promise.all(promises);

        // Check for error states or inconsistencies
        const hasError = await page.isVisible('.error-state');
        const dataIsConsistent = await checkDataConsistency(page);

        await page.close();
        return !hasError && dataIsConsistent;
      }
    ),
    {
      numRuns: 15,
      timeout: 60000 // Extended timeout for network simulations
    }
  );
});

/**
 * Helper to categorize request types
 * @param {string} url - Request URL
 * @returns {number} Request type identifier
 */
function getRequestType(url) {
  if (url.includes('/api/user')) return 1;
  if (url.includes('/api/settings')) return 2;
  if (url.includes('/api/notifications')) return 3;
  if (url.includes('/api/data')) return 4;
  return 5; // other
}

/**
 * Check if application data is in a consistent state
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
async function checkDataConsistency(page) {
  return page.evaluate(() => {
    // Application-specific logic to verify data consistency
    const userData = window.appState?.userData;
    const settings = window.appState?.settings;

    if (!userData || !settings) return false;

    // Check for specific inconsistencies that would indicate race conditions
    return userData.settingsVersion === settings.version;
  });
}
```

### 3. Database State Verification

```javascript
// database-state.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { connectToTestDB } = require('./test-helpers');

test('concurrent operations maintain database consistency', async ({ browser }) => {
  const db = await connectToTestDB();

  await fc.assert(
    fc.asyncProperty(
      fc.array(
        fc.record({
          operation: fc.oneof(
            fc.constant('create'),
            fc.constant('update'),
            fc.constant('delete')
          ),
          entity: fc.oneof(
            fc.constant('user'),
            fc.constant('profile'),
            fc.constant('settings')
          ),
          timing: fc.integer(0, 300)
        }),
        { minLength: 2, maxLength: 6 }
      ),
      async (operations) => {
        // Reset test data
        await db.resetTestData();
        const testUser = await db.createTestUser();

        // Create multiple browser contexts with shared session
        const contexts = await Promise.all(
          Array.from({ length: operations.length }, () =>
            browser.newContext({ storageState: testUser.storageState })
          )
        );

        try {
          // Execute operations concurrently from different contexts
          await Promise.all(operations.map(async (op, index) => {
            const page = await contexts[index].newPage();
            await page.goto('https://your-app.com/dashboard');

            // Add timing offset to increase race condition probability
            await page.waitForTimeout(op.timing);

            switch (`${op.operation}-${op.entity}`) {
              case 'create-user':
                await page.click('#add-user');
                await page.fill('#user-name', `User${Date.now()}`);
                await page.click('#save-user');
                break;
              case 'update-profile':
                await page.click('#edit-profile');
                await page.fill('#bio', `Updated ${Date.now()}`);
                await page.click('#save-profile');
                break;
              case 'delete-settings':
                await page.click('#settings');
                await page.click('#delete-setting');
                await page.click('#confirm-delete');
                break;
              // Add other operation combinations
            }

            await page.waitForTimeout(100); // Brief wait
            await page.close();
          }));

          // Verify database consistency
          const dbState = await db.checkConsistency(testUser.id);
          return dbState.consistent;
        } finally {
          // Cleanup
          await Promise.all(contexts.map(context => context.close()));
        }
      }
    ),
    {
      numRuns: 10,
      timeout: 60000
    }
  );
});
```

### 4. Generating Event Sequences with Timing Controls

```javascript
// event-sequence.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test('UI remains consistent during rapid user interactions', async ({ page }) => {
  await page.goto('https://your-app.com/app');
  await page.waitForLoadState('networkidle');

  // Define possible UI actions
  const actions = {
    clickButton: async (selector) => page.click(selector),
    typeText: async (selector, text) => page.fill(selector, text),
    selectOption: async (selector, value) => page.selectOption(selector, value),
    hover: async (selector) => page.hover(selector)
  };

  // Action generators
  const actionGen = fc.oneof(
    fc.record({
      type: fc.constant('clickButton'),
      selector: fc.oneof(
        fc.constant('#save-button'),
        fc.constant('#cancel-button'),
        fc.constant('#add-item')
      ),
      delay: fc.integer(0, 200)
    }),
    fc.record({
      type: fc.constant('typeText'),
      selector: fc.constant('#search-input'),
      text: fc.string(1, 10),
      delay: fc.integer(0, 100)
    }),
    fc.record({
      type: fc.constant('selectOption'),
      selector: fc.constant('#filter-dropdown'),
      value: fc.oneof(
        fc.constant('option1'),
        fc.constant('option2')
      ),
      delay: fc.integer(0, 150)
    })
  );

  // Generate action sequences with timing information
  const actionSequenceGen = fc.array(actionGen, { minLength: 3, maxLength: 10 });

  await fc.assert(
    fc.asyncProperty(
      actionSequenceGen,
      fc.boolean(), // Whether to execute in parallel or sequence
      async (actionSequence, executeInParallel) => {
        // Reset application state
        await page.reload();
        await page.waitForLoadState('networkidle');

        if (executeInParallel) {
          // Execute actions with specified delays to create race conditions
          await Promise.all(actionSequence.map(async (action) => {
            // Add delay to create different timing patterns
            await page.waitForTimeout(action.delay);

            // Execute the action
            switch (action.type) {
              case 'clickButton':
                await actions.clickButton(action.selector);
                break;
              case 'typeText':
                await actions.typeText(action.selector, action.text);
                break;
              case 'selectOption':
                await actions.selectOption(action.selector, action.value);
                break;
            }
          }));
        } else {
          // Sequential execution for comparison
          for (const action of actionSequence) {
            await page.waitForTimeout(action.delay);

            switch (action.type) {
              case 'clickButton':
                await actions.clickButton(action.selector);
                break;
              case 'typeText':
                await actions.typeText(action.selector, action.text);
                break;
              case 'selectOption':
                await actions.selectOption(action.selector, action.value);
                break;
            }
          }
        }

        // Verify UI consistency
        const hasErrorState = await page.isVisible('.error-indicator');
        const hasInconsistentUI = await page.isVisible('.loading-indicator.stuck');
        const applicationResponsive = await page.isEnabled('#main-action-button');

        return !hasErrorState && !hasInconsistentUI && applicationResponsive;
      }
    ),
    {
      numRuns: 20,
      timeout: 120000
    }
  );
});
```

### 5. Model-Based Testing for Race Condition Detection

```javascript
// model-based-race.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');

test('application state matches model under concurrent operations', async ({ context }) => {
  // Create a model of expected application behavior
  class AppStateModel {
    constructor() {
      this.items = [];
      this.userSettings = { theme: 'light', notifications: true };
      this.isLoading = false;
    }

    addItem(item) {
      this.items.push(item);
      return this;
    }

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      return this;
    }

    updateSetting(key, value) {
      this.userSettings[key] = value;
      return this;
    }

    // Used to compare with actual application state
    toJSON() {
      return {
        itemCount: this.items.length,
        settings: this.userSettings
      };
    }
  }

  // Setup test with model
  const model = new AppStateModel();

  // Generate concurrent operations
  const operationGen = fc.oneof(
    fc.record({
      type: fc.constant('addItem'),
      item: fc.record({
        id: fc.string(),
        name: fc.string(1, 10)
      })
    }),
    fc.record({
      type: fc.constant('removeItem'),
      id: fc.string()
    }),
    fc.record({
      type: fc.constant('updateSetting'),
      key: fc.oneof(fc.constant('theme'), fc.constant('notifications')),
      value: fc.oneof(fc.constant('dark'), fc.constant('light'), fc.boolean())
    })
  );

  await fc.assert(
    fc.asyncProperty(
      fc.array(operationGen, { minLength: 2, maxLength: 6 }),
      fc.array(fc.integer(10, 500), { minLength: 2, maxLength: 6 }), // Timing variations
      async (operations, timings) => {
        const page = await context.newPage();
        await page.goto('https://your-app.com/app');

        // Apply operations to model
        operations.forEach(op => {
          switch (op.type) {
            case 'addItem':
              model.addItem(op.item);
              break;
            case 'removeItem':
              model.removeItem(op.id);
              break;
            case 'updateSetting':
              model.updateSetting(op.key, op.value);
              break;
          }
        });

        // Execute operations with varied timing to trigger race conditions
        await Promise.all(operations.map(async (op, index) => {
          const timing = timings[index % timings.length];
          await new Promise(r => setTimeout(r, timing));

          switch (op.type) {
            case 'addItem':
              await page.fill('#new-item-name', op.item.name);
              await page.fill('#new-item-id', op.item.id);
              await page.click('#add-item-button');
              break;
            case 'removeItem':
              await page.fill('#item-search', op.id);
              await page.click('#search-button');
              await page.click('#delete-item');
              break;
            case 'updateSetting':
              await page.click('#settings-tab');
              if (typeof op.value === 'boolean') {
                const currentState = await page.isChecked(`#setting-${op.key}`);
                if (currentState !== op.value) {
                  await page.click(`#setting-${op.key}`);
                }
              } else {
                await page.selectOption(`#setting-${op.key}`, op.value);
              }
              await page.click('#save-settings');
              break;
          }
        }));

        // Wait for operations to complete
        await page.waitForTimeout(1000);

        // Compare application state with model
        const appState = await page.evaluate(() => ({
          itemCount: document.querySelectorAll('.item-entry').length,
          settings: window.appSettings
        }));

        const modelState = model.toJSON();

        // Check if model and application state match
        const statesMatch =
          appState.itemCount === modelState.itemCount &&
          JSON.stringify(appState.settings) === JSON.stringify(modelState.settings);

        if (!statesMatch) {
          console.log('Model state:', modelState);
          console.log('App state:', appState);
        }

        await page.close();
        return statesMatch;
      }
    ),
    {
      numRuns: 15,
      timeout: 120000
    }
  );
});
```

## Best Practices for Race Condition Testing

1. **Start with Known Race Conditions**: Target specific areas where race conditions have been observed or are expected

2. **Vary Execution Timing**: Use different delays and execution orders to increase the chance of finding race conditions

3. **Run Tests Multiple Times**: Race conditions may only appear under specific timing circumstances

4. **Use Multiple Browser Contexts**: To simulate multiple users accessing the same resources

5. **Network Throttling**: Simulate variable network conditions to exaggerate timing issues

6. **Focus on Shared Resources**: Database records, localStorage, sessionStorage, and global state

7. **Monitor State Consistency**: Track the application state throughout tests to detect inconsistencies

8. **Combine with Load Testing**: High load scenarios can reveal race conditions that don't appear under normal conditions

9. **Isolate Test Environments**: Ensure tests don't interfere with each other when running in parallel

10. **Log Detailed Timing Information**: When a race condition is detected, log precise timing to aid debugging

## Conclusion

Testing for race conditions requires a combination of controlled chaos and systematic verification. By using fast-check to generate diverse test scenarios and Playwright to execute concurrent operations with precise timing control, you can dramatically increase the likelihood of uncovering race conditions before they affect production users.

Remember that race condition tests may be flaky by nature - successful tests don't guarantee the absence of race conditions, but they can significantly reduce their likelihood in production environments.
