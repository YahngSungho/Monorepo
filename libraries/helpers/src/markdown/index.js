export * from './getFrontmatters.js'

import { R } from '@library/helpers/R'
import removeMD from 'remove-markdown'
import sanitizeHtml from 'sanitize-html'

/**
 * @param {string} string - 문자열
 * @returns {string} 태그 제거된 문자열
 */
export function removeFrontmatter(string) {
	return string.trim().replace(/^---.*?---/s, '')
}

export function removeTagsAll(string) {
	// 입력 문자열에서 모든 태그명 추출 (정규식은 태그명만 가볍게 매칭)
	const rawMatches = string.matchAll(/<\/?([a-z][\d:a-z-]*)\b/gi)
	const tagNames = []
	for (const match of rawMatches) {
		const startIndex = match.index ?? 0
		const gtIndex = string.indexOf('>', startIndex)
		// 다음 '<'가 나오기 전에 '>'가 존재해야 올바른 태그로 판단
		if (gtIndex !== -1) {
			const nextLtIndex = string.indexOf('<', startIndex + 1)
			if (nextLtIndex === -1 || gtIndex < nextLtIndex) {
				tagNames.push(match[1].toLowerCase())
			}
		}
	}
	const uniqueTagNames = Array.from(new Set(tagNames))

	return sanitizeHtml(string, {
		allowedAttributes: {},
		allowedTags: [],
		disallowedTagsMode: 'discard',
		nonTextTags: uniqueTagNames,
		// 추가 보안 설정
		allowedSchemes: [],
		allowedSchemesByTag: {},
		allowProtocolRelative: false,
	})
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운 제거된 문자열
 */
export function removeMarkdownFormat(string) {
	let result = removeMD(string, {
		gfm: true, // support GitHub-Flavored Markdown (default: true)
		listUnicodeChar: '', // char to insert instead of stripped list leaders (default: '')
		stripListLeaders: false, // strip list leaders (default: true)
		useImgAltText: false, // replace images with alt-text, if present (default: true)
	})
	return result
}

/**
 * @param {string} string - 문자열
 * @returns {string} 마크다운과 태그 제거된 문자열
 */
export function removeMDAndTags(string) {
	return (
		removeMarkdownFormat(removeTagsAll(removeFrontmatter(string)))
			.trim()
			// eslint-disable-next-line regexp/no-unused-capturing-group
			.replaceAll(/(\r?\n){2,}/g, '\n')
	)
}

/**
 * @param {string} string - 마크다운 문자열
 * @returns {string} meta name="description"
 */
export function getDescriptionFromMD(string) {
	const result = R.applyPipe(
		string,
		// eslint-disable-next-line
		R.replace(/^#+ (.+) \{#.+\}$/gm, '<$1>'),
		removeMDAndTags,
		// eslint-disable-next-line
		R.replace(/\s/g, ' '), // 여러 공백을 하나로
		R.trim,
		R.slice(0, 300),
		(string) => `${string}...`,
	)

	return result
}
