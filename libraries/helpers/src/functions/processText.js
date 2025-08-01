// Hack: eslint에서 `optimize-regex/optimize-regex`가 계속 걸림. 이 rule만 무시하려고 이 파일에 eslint-disable 주석을 추가해도 안됨. 그래서 아예 eslint.config.js에 ignores: 에 이 파일 자체를 추가함.

import removeMD from 'remove-markdown'

/**
 * @param {string} string - 문자열
 * @returns {string} 태그 제거된 문자열
 */
export function removeTagsAll(string) {
	return string.replace(/<[^>]*>.*?<\/[^>]*>|<[^>]*\/>/g, '')
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운 제거된 문자열
 */
export function removeMarkdownFormat(string) {
	return removeMD(string, {
		stripListLeaders: false , // strip list leaders (default: true)
		listUnicodeChar: '',     // char to insert instead of stripped list leaders (default: '')
		gfm: true,                // support GitHub-Flavored Markdown (default: true)
		useImgAltText: true      // replace images with alt-text, if present (default: true)
	})
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운과 태그 제거된 문자열
 */
export function removeMDAndTags(string) {
	return removeMarkdownFormat(removeTagsAll(string))
}

/**
 * @param {string} string - 마크다운 문자열
 * @returns {string} meta name="description"
 */
export function getDescriptionFromMD(string) {
	let result = string
		.replace(/\s+/g, ' ') // 여러 공백을 하나로
		.trim()
	result = removeMDAndTags(result)
	result = result.substring(0, 155) + '...' // 155자로 자르고 말줄임표 추가

	return result
}

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
