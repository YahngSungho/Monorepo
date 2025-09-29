import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runTests } from '@library/base/traverse.test.js'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SvelteKit route directory root
const projectRouteRoot = path.join(__dirname, '../src/routes')

// Define parameter examples for dynamic routes
// You can extend this object with more routes and parameters

/** @type {{ [key: string]: string[] }} dynamicRouteParams */
const dynamicRouteParameters = {
	// '/blog/[slug]': ['hello-world', 'sveltekit-example'],
	// '/blog/[id]/[slug]': ['123/my-post', '456/another-post'], <- 이렇게 path에 param 여러개 넣기
	// '/products/[id]': ['123', '456'],
	// '/user/[userId]': ['john_doe', 'jane_smith']
	// Add more dynamic routes and parameter examples as needed
}

runTests(projectRouteRoot, dynamicRouteParameters)
