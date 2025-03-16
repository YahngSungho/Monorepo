PLAYWRIGHT CHEATSHEET

We have structured our Playwright Cheatsheet in a way that it is easy for both beginners to learn and experts to quickly refer to
some important snippets they might be looking for.

Basic Commands

- Browser, Context Management

- Selectors & Mouse Interactions
- Locators
- File and Frame Handling
- Windows Handling

Advanced Interactions

- Special Capabilities
- Network Interception and Manipulation
- Screenshots and Visual Comparisons
- Debugging and Tracing
- Additional Methods

BROWSER, CONTEXT MANAGEMENT

First up in our Playwright Cheatsheet, we’re going to start with the basics to see how to launch a browser instance in regular
mode, incognito mode, and so on.

1. LAUNCHING A BROWSER INSTANCE

- chromium.launch(): Initiates a new instance of the Chromium browser.
- browser.newContext(): Establishes a fresh browser context, which represents an incognito mode profile.
- context.newPage(): Generates a new browser tab (page) within the context for interaction.

// Step 1: Initiate a new instance of the Chromium browser
const browser = await chromium.launch({ headless: false });
// Step 2: Establish a fresh browser context
const context = await browser.newContext();
// Step 3: Generate a new browser tab within the context
const page = await context.newPage();

2. CREATING A PERSISTENT CONTEXT

You can use persistent contexts to maintain session continuity and reuse authentication states across tests. It allows for testing
scenarios where user sessions need to be preserved.

// Launch a persistent context using the specified user data dir
const context = await chromium.launchPersistentContext(userDataDir, {headless: false });

SELECTORS & MOUSE INTERACTIONS

Once the browser instance has been launched, the next steps in the automation will involve keyboard and mouse interactions which
we will be seeing now in our Playwright Cheatsheet.

1. USING SELECTORS FOR ELEMENT INTERACTION

- page.goto(): Directs the browser tab to a specified URL.
- page.click(): Locates and triggers a button with the identifier Example: ‘submit’.
- page.fill(): Finds an input field with the name ‘username’ and inputs the value.
- page.selectOption(): Identifies a dropdown menu and chooses the option.

await page.goto('<https://example.com>');
await page.click('button#submit');
await page.fill('input[name="username"]', 'example_user');
await page.selectOption('select[name="city"]', 'New York');

Checkboxes and Radio Buttons: Easily toggle checkboxes and radio buttons using locator.setChecked() in Playwright. This method
simplifies the process of both selecting and deselecting options.

// Step 3: Locate a checkbox using its label
const checkbox = page.getByLabel('Terms and Conditions');
// Ensure the checkbox is checked
await checkbox.setChecked(true);
// Step 4: Assert that the checkbox is checked
await expect(checkbox).toBeChecked();

type() : The type method in Playwright is used to simulate keyboard input into a text input field, text area, or any other element
that accepts text input.

await page.getByPlaceholder('Enter your name').type('John Doe');

press(): The press method in Playwright is used to simulate pressing a key on the keyboard. This method allows you to automate
keyboard interactions with web pages.

await page.keyboard.press("Enter");

title(): The title method in Playwright is used to retrieve the title of the current web page. You can use this method to extract
the title of the web page you are interacting with during your automation or testing scripts.

