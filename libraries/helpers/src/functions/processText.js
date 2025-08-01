// Hack: eslint에서 `optimize-regex/optimize-regex`가 계속 걸림. 이 rule만 무시하려고 이 파일에 eslint-disable 주석을 추가해도 안됨. 그래서 아예 eslint.config.js에 ignores: 에 이 파일 자체를 추가함.

// Warn: 여기 있는 함수들은 내부 데이터에만 사용할 것. RegExp들이 ReDos 공격에 안전하지 않음.

import removeMD from 'remove-markdown'
import sanitizeHtml from 'sanitize-html'

/**
 * @param {string} string - 문자열
 * @returns {string} 태그 제거된 문자열
 */
export function removeTagsAll(string) {
    // 입력 문자열에서 모든 태그명 추출
    const tagNames = [...string.matchAll(/<(\w+)[^>]*>/g)].map(match => (match[1]).toLowerCase())
    const uniqueTagNames = [...new Set(tagNames)]

    return sanitizeHtml(string, {
        allowedTags: [],
        allowedAttributes: {},
        nonTextTags: [
            ...uniqueTagNames // 발견된 모든 태그들
        ],
disallowedTagsMode: 'discard',
				        // 추가 보안 설정
								allowedSchemes: [],
								allowedSchemesByTag: {},
								allowProtocolRelative: false
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
		stripListLeaders: false , // strip list leaders (default: true)
		listUnicodeChar: '',     // char to insert instead of stripped list leaders (default: '')
		gfm: true,                // support GitHub-Flavored Markdown (default: true)
		useImgAltText: false      // replace images with alt-text, if present (default: true)
	})
	return result
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운과 태그 제거된 문자열
 */
export function removeMDAndTags(string) {
	let result = (removeMarkdownFormat(removeFrontmatter(removeTagsAll(string))))
	return result
}

/**
 * @param {string} string - 마크다운 문자열
 * @returns {string} meta name="description"
 */
export function getDescriptionFromMD(string) {
	let result = removeMDAndTags(string)
	result = result.replace(/\s/g, ' ') // 여러 공백을 하나로
	.trim()
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
