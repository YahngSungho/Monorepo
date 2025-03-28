# Guide to Property-Based Testing for UI Components with Playwright and fast-check

## Setting Up Property-Based Testing with Playwright and fast-check

Property-based testing (PBT) with Playwright and fast-check allows you to verify that your UI components and pages maintain desired properties across a wide, automatically generated range of inputs. This approach significantly increases test coverage compared to traditional example-based testing and excels at finding edge cases.

This guide focuses on applying PBT to UI components in isolation or within a test harness page, minimizing external dependencies like network requests or databases for faster, more reliable tests.

### Basic Setup: The `assertProperty` Helper

To integrate fast-check smoothly with Playwright's asynchronous nature, a helper function is useful. Create a setup file (e.g., `tests/playwright.setup.js`) for shared utilities.

```javascript:tests/playwright.setup.js
// tests/playwright.setup.js
const fc = require('fast-check');

/**
 * Runs a property-based test within a Playwright test function.
 * Handles async properties and integrates with fast-check's assertion mechanism.
 *
 * @template Ts - The types of the generated values by the arbitrary.
 * @param {string} propertyDescription - A description of the property being tested (used for error reporting).
 * @param {fc.Arbitrary<Ts>} arbitrary - The fast-check arbitrary generating inputs for the property function.
 * @param {(...args: Ts) => Promise<boolean | void>} propertyFn - An async function defining the property.
 *   It receives the generated values as arguments.
 *   - Returning `true` or `void` signifies the property holds for the given input.
 *   - Returning `false` or throwing an error signifies the property is violated.
 * @param {fc.Parameters<Ts>} [fcOptions] - Optional fast-check parameters (e.g., { numRuns: 10 }).
 *                                         `verbose: true` is recommended for better debugging.
 * @returns {Promise<void>} A promise that resolves if the property holds for all inputs, or rejects if it fails.
 */
async function assertProperty(propertyDescription, arbitrary, propertyFn, fcOptions) {
  try {
    await fc.assert(
      fc.asyncProperty(arbitrary, propertyFn),
      // Default to verbose output on failure, can be overridden by fcOptions
      { verbose: fc.VerbosityLevel.Verbose, ...fcOptions }
    );
  } catch (error) {
    // Enhance error message with property description for better context
    if (error.message && error.message.startsWith('Property failed after')) {
      const enhancedError = new Error(`Property "${propertyDescription}" failed.\n${error.message}`);
      enhancedError.stack = error.stack; // Preserve original stack if possible
      enhancedError.cause = error; // Link to the original fast-check error
      throw enhancedError;
    }
    throw error; // Re-throw other errors
  }
}

module.exports = { assertProperty };
```

## Strategies for UI Component Testing

Use a dedicated test page or harness to render your component in isolation. This allows Playwright to interact with it directly.

### 1. Testing Form Input Components

Verify how form elements handle various valid and potentially invalid inputs.

```javascript:tests/components/form.spec.js
// tests/components/form.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup'); // Import the helper

test('input field preserves valid usernames', async ({ page }) => {
  await page.goto('/component-test-page'); // Page where the input component is rendered

  // Define an arbitrary for generating valid usernames
  const usernameArb = fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'.split('')),
    { minLength: 3, maxLength: 20 }
  );

  await assertProperty(
    'Input field should correctly store and retrieve valid usernames', // Description
    usernameArb, // Arbitrary
    async (username) => { // Property function
      const inputSelector = '#username';
      await page.fill(inputSelector, ''); // Clear previous input
      await page.fill(inputSelector, username);
      const value = await page.inputValue(inputSelector);
      // Property: The value read from the input should match the value entered.
      expect(value).toBe(username);
      // Alternatively, return a boolean: return value === username;
    },
    { numRuns: 25 } // Options: Run the property 25 times
  );
});
```

### 2. Testing Responsive UI Behavior

Ensure components adapt correctly to different screen sizes.

