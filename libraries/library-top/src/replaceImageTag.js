/* eslint-disable no-secrets/no-secrets */

const OPEN_TAG_RE = /<\s*cloudinaryimage\b/gi
const CLOSE_TAG_RE = /<\/\s*cloudinaryimage\s*>/gi
const ATTR_SRC_REGEX = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/
const ATTR_ALT_REGEX = /\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/

export function replaceImageTag(markdownText) {
	/**
	 * Replace <Cloudinaryimage ...> tags with Markdown image syntax ![alt](src)
	 * - Supports paired and self-closing tags
	 * - Case-insensitive tag name match
	 * - If src is missing, leaves the original tag unchanged
	 * @param {string} markdownText
	 * @returns {string}
	 */
	if (typeof markdownText !== 'string') return markdownText

	let resultParts = []
	let cursor = 0
	const openRe = new RegExp(OPEN_TAG_RE.source, OPEN_TAG_RE.flags)
	const closeRe = new RegExp(CLOSE_TAG_RE.source, CLOSE_TAG_RE.flags)

	let openMatch
	while ((openMatch = openRe.exec(markdownText)) !== null) {
		const start = openMatch.index
		// Find end of opening tag '>' (simple scan)
		let pos = start
		let endOfOpen = markdownText.indexOf('>', pos)
		if (endOfOpen === -1) break

		const openTagText = markdownText.slice(start, endOfOpen + 1)
		const isSelfClosing = /\/\s*>$/.test(openTagText)
		// Extract attributes text without using regex replace (to satisfy linter rule)
		const lowerOpen = openTagText.toLowerCase()
		const nameIndex = lowerOpen.indexOf('cloudinaryimage')
		let attributesText = ''
		if (nameIndex !== -1) {
			const afterNameIndex = nameIndex + 'cloudinaryimage'.length
			attributesText = openTagText.slice(afterNameIndex, -1) // drop closing '>'
			// trim and remove trailing '/'
			attributesText = attributesText.trim()
			if (attributesText.endsWith('/')) {
				attributesText = attributesText.slice(0, -1).trim()
			}
		}

		const sourceMatch = ATTR_SRC_REGEX.exec(attributesText)
		if (!sourceMatch) {
			openRe.lastIndex = endOfOpen + 1
			continue
		}
		const altMatch = ATTR_ALT_REGEX.exec(attributesText)
		const source = sourceMatch[1] || sourceMatch[2] || ''
		const alt = (altMatch && (altMatch[1] || altMatch[2])) || ''
		const replacement = `![${alt}](${source})`

		let replaceEnd
		if (isSelfClosing) {
			replaceEnd = endOfOpen + 1
		} else {
			closeRe.lastIndex = endOfOpen + 1
			const closeMatch = closeRe.exec(markdownText)
			if (!closeMatch) {
				// No closing tag found; skip replacing to avoid breaking content
				openRe.lastIndex = endOfOpen + 1
				continue
			}
			replaceEnd = closeMatch.index + closeMatch[0].length
		}

		resultParts.push(markdownText.slice(cursor, start), replacement)
		cursor = replaceEnd
		openRe.lastIndex = replaceEnd
	}

	if (cursor === 0) return markdownText
	resultParts.push(markdownText.slice(cursor))
	return resultParts.join('')
}

// console.log(replaceImageTag(`# 마크다운 테스트 문서

// 	[다른 포스트](/posts/second-post)로 이동하는 링크를 만들 수 있습니다.

// 	<Cloudinaryimage alt="테스트 이미지" width="680" height="590" src="https://res.cloudinary.com/dykp9yauv/image/upload/v1753871059/justWalkOut_knb7po.jpg"></Cloudinaryimage>

// 	여기에 각주[^1]가 있습니다.

// 	[^1]: 이것은 각주의 내용입니다.`))
