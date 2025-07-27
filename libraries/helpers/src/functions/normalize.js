// Hack: eslint에서 `optimize-regex/optimize-regex`가 계속 걸림. 이 rule만 무시하려고 이 파일에 eslint-disable 주석을 추가해도 안됨. 그래서 아예 eslint.config.js에 ignores: 에 이 파일 자체를 추가함.

/**
 * @param {string} string - 문자열
 * @returns {string} 정규화된 문자열
 */
export function normalizeString(string, options = { toLowerCase: true }) {
	let normalizedContent = string
		// 유니코드 정규화
		.normalize('NFC')
		// 기타 특수문자 제거
		.replaceAll(/[^\p{L}\p{N}]/gu, '')

	if (options.toLowerCase) {
		// 소문자로 통일
		normalizedContent = normalizedContent.toLowerCase()
	}

	return normalizedContent
}
