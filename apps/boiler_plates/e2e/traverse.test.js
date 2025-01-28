import { join } from 'path'
import { fileURLToPath } from 'url'
import path from 'node:path'
import { runTests } from '@repo/base/traverse.test.js'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SvelteKit route directory root
const projectRouteRoot = join(__dirname, '../src/routes')

// Define parameter examples for dynamic routes
// You can extend this object with more routes and parameters

/**
 * @type {{ [key: string]: string[] }} dynamicRouteParams
 */
const dynamicRouteParams = {
	// '/blog/[slug]': ['hello-world', 'sveltekit-example'],
	// '/products/[id]': ['123', '456'],
	// Add more dynamic routes and parameter examples as needed
}

runTests(projectRouteRoot, dynamicRouteParams)