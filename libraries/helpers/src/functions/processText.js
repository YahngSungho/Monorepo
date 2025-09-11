/**
 * @param {string} string - 문자열
 * @returns {string} 정규화된 문자열
 */
export function normalizeString(string, options = {}) {
	const options0 = { toLowerCase: true, ...options }

	let normalizedContent = string
		// 유니코드 정규화
		.normalize('NFC')
		// 기타 특수문자 제거
		// eslint-disable-next-line regexp/no-obscure-range
		.replaceAll(/[^\dA-Za-z가-힣]/gu, '')

	if (options0.toLowerCase) {
		// 소문자로 통일
		normalizedContent = normalizedContent.toLowerCase()
	}

	return normalizedContent
}