```javascript:tests/components/responsive.spec.js
// tests/components/responsive.spec.js
const { test } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('card component text remains visible at various viewport sizes', async ({ page }) => {
  await page.goto('/cards-demo'); // Page with the card component

  // Arbitrary for viewport dimensions
  const viewportArb = fc.record({
    width: fc.integer({ min: 320, max: 1920 }), // Common viewport widths
    height: fc.integer({ min: 480, max: 1080 }), // Common viewport heights
  });

  await assertProperty(
    'Card title and text should remain visible across different viewport sizes',
    viewportArb,
    async (size) => {
      await page.setViewportSize(size);

      // Allow time for potential reflows/re-renders (adjust if needed)
      await page.waitForTimeout(50);

      const titleVisible = await page.locator('.card-title').isVisible();
      const textVisible = await page.locator('.card-text').isVisible();

      // Property: Both title and text should always be visible.
      return titleVisible && textVisible;
    },
    { numRuns: 15 } // Fewer runs due to viewport resizing overhead
  );
});
```

### 3. Testing Components with Complex Props (using `zod-fast-check`)

If your component accepts props defined by a Zod schema, `zod-fast-check` can generate valid prop objects. Assume your test harness page exposes a function like `window.renderComponent(props)` or `window.setComponentProps(props)`.

```javascript:tests/components/user-profile.spec.js
// tests/components/user-profile.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { z } = require('zod');
const { ZodFastCheck } = require('zod-fast-check'); // Assuming this package is installed
const { assertProperty } = require('../playwright.setup');

// Define Zod schema for component props
const UserPropsSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(50),
  age: z.number().int().min(0).max(120), // Allow 0 for edge cases?
  role: z.enum(['admin', 'user', 'guest']).optional(),
  isActive: z.boolean(),
  settings: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }).optional(),
});

// Create an arbitrary from the Zod schema
const userPropsArb = ZodFastCheck().inputOf(UserPropsSchema);

test('user profile displays generated user data correctly', async ({ page }) => {
  await page.goto('/component-test-harness'); // Page with the harness

  await assertProperty(
    'User profile component renders name and age based on props',
    userPropsArb,
    async (userProps) => {
      // Use page.evaluate to pass props to the component via the test harness function
      await page.evaluate((props) => {
        // Assuming window.renderUserProfile exists on the test page
        window.renderUserProfile(props);
      }, userProps);

      // Wait for potential async rendering/updates
      await page.waitForSelector('.user-profile-card', { state: 'attached', timeout: 500 });

      // Verify rendering based on props
      const nameText = await page.locator('.user-name').textContent();
      const ageText = await page.locator('.user-age').textContent(); // Assuming age is rendered

      // Property: Rendered name and age match the input props
      expect(nameText).toContain(userProps.name);
      if (userProps.age !== undefined) {
         expect(ageText).toContain(String(userProps.age));
      }
      // Add more checks for other props as needed
      return true; // Indicate success
    },
    { numRuns: 20 }
  );
});
```

## Best Practices and Tips

### 1. Balance Test Runs (`numRuns`) and Speed

Property-based tests involving browser interactions are inherently slower than unit tests.

- Start with a moderate `numRuns` (e.g., 10-25).
- Increase `numRuns` for critical components or properties where more variations are needed.
- Decrease `numRuns` if tests become too slow, especially in CI environments.
- Focus PBT on component logic rather than extensive E2E flows.

```javascript:tests/components/dropdown.spec.js
// tests/components/dropdown.spec.js
const { test } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('dropdown menu renders generated options correctly', async ({ page }) => {
  await page.goto('/dropdown-test');

  // Arbitrary for dropdown options (array of strings)
  const optionsArb = fc.array(fc.string(1, 30), { minLength: 0, maxLength: 15 });

  await assertProperty(
    'Dropdown should display all provided options when opened',
    optionsArb,
    async (options) => {
      // Assume a function exists to set dropdown options
      await page.evaluate((opts) => window.setDropdownOptions(opts), options);

      await page.click('.dropdown-toggle');
      await page.waitForSelector('.dropdown-menu', { state: 'visible' });

      // Verify each option is present in the menu
      for (const option of options) {
        const optionLocator = page.locator(`.dropdown-item:has-text("${option}")`);
        const isVisible = await optionLocator.isVisible();
        if (!isVisible) {
          console.error(`Option "${option}" not found or not visible.`);
          return false; // Property failed
        }
      }
      return true; // Property holds
    },
    { numRuns: 10 } // Adjust runs based on performance vs. coverage needs
  );
});
```

