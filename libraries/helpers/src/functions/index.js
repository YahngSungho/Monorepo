export * from './convertToNumberKeys.js'
export * from './validateNumbers.js'

/**
 * @param {string} string - 문자열
 * @returns {string} 정규화된 문자열
 */
export function normalizeString(string) {
	let normalizedContent = string
		// 유니코드 정규화
		.normalize('NFC')
		// 소문자로 통일
		.toLowerCase()
		// 기타 특수문자 제거
		// eslint-disable-next-line optimize-regex/optimize-regex
		.replaceAll(/[^\p{L}\p{N}]/gu, '')

	return normalizedContent;
}
