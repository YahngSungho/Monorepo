import removeMD from 'remove-markdown'
import sanitizeHtml from 'sanitize-html'

/**
 * @param {string} string - 문자열
 * @returns {string} 태그 제거된 문자열
 */
export function removeTagsAll(string) {
	// 입력 문자열에서 모든 태그명 추출
	const tagNames = Array.from(string.matchAll(/<(\w+)[^>]*>/g), (match) => match[1].toLowerCase())
	const uniqueTagNames = Array.from(new Set(tagNames))

	return sanitizeHtml(string, {
		allowedTags: [],
		allowedAttributes: {},
		nonTextTags: Array.from(uniqueTagNames),
		disallowedTagsMode: 'discard',
		// 추가 보안 설정
		allowedSchemes: [],
		allowedSchemesByTag: {},
		allowProtocolRelative: false,
	})
}

export function removeFrontmatter(string) {
	return string.trim().replace(/^---[\s\S]*?---/, '')
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운 제거된 문자열
 */
export function removeMarkdownFormat(string) {
	let result = removeMD(string, {
		stripListLeaders: false, // strip list leaders (default: true)
		listUnicodeChar: '', // char to insert instead of stripped list leaders (default: '')
		gfm: true, // support GitHub-Flavored Markdown (default: true)
		useImgAltText: false, // replace images with alt-text, if present (default: true)
	})
	return result
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운과 태그 제거된 문자열
 */
export function removeMDAndTags(string) {
	let result = removeMarkdownFormat(removeFrontmatter(removeTagsAll(string)))
	return result
}

/**
 * @param {string} string - 마크다운 문자열
 * @returns {string} meta name="description"
 */
export function getDescriptionFromMD(string) {
	let result = removeMDAndTags(string)
	result = result
		.replaceAll(/\s/g, ' ') // 여러 공백을 하나로
		.trim()
	result = `${result.slice(0, 155)  }...` // 155자로 자르고 말줄임표 추가

	return result
}

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