### 2. Handle Asynchronous Operations and State

- **Wait for Elements:** Use Playwright's locators and auto-waiting (`page.locator(...)`, `expect(locator).toBeVisible()`) or explicit waits (`page.waitForSelector`, `page.waitForFunction`) before interacting or asserting.
- **Component Updates:** If component updates are asynchronous after interaction (e.g., fetching data, debounced input), ensure you wait for the update to complete before checking properties.
- **State Reset:** Ensure the component state is reset between `assertProperty` runs if necessary. This might involve reloading the page (`page.reload()`) or calling a reset function via `page.evaluate()`. The `assertProperty` helper itself doesn't automatically reset state; the `propertyFn` should handle necessary setup/cleanup for each run if needed.

```javascript:tests/components/async-counter.spec.js
// tests/components/async-counter.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('async counter updates correctly after delay', async ({ page }) => {
  await page.goto('/async-counter-test');

  await assertProperty(
    'Counter value should match clicks after async updates',
    fc.integer(1, 5), // Number of times to click increment
    async (clickCount) => {
      // Reset counter before each run (assuming a reset button exists)
      await page.click('#reset-button');
      await expect(page.locator('#counter-value')).toHaveText('0'); // Wait for reset

      // Click the increment button multiple times
      for (let i = 0; i < clickCount; i++) {
        await page.click('#increment-async-button');
        // IMPORTANT: Wait for the async operation triggered by the click to complete.
        // This depends on the component's implementation. Example: wait for a loading indicator to disappear,
        // or wait for the text content to change (with a timeout).
        await expect(page.locator('#counter-value')).toHaveText(String(i + 1), { timeout: 1000 }); // Wait for expected text
      }

      // Final check
      const finalValue = await page.locator('#counter-value').textContent();
      // Property: Final counter value matches the number of clicks.
      return finalValue === String(clickCount);
    },
    { numRuns: 8 }
  );
});
```

### 3. Use Realistic and Diverse Input Generators (`Arbitraries`)

- **Combine Arbitraries:** Use `fc.record`, `fc.tuple`, `fc.oneof` to create complex data structures.
- **Filter Inputs:** Use `.filter()` to exclude invalid inputs if the property only applies to valid data, but be cautious as filtering can slow down generation.
- **Map Inputs:** Use `.map()` to transform generated values (e.g., formatting dates).
- **Edge Cases:** Include explicit edge cases using `fc.constant()` or generators like `fc.string({ minLength: 0 })` (empty string), `fc.integer({ min: 0, max: 0 })` (zero).
- **Contextual Generation:** Sometimes, one generated value depends on another (e.g., generating a `currentPage` less than or equal to `totalPages`). Use `fc.chain` for this.