const pageTitle = await page.title();
console.log(`page title is : ${pageTitle});

check(): The check method in Playwright is used to interact with checkboxes and radio buttons on a web page.

await page.check('input#myCheckbox');
Or
await page.locator('input#myCheckbox').check();

unCheck(): The uncheck method in Playwright is used to uncheck (deselect) checkboxes or radio buttons on a web page.

await page.uncheck('input#myCheckbox');
Or
await page.locator('input#myCheckbox').uncheck();

focus(): This method can be particularly useful when you want to simulate user interactions like keyboard input or navigating
through a web application using keyboard shortcuts.

await page.locator('input#username').focus();

hover(): The hover method in Playwright is used to simulate a mouse hover action over a web page element. When you hover over an
element, it can trigger various interactions or reveal hidden content.

await page.locator('button#myButton').hover();
or
await page.hover('button#myButton');

textContent(): Although the textContent method is not a built-in method in Playwright, it is a standard JavaScript method used to
retrieve the text content of a DOM element.

const element = await page.locator('div#myElement');
const textContent = await
element.textContent()console.log('Text Content:', textContent);

allTextContents(): In Playwright, the allTextContent method is used to find array of multiple elements in the DOM. which returns
an array of textContent values for all matching nodes.

const element = page.locator('div#Element');
const textContents = await element.allTextContents();
console.log(`All Text Contents : ${textContents}`);

inputValue(): The inputValue method in Playwright is used to retrieve the current value of an input element, such as a text input,
textarea, or password field.

// Using inputValue to retrieve the current value of the input field
const inputValue = await page.inputValue('input#username');
console.log('Current input value:', inputValue);

close(): The close method is the last selector we’re going to see in our Playwright cheatsheet and it is used to close a browser,
browser context, or page. You can use this method to gracefully shut down browser instances or specific pages. Here’s how you can
use the close method in Playwright.

// Close the page when done
await page.close();
// Close the browser context
await context.close();
// Close the browser instance
await browser.close();

2. MOUSE INTERACTIONS

Clicks and Double Clicks: Playwright can simulate both single clicks and double clicks on elements.

// Single click
await page.click('selector');
// Double click
await page.dblclick('selector');

Hover and Tooltips: You can use Playwright to hover over elements and reveal tooltips or activate dropdown menus.

await page.hover('selector');
const tooltip = await page.waitForSelector('tooltip-selector');
const tooltipText = await tooltip.innerText(); // Get text from the tooltip
console.log(tooltipText);

Drag and Drop: Here are the Playwright techniques for simulating drag-and-drop interactions between elements on a webpage.

// Locate the source and target elements
const source = await page.$('source-selector');
const target = await page.$('target-selector');
// Perform drag-and-drop
await source.dragAndDrop(target);

move(): mouse.move(x, y) in Playwright is used to move the mouse to a specific position on the page. This can be useful for
simulating mouse movements during automated testing. The x and y parameters represent the coordinates where you want the mouse to
move, with (0, 0) being the top-left corner of the page.

await page.mouse.move(100, 100);

dragTo(): This method is useful for automating drag-and-drop interactions in your web application. Let’s see how to use the
dragTo() method with a sample snippet in our Playwright cheatsheet.

//Locate the source and target elements you want to drag & drop
const sourceElement = await page.locator('source-element-selector')
const targetElement = await page.locator('target-element-selector')
// Perform the drag-and-drop action
await sourceElement.dragTo(targetElement)

Pressing and Releasing Mouse Buttons: In Playwright, you can simulate pressing and releasing mouse buttons using the mouse.down()
and mouse.up() methods.

const myElement = page.locator('.my-element')
await myElement.mouse.down() // Press the left mouse button
await myElement.mouse.up() // Release the left mouse button

Context Menu: See how Playwright interacts with context menus by right-clicking elements and selecting options.

// Right-click on an element to open the context menu
await page.click('element-selector', { button: 'right' });
// Wait for the context menu to appear
await page.waitForSelector('context-menu-selector', { state: 'visible' });
// Click on an option within the context menu
await page.click('context-menu-option-selector');

Scrolling: Discover how to simulate scrolling actions in Playwright using mouse interactions. Demonstrate scrolling through a long
webpage to ensure all content loads correctly or to capture elements that only appear when scrolled into view.

// Click on an option within the context menu
await page.click('context-menu-option-selector');
await page.evaluate((x, y) => { window.scrollBy(x, y); });

Note: Use stable selectors like IDs or data attributes to ensure robust tests; validate mouse interactions by asserting resulting
UI changes.

LOCATORS

As we all know, a locator is a tool for locating elements on a webpage and Playwright has a lot of available locators. Now in our
Playwright cheatsheet, we’re going to see the several available methods for finding elements, and the chosen parameters are sent
to the methods for finding elements.

1. getByRole(): getByRole is used to query and retrieve elements on a web page based on their accessibility roles, such as
   “button,” “link,” “textbox,” “menu,” and so on. This is particularly useful for writing tests that focus on the accessibility and
   user experience of a web application.

// Click on an option within the context menu
await page.getByRole('textbox', {name:'Username'}).fill(‘vijay’);

2. getByText(): Although getByText() is not a built-in method in Playwright, it is a method that is often used in testing
   libraries like Testing Library (e.g., React Testing Library or DOM Testing Library) to query and interact with elements based on
   their text content.

await page.getByText('Forgot your password? ').click();

3. getByPlaceholder(): The getByPlaceholderText method is used to select a DOM element based on its placeholder attribute in an
   input element.

await page.getByPlaceholder('Username').fill('vijay');

4. getByAltText(): getByAltText() is not a method associated with Playwright; it’s actually a method commonly used in testing
   libraries like React Testing Library and Testing Library (for various JavaScript frameworks) to select an element by its alt
   attribute. If you are writing tests using one of these testing libraries, here’s how you can use getByAltText().

await page.getByAltText('client brand banner').isVisible();

5. getByTitle() :getByTitle() method in Playwright is for interacting with an HTML element that has a specific title attribute.If
   you are writing tests using one of the testing libraries mentioned above, here’s how you can use it

- await page.getByTitle('Become a Seller').click();

FILE AND FRAME HANDLING

As we have seen how to launch the browser instance, use selectors, and handle mouse interactions in our Playwright cheatsheet, the
next step would be to see how we can handle files, frames, and windows. Let’s start with files and frames now.

1. HANDLING FILE UPLOADS

- Easily handle file uploads during testing to ensure the functionality works as expected in your application by referring to the
  below code.

  // Navigate to the page with the file upload form
  await page.goto('your-page-url');
  // Trigger the file input dialog
  const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'),
  page.click('button-to-trigger-file chooser')]);
  // Set the files to upload
  await fileChooser.setFiles('path/to/your/file.txt');

  2. INTERACTING WITH FRAMES

- Playwright allows you to interact with frames on a web page using methods like frame(), frames(), and waitForLoadState().
  Here’s how you can do it.
- Use the frame() method to access a specific frame by its name, URL, or element handle.
- Get Frame using Name FrameSelector :

  const allFrames = page.frames();

- Get Frame using Name Option :

  const myFrame = page.frame({name: "frame1"});
  or
  const myFrame = page.frame("frame1");

- Get Frame using URL option :

  const
  Myframe=page.frame({url:"<http://autopract.com/playwright/form1/"}>);

- Get Frame using Selector :

  const
  myFrame = page.frameLocator("iframe[name='frame1']");

- Navigate within a specific frame using the goto() method.

  await frame.goto('<https://codoid.com>');

- Go back and forward within a frame using the goBack() and goForward() methods

  await frame.goBack();
  await frame.goForward();

- Wait for a frame to load or reach a specific load state using the waitForLoadState() method.

await frame.waitForLoadState('domcontentloaded');

Best Practices:

Automate file uploads and downloads to streamline file-related workflows. You can switch between frames using IDs or names for
seamless interaction.

WINDOWS HANDLING

Windows handling is an important aspect of web automation and testing, especially when dealing with scenarios where you need to
interact with multiple browser windows or tabs. And that is why we have covered it in our Playwright Cheatsheet.

Playwright provides methods for handling multiple browser windows and tabs within a single browser instance. Here’s how you can
work with windows handling in Playwright.

const [newWindow] = await Promise.all([context.waitForEvent('page'),
await page.getByText('APPLE iPhone 14 (Blue, 128 GB)').first().click()]);
await newWindow.waitForLoadState();
expect(newWindow.url()).toContain('apple-iphone-14');

- To switch to a specific window or tab using the page title or URL:

  const secondPage = pages.find((page) => page.url()==='<https://codoid.com>');
  await secondPage.bringToFront();

- Close a specific window/tab when you are done with it:

- await secondPage.close();

Best Practices:

Manage multiple windows or tabs by tracking handles and switching context as necessary. Make sure to close windows or tabs after
tests to maintain a clean testing environment.

SPECIAL CAPABILITIES

As stated earlier in our Playwright Cheatsheet, we have also covered advanced interactions in addition to the basic commands. The
first of the many advanced interactions we’re going to see special capabilities such as device emulation and record and playback
capabilities.

1. Emulating Devices:

- You can emulate a device for responsive testing to ensure your app looks good on various devices. This is crucial for testing
  mobile responsiveness and user experience.

const { devices, chromium } = require('playwright');
// Define the device you want to emulate
const iPhone = devices['iPhone 11'];
// Launch a browser and create a new context with device emulation
const browser = await chromium.launch();
const context = await browser.newContext({...iPhone,});

2. Recording and Replaying Actions

- You can automatically generate Playwright scripts with ease by recording your actions within a browser. This speeds up the
  creation of test scripts by capturing real user interactions.

npx playwright codegen

NETWORK INTERCEPTION AND MANIPULATION

Testing is not just about validating the results with happy paths as users might face numerous challenges in real-world scenarios.
One of the common challenges can be with the network and we can manipulate it based on our testing needs. Let’s see how in our
Playwright Cheatsheet.

1. Mocking Responses

Intercept and mock network responses to evaluate your app’s handling of different API responses. This is useful for testing error
scenarios and verifying API integrations.

// Intercept requests to a specific URL
await page.route('\*\*/api/data', async (route) => {
// Respond with custom data
await route.fulfill({
contentType: 'application/json',
body: JSON.stringify({ key: 'mockedValue' }) }); });

2. Simulating Offline Mode

Test how your application behaves when offline by simulating network disconnections. This ensures that your app handles offline
scenarios seamlessly.

- // Set the page to offline mode
  await page.setOffline(true);
  // Navigate to a page and perform actions
  await page.goto('<https://example.com>');
  // Restore network connection (optional)
  await page.setOffline(false);

SCREENSHOTS AND VISUAL COMPARISONS

Screenshots play a vital role in terms of reporting and with Playwright, you have the provision of capturing full-page screenshots
and also screenshots of a particular element if required.

1. SCREENSHOTS

Capturing a Full-Page Screenshot

- You can take a screenshot of the entire page to visually verify the UI. This is beneficial for visual regression testing to
  identify unexpected changes.

// Take a full-page screenshot
await page.screenshot({ path: 'fullpage-screenshot.png', fullPage: true});

- There is also a provision to capture a screenshot of a specific element to focus on individual UI components. It helps in
  verifying the appearance of particular elements.

// Locate the element
const element = await page.$('selector-for-element');
if (element) {
// Take a screenshot of the element
await element.screenshot({ path: 'element-screenshot.png' });
console.log('Element screenshot taken'); }

DEBUGGING AND TRACING

The next set of advanced interactions we’re going to see in our Playwright cheatsheet is the debugging and tracing features that
enable easier debugging and failure analysis/

ENABLING DEBUG MODE(SLOWMO)

- Using Playwright, you can execute tests in a visible browser with slow motion enabled for easier debugging. This helps you see
  what’s happening in real time and diagnose the issues.

// Launch the browser with slowMo
const browser = await chromium.launch({
headless: false, // Run in headful mode to see the browser
slowMo: 1000 // Slow down actions by 1000 milliseconds (1 second)
});

CAPTURING TRACES

- You can capture detailed traces to analyze test failures and performance issues. This offers insights into test execution for
  debugging purposes.

- // Start tracing
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();
  await page.goto('<https://example.com>');
  // Perform actions
  await page.click('selector-for-button');
  await page.fill('selector-for-input', 'some text');
  // Stop tracing and save it to a file
  await context.tracing.stop({ path: 'trace.zip' });

Best Practices:

You can also use console logs and debug statements within tests to troubleshoot issues and enable tracing to capture detailed logs
for performance analysis.

ADDITIONAL METHODS

In the final section of our Playwright cheatsheet, we are going to see a few additional methods such as retrying actions, using
locator assertions, and forcing colors mode.

Retrying Actions

Retrying actions addresses intermittent issues by repeatedly attempting a failed action until it either succeeds or the maximum
number of retries is exhausted.

const retryDelay = 1000; const maxRetries = 3; // 1 second delay between retries
await new Promise(resolve => setTimeout(resolve, retryDelay)); // Delay before retrying

Using Locator Assertions

- You can add assertions to ensure elements are visible, improving test reliability. This verifies that critical elements are
  present on the page.

// Check if the element is visible
await expect(page.locator('selector-for-element')).toBeVisible();

- Enabled/Disabled State Assertions

  await expect(page.locator('selector-for-element')).toBeEnabled();
  await expect(page.locator('selector-for-element')).toBeDisabled();

- Text and Count Assertion

  await expect(page.locator('selector-for-element')).toHaveText('Expected Text');
  await expect(page.locator('selector-for-elements')).toHaveCount(expectedCount);

- Invisibility Assertion

await expect(page.locator('selector-for-element')).toBeHidden();

Forcing Colors Mode

- There is even an option to simulate the high contrast mode for accessibility testing, ensuring usability for all users. This is
  crucial for testing the accessibility features of your application.

// Force dark color scheme
await page.emulateMedia({ forcedColors: 'dark' });
await browser.close(); })();

---

THE COMPLETE PLAYWRIGHT CHEATSHEET

OVERVIEW

Playwright is a Node.js library for cross-browser end-to-end testing. It enables reliable testing across Chromium, Firefox and
WebKit.

// Install Playwright
npm i -D @playwright/test

KEY FEATURES

Cross-browser testing: Chromium, Firefox, WebKitNetwork layer (mocking/stubbing requests and responses)CPU throttling, Device
emulationScreenshots, Videos, Trace Viewer

CORE CONCEPTS

BROWSER TYPES

Playwright supports 3 browser types - chromium, firefox and webkit. Browser instances can be created as:

const { chromium } = require('playwright');

const browser = await chromium.launch();

BROWSER CONTEXTS

Browser contexts isolates browser state like cookies, storage etc. New context guarantees clean state.

const context = await browser.newContext();

PAGES

Pages represent tabs and hold the actual page state. New pages open fresh empty tabs.

const page = await context.newPage();

BASIC EXAMPLES

NAVIGATE TO PAGE

await page.goto('<https://www.example.com>');

GET PAGE TITLE

await page.title();

CLICK ELEMENT

await page.click('button');

TYPE TEXT

await page.fill('input', 'text');

ASSERTIONS

// Assertion helpers
expect(page.url()).toBe('<https://example.com>');
await expect(page.locator('h1')).toHaveText('Title');

SCREENSHOT

await page.screenshot({ path: 'screenshot.png' });

ADVANCED INTERACTIONS

CLICKING ELEMENTS

Options like click count, button type etc.:

await page.click('#submit', { clickCount: 2 });
await page.click('#checkbox', { button: 'right' });

TYPING TEXT

Handle delays while typing, useful for UI/UX testing:

await page.type('#address', 'Hello World', { delay: 100 });

ELEMENT STATES

Force element states before interacting:

await page.focus('#email');
await page.check('#checkbox');

SELECTOR STRATEGIES

Playwright offers different selector engines to query elements:

CSS SELECTOR

await page.click('button');

TEXT SELECTOR

Selects elements based on inner text

await page.click('text=Login');

XPATH SELECTOR

Full XPath support

await page.click('//button[text()="Login"]');

ID Selector

Select element by ID attribute

await page.click('#login-button');

Data Test ID

Custom test id attributes for unique selection

await page.click('[data-testid="submit-form"]');

By Role

Semantic selector by element role

await page.click('.role-button');

ADVANCED ELEMENT SELECTORS

Pass selector functions to customize selection:

await page.locator(({ hasText }) => hasText('Save')).click();

DOM Path:

await page.getByTestId('email-id', { path: 'form div' });

Select visible elements:

await page.getByText('Save', { exact: true, visible: true });

ADVANCED USAGE

CONFIGURE BROWSER SETTINGS

Settings like viewport size, user agent etc. can be configured for browsers using browserType.launch()

await chromium.launch({
headless: false,
slowMo: 50,
viewport: {width: 1280, height: 720}
});

INTERCEPT NETWORK REQUESTS

Network requests can be mocked and stubbed for testing using route handlers.

await context.route('\*_/_.{png,jpg}', route => {
route.abort();
});

This aborts all image requests.

EMULATE DEVICES

Playwright allows emulation of devices like iPhone, iPad etc.

const context = await browser.newContext({
...devices['iPhone X']
});

LOCAL STORAGE

Handle browser storage (localStorage, sessionStorage)

await context.storageState({path: 'state.json'}); // save storage state
await context.storageState({path: 'state.json'}); // restore state

MULTI-BROWSER TESTING

Run same tests across Chromium, Firefox and WebKit using test runner.

npm test // runs tests over all 3 browsers

DOCKER IMAGES

Playwright provides official docker images with browsers installed. This removes need for browser drivers on CI.

docker pull mcr.microsoft.com/playwright:v1.24.0-focal

TRACING VIEWER

Playwright captures browser traces during test execution which helps debug tests.

npx playwright show-trace trace.zip

ADDITIONAL ASSERTIONS

Element State

Assert element states like disabled, visible etc.

await expect(page.locator('button')).toBeDisabled();

Visual Comparison

Compare screenshots to baseline images

await expect(page.screenshot()).toMatchSnapshot('landing.png');

WAIT HELPERS

Wait For Selector

Wait until selector is available before performing action

await page.waitForSelector('div.loaded');

Wait For Navigation

Wait for navigation to finish before asserting page state

await page.waitForNavigation();

AUTHENTICATION

Persist Credentials

Use context storage state to persist login sessions

await context.storageState({path: 'state.json'});

REPORTING

Playwright Cloud

Upload test results and artifacts to Playwright Cloud

npm test --project=myCloudProject

DYNAMIC MOCK RESPONSE

Return different mock data based on request:

await context.route('\*_/_.json', route => {
if (route.request().url().includes('data')) {
route.fulfill({
status: 200,
body: JSON.stringify({data: 'mock'})
});
} else {
route.abort();
}
});

GRAPHQL MOCKING

Stub GraphQL API response with dummy data:

await context.route('<https://api.graph.cool/simple/v1/movies>', route => {
route.fulfill({
status: 200,
contentType: 'application/json',
body: JSON.stringify({data: {movies: ['Movie 1']}})
});
});

DEVICES AND EMULATION

Emulating various mobile devices:

// iPhone XR
await context.emulate(devices['iPhone XR']);

// Google Pixel 5
await context.emulate(devices['Pixel 5']);

Device specific viewports:

await context.emulateViewport(1920, 1080); // Full HD
await context.emulateViewport(360, 640); // iPhone 5/SE

ASSERTIONS & VALIDATION

Element count assertion:

await expect(page.locator('.items')).toHaveCount(5);

Validate JS expression:

await page.waitForFunction(() => window.innerWidth < 1000);

Assert response times:

await expect(page).toRespondIn(50); // ms

BROWSER CONTEXT SHARING

You can share data between browser contexts using the browserContext.storageState() method. This can be useful for scenarios where
you want to reuse cookies or authentication tokens between different contexts.

// Saving browser context storage state
const storageState = await context.storageState({ path: 'auth.json' });

// Create a new browser context and restore storage state
const newContext = await browser.newContext();
await newContext.addCookies(storageState.cookies);
await newContext.clearCookies(); // If needed, clear cookies before adding
await newContext.addCookies(storageState.cookies);

ELEMENT HOVER AND SCROLL

You can hover over an element using the hover() method, and you can scroll to an element using the scrollIntoView() method.

// Hover over an element
await page.hover('#element-to-hover');

// Scroll to an element
await page.$eval('#element-to-scroll-to', (element) => {
element.scrollIntoView();
});

FILE UPLOAD AND DOWNLOAD

To interact with file upload buttons, you can use the input.uploadFile() method. To handle file downloads, you can use the
browserContext.waitForEvent('download') method.

// Upload a file
await page.setInputFiles('#file-input', 'path/to/file.txt');

// Handle file downloads
const [download] = await Promise.all([
context.waitForEvent('download'),
page.click('#download-button'),
]);
await download.saveAs('path/to/save/file.txt');

WORKING WITH FRAMES AND IFRAMES

You can interact with frames and iframes using the frame() method.

// Switch to a frame by name or ID
const frame = page.frame('frameName');
await frame.click('#element-in-frame');

// Switch back to the main frame
await page.waitForLoadState('domcontentloaded');

HEADLESS MODE

You can run Playwright tests in headless mode by configuring the headless option when launching the browser.

await chromium.launch({ headless: true });

PAGE EVENTS

You can listen for and handle various page events using the page.on() method.

page.on('dialog', async (dialog) => {
console.log('Dialog message:', dialog.message());
await dialog.accept();
});

page.on('console', (message) => {
console.log('Console message:', message.text());
});

ERROR HANDLING

Use try-catch blocks to handle errors that may occur during test execution.

try {
// Perform actions that may throw errors
} catch (error) {
console.error('An error occurred:', error.message);
}

PAGE NAVIGATION STRATEGIES

You can navigate back and forward in the browser's history using the goBack() and goForward() methods.

await page.goBack(); // Navigate back
await page.goForward(); // Navigate forward

PARALLEL TESTING

To run tests in parallel, you can leverage Playwright's built-in test runner.

npx playwright test --workers 4

CUSTOM TEST CONFIGURATION

Set up custom test configurations for different environments using Playwright's configuration files.

// playwright.config.js
module.exports = {
projects: [
{
name: 'dev',
use: { ... },
},
{
name: 'prod',
use: { ... },
},
],
};

PAGE OBJECTS

Implement the page object pattern to separate page interactions from test code.

// Example page object
class LoginPage {
constructor(page) {
this.page = page;
}

async login(username, password) {
// Implement login logic
}
}

TEST STRUCTURE

Follow a clear test structure that includes setup, execution, and teardown phases. Use before and after hooks to handle common
setup and cleanup tasks.

// Example using Jest hooks
beforeEach(async () => {
// Perform common setup steps here
await page.goto('<https://example.com>');
});

afterEach(async () => {
// Perform common cleanup tasks here
});

test('Test case description', async () => {
// Test execution code
});

TIMING ISSUES

Ensure that your tests handle asynchronous operations correctly. Use await to wait for elements to become available, and consider
using waitForSelector or waitForFunction when necessary.

// Wait for an element to become visible
await page.waitForSelector('.my-element', { state: 'visible' });

UNHANDLED ERRORS

Always include error handling in your tests to catch and handle exceptions gracefully. Use try-catch blocks to capture errors and
provide informative error messages.

try {
// Test actions that may throw errors
} catch (error) {
console.error('An error occurred:', error.message);
}

MEASURING PAGE LOAD TIME

You can measure the time it takes for a page to load using the page.goto method along with the performance.timing API.

const startTime = Date.now();
await page.goto('<https://example.com>');
const loadTime = Date.now() - startTime;
console.log(`Page loaded in ${loadTime}ms`);

NETWORK THROTTLING

Playwright allows you to simulate different network conditions, such as slow 3G or offline mode, to test how your application
behaves under varying network speeds.

// Simulate slow 3G network
await context.route('\*_/_', (route) => {
route.throttle('Regular3G');
route.continue();
});

ANALYZING PERFORMANCE METRICS

You can gather various performance metrics using the page.metrics() method to assess the performance of your web application.

await page.goto('<https://example.com>');
const metrics = await page.metrics();
console.log('Performance metrics:', metrics);
