import { buildThemeVariables } from '@library/library-bottom/mermaid'

let globalInitPromise
let lastMode // 마지막으로 적용된 테마를 저장할 변수

/**
 * Mermaid.js 테마를 초기화하거나 갱신합니다.
 * @param {string} [mode='light'] 현재 테마 모드
 */
export function initMermaidTheme_action(mode = 'light') {
	if (globalInitPromise && lastMode === mode) {
		return globalInitPromise
	}
	lastMode = mode

	/** @type {import('mermaid').MermaidConfig} */
	const configs = {
		theme: 'base',
		themeVariables: buildThemeVariables(mode),
		// 성능 최적화 옵션
		deterministicIds: true,
		logLevel: 'fatal',
		securityLevel: 'loose',
		startOnLoad: false,
	}

	globalInitPromise = (async () => {
		// 브라우저에서만 실제 초기화 수행 (SSR에서는 설정만 준비된 상태로 반환)
		if (globalThis.window) {
			const mod = await import('mermaid')
			const mermaid = mod.default || mod
			// @ts-ignore
			mermaid.reset?.()
			mermaid.initialize(configs)
		}
	})()

	return globalInitPromise
}