```javascript:tests/components/search.spec.js
// tests/components/search.spec.js
const { test } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('search component handles various query types gracefully', async ({ page }) => {
  await page.goto('/search-test');

  // Arbitrary for diverse search queries
  const searchQueryArb = fc.oneof(
    { weight: 10, arbitrary: fc.stringOf(fc.hexa(), { minLength: 1, maxLength: 40 }) }, // Common case: alphanumeric
    { weight: 2, arbitrary: fc.string({ minLength: 1, maxLength: 50 }) }, // Include symbols
    { weight: 1, arbitrary: fc.constant('') }, // Empty query
    { weight: 1, arbitrary: fc.string(100, 200) }, // Very long query
    { weight: 1, arbitrary: fc.unicodeString({ minLength: 1, maxLength: 30 }) } // Unicode characters
  );

  await assertProperty(
    'Search component should always display results or an empty/error state',
    searchQueryArb,
    async (query) => {
      await page.fill('.search-input', query);
      await page.click('.search-button');

      // Wait for either results area or empty state to appear
      await page.waitForSelector('.search-results, .empty-results, .error-message', { state: 'visible', timeout: 2000 });

      // Property: Component should always show one of the expected states after search.
      const hasResults = await page.locator('.search-results').isVisible();
      const hasEmptyState = await page.locator('.empty-results').isVisible();
      const hasErrorState = await page.locator('.error-message').isVisible();

      return hasResults || hasEmptyState || hasErrorState;
    },
    { numRuns: 15 }
  );
});
```

## Advanced Techniques

### 1. Debugging Failures: Shrinking and Traces

- **Shrinking:** When `assertProperty` fails, fast-check automatically tries to "shrink" the failing input to the simplest possible case that still causes the failure. The `verbose: fc.VerbosityLevel.Verbose` option (or `verbose: true`) in `fc.assert` parameters ensures this minimal counterexample is printed clearly.
- **Playwright Traces:** Configure Playwright to record traces (`trace: 'on-first-retry'` or `'retain-on-failure'` in `playwright.config.js`). When a property test fails (often on the first run or during shrinking), the trace provides a step-by-step visual recording, DOM snapshots, and console logs, helping you understand _why_ the minimal counterexample failed in the browser. Combine the fast-check counterexample with the Playwright trace for effective debugging.

```javascript:tests/components/debug-example.spec.js
// tests/components/debug-example.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('complex component interaction property', async ({ page }) => {
  await page.goto('/complex-component-test');

  const complexInputArb = fc.record({
    value: fc.integer(),
    option: fc.constantFrom('A', 'B', 'C'),
    enabled: fc.boolean(),
  });

  await assertProperty(
    'Component behaves correctly under complex inputs',
    complexInputArb,
    async (input) => {
      // Simulate interaction based on input
      await page.evaluate((data) => window.configureComponent(data), input);
      await page.click('#action-button');

      // Wait for expected outcome (which might depend on input)
      await page.waitForSelector('#status-indicator', { state: 'visible' });
      const status = await page.locator('#status-indicator').textContent();

      // Example property check (likely more complex in reality)
      const expectedStatus = input.enabled ? `Processed ${input.value} with ${input.option}` : 'Disabled';
      // Use expect for better failure messages within a single run
      expect(status).toBe(expectedStatus);
      // Return true or let expect handle the error
      return true;
    },
    {
      numRuns: 30,
      // Verbose output is enabled by default in the helper, but can be specified here too
      // verbose: fc.VerbosityLevel.Verbose
    }
    // No try/catch needed here, assertProperty handles enhancing the error.
    // Playwright test runner will catch the failure.
  );
  // If the test fails, check the console for the fast-check counterexample
  // and open the Playwright trace report for detailed browser state.
});
```

### 2. Controlling Randomness for Reproducibility

While PBT thrives on randomness, sometimes you need deterministic runs (e.g., debugging a specific failure found in CI).

- **`seed`:** Pass a `seed` option to `assertProperty` (which passes it to `fc.assert`). Using the same seed guarantees the same sequence of generated inputs.
- **`path` and `endOnFailure`:** For failures, fast-check outputs a `path` string representing the sequence of choices made during generation. Setting `path` and `endOnFailure: true` replays the exact failing run.

