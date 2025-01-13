import { destr } from 'destr'

// @ts-ignore
JSON.parse = destr || JSON.parse

// 모바일 브라우저에서 가상 키보드의 크기 고려 안하기
if ('virtualKeyboard' in navigator) {
	// @ts-ignore
	navigator.virtualKeyboard.overlaysContent = true
}
