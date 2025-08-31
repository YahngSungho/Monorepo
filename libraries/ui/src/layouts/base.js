import '@library/base/base.css'
import 'iconify-icon'

export function init(appName) {
	// 모바일 브라우저에서 가상 키보드의 크기 고려 안하기
	if ('virtualKeyboard' in navigator) {
		// @ts-ignore
		navigator.virtualKeyboard.overlaysContent = true
	}

	// doesAppNameMatch(['blog', 'docs'])
	// const doesAppNameMatch = (appNameParts) => appNameParts.some((appName_part) => appName.includes(appName_part))
}