```javascript:tests/components/reproducible.spec.js
// tests/components/reproducible.spec.js
const { test } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('component test with fixed seed for reproducibility', async ({ page }) => {
  await page.goto('/my-component-page');

  await assertProperty(
    'Property X holds consistently with a seed',
    fc.integer(),
    async (value) => {
      await page.fill('#my-input', String(value));
      // ... other interactions
      const result = await page.locator('#result').textContent();
      return result === `Expected: ${value}`;
    },
    {
      numRuns: 10,
      seed: 4815162342, // Use a fixed seed for deterministic runs
    }
  );
});

// Example: Replaying a specific failure found previously
test('replay failing case for property X', async ({ page }) => {
  await page.goto('/my-component-page');

  await assertProperty(
    'Property X fails for a specific path',
    fc.integer(),
    async (value) => {
      await page.fill('#my-input', String(value));
      // ... other interactions
      const result = await page.locator('#result').textContent();
      // This property might fail for the specific path/value
      return result === `Expected: ${value}`;
    },
    {
      // Path obtained from a previous failing run's output
      path: '5:0:0:1', // Example path
      endOnFailure: true, // Stop after replaying the failing case
      seed: 4815162342, // Use the same seed as the original failing run
    }
  );
});
```

## Combining with Visual Regression Testing

Property-based testing can generate diverse states for visual regression testing, ensuring visual consistency across variations.

```javascript:tests/components/visual-properties.spec.js
// tests/components/visual-properties.spec.js
const { test, expect } = require('@playwright/test');
const fc = require('fast-check');
const { assertProperty } = require('../playwright.setup');

test('button component maintains visual consistency across variants and text lengths', async ({ page }) => {
  await page.goto('/button-test'); // Page rendering the button

  // Arbitrary for button configurations
  const buttonConfigArb = fc.record({
    text: fc.string(1, 30), // Varying text lengths
    variant: fc.constantFrom('primary', 'secondary', 'danger', 'outline'),
    size: fc.constantFrom('small', 'medium', 'large'),
    disabled: fc.boolean(),
  });

  await assertProperty(
    'Button visuals should be consistent for different configurations',
    buttonConfigArb,
    async (config) => {
      // Configure the button using a helper function on the page
      await page.evaluate((cfg) => window.configureButton(cfg), config);

      // Wait for any potential re-render
      await page.waitForTimeout(50); // Small delay if needed

      const buttonLocator = page.locator('.test-button');

      // Use Playwright's visual comparison (expect().toHaveScreenshot())
      // The snapshot name can incorporate parts of the config for uniqueness,
      // but PBT aims to check properties, not exhaustively snapshot every case.
      // A simpler approach is to snapshot a few key states or check specific visual properties.

      // Example Property: Button height should remain consistent for a given size, regardless of text length (within limits)
      const boundingBox = await buttonLocator.boundingBox();
      expect(boundingBox).not.toBeNull();

      // Store height based on size and check consistency (simplified example)
      const key = `${config.size}`;
      const currentHeight = boundingBox.height;
      const storedHeight = await page.evaluate((k) => window.buttonHeights?.[k], key);

      if (storedHeight === undefined) {
        // Store height for this size for the first time
        await page.evaluate((k, h) => {
          if (!window.buttonHeights) window.buttonHeights = {};
          window.buttonHeights[k] = h;
        }, key, currentHeight);
      } else {
        // Property: Height should match previously recorded height for this size
        expect(currentHeight).toBeCloseTo(storedHeight, 1); // Allow minor tolerance
      }

      // You could also take conditional snapshots for specific interesting states found by PBT
      // if (config.text.length > 25 && config.variant === 'danger') {
      //   await expect(buttonLocator).toHaveScreenshot(`button-long-danger-${config.size}.png`);
      // }

      return true; // Indicate property check passed for this run
    },
    {
      numRuns: 15, // Balance coverage and snapshot count/test time
      // Ensure state is reset if needed between runs (e.g., clear window.buttonHeights)
    }
  );
});
```

## Conclusion

Integrating fast-check with Playwright provides a powerful way to test the robustness and correctness of UI components against a vast range of inputs. By defining properties and using appropriate arbitraries, you can uncover edge cases and increase confidence in your component library. Remember to balance the number of test runs (`numRuns`) with execution speed and focus property tests on component logic rather than full end-to-end flows for optimal results. Leverage fast-check's shrinking and Playwright's tracing capabilities to efficiently debug any failures.
