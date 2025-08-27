export * from './convertToNumberKeys.js'
export * from './processText.js'
export * from './validateNumbers.js'
import { normalizeString } from './processText.js'

export const idleRun_action = (callback, timeout = 500) => {
	if (typeof callback !== 'function') return

	if (typeof globalThis.requestIdleCallback === 'function') {
		globalThis.requestIdleCallback(callback, { timeout })
	} else {
		globalThis.setTimeout(callback, 0)
	}
}

export function isSameNormalizedString(string1, string2) {
	const normalizedString1 = normalizeString(string1)
	const normalizedString2 = normalizeString(string2)
	return normalizedString1 === normalizedString2
}
