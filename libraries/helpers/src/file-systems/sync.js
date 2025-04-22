import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Calculates the absolute path relative to the caller's module location.
 * @param {string} relativePath The relative path from the caller's location.
 * @param {string} callerMetaUrl The `import.meta.url` of the calling module.
 * @returns {string} The calculated absolute path.
 * @throws {Error} If `callerMetaUrl` is not provided.
 */
export function getAbsolutePath (relativePath, callerMetaUrl) {
	if (!callerMetaUrl) {
		throw new Error("getAbsolutePath requires the caller's import.meta.url as the second argument.");
	}
	const __filename = fileURLToPath(callerMetaUrl)
	const __dirname = path.dirname(__filename)
	return path.resolve(__dirname, relativePath)
}
