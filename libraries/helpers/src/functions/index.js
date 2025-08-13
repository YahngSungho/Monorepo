export * from './convertToNumberKeys.js'
export * from './processText.js'
export * from './validateNumbers.js'

export const idleRun_action = (callback, timeout = 500) => {
	if (typeof callback !== 'function') return

	if (typeof globalThis.requestIdleCallback === 'function') {
		globalThis.requestIdleCallback(callback, { timeout })
	} else {
		globalThis.setTimeout(callback, 0)
	}
}
