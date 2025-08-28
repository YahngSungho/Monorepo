import '@library/base/base.css'
import 'iconify-icon'

import { idleRun_action } from '@library/helpers/functions'
import { mode } from 'mode-watcher'

import { initMermaidTheme_action } from '../miscellaneous/mermaid/mermaid-theme.js'

export function init(appName) {
	// 모바일 브라우저에서 가상 키보드의 크기 고려 안하기
	if ('virtualKeyboard' in navigator) {
		// @ts-ignore
		navigator.virtualKeyboard.overlaysContent = true
	}

	const doesItApply = (appNameParts) => appNameParts.some((appName_part) => appName.includes(appName_part))

	// Mermaid를 사용하는 앱들
	if (doesItApply(['blog', 'docs'])) {
	idleRun_action(async () => {
		await initMermaidTheme_action(mode.current)
	})

		// 전역 휠/터치 추적 설치 (한 번만)
		if (!globalThis.__ui_interaction_tracking_installed) {
			globalThis.__ui_interaction_tracking_installed = true
			const markBusy_action = () => {
				const now = (globalThis.performance && performance.now()) || Date.now()
				globalThis.__ui_interaction_busy_until = now + 500
			}
			globalThis.addEventListener('wheel', markBusy_action, { passive: true, capture: true })
			globalThis.addEventListener('touchmove', markBusy_action, { passive: true, capture: true })
		}
	}
}
