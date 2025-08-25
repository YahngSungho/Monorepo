import { R } from '@library/helpers/R'

export const getFrontmatterObject = (messageValue) => {
	const parts = messageValue.trim().split('---')
	if (parts.length < 3) {
		return {} // 유효한 frontmatter 구조가 아님
	}
	const frontmatterContent = parts[1] // '---' 라인 사이의 내용

	// 키-값 쌍 파싱
	const lines = frontmatterContent.trim().split(/\r?\n/)
	const result = {}
	for (const line of lines) {
		const colonIndex = line.indexOf(':')
		if (colonIndex > 0) {
			// Check if key exists and colon is not the first char
			const key = line.slice(0, colonIndex).trim() // Use slice as per user's edit
			const value = line.slice(colonIndex + 1).trim() // Use slice as per user's edit
			if (key && value) {
				// Check if both key and value are non-empty after trim
				result[key] = value
			}
		}
	}
	return result // Return the dynamically parsed object
}

export const getFrontmatterObjectObject = (languageMessageMap) => {
	const result = R.mapObject((messageObject) =>
		R.mapObject(getFrontmatterObject)(messageObject),
	)(languageMessageMap)

	return result
}

// console.log('💬 frontmatterObject:', getFrontmatterObject(languageMessageMap_forTest))
