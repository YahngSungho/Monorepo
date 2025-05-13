import { R } from '@library/helpers/R'

const myPost = `
---
title: 제목
tags: 태그1, 태그2
---

# 제목
내용
`

const titleRegex = /^title: (.*)$/m
const tagsRegex = /^tags: (.*)$/m

const title = titleRegex.exec(myPost)?.[1]
const tags = tagsRegex.exec(myPost)?.[1]

const originalLanguageMap = {
	en: {
		'src/myFolder/myText': `
---
title: title
tags: tag1, tag2
---

# 제목
내용
`,
		'src/myFolder2/myText': 'That is not ordinary',
	},
	ko: {
		'src/myFolder/myText': `
---
title: 제목
tags: 태그1, 태그2
---

# 제목
내용
`,
		'src/myFolder2/myText': '그게 평범하지 않은 거야',
	},
	fr: { 'src/myFolder/myText': 'Bonjour, le monde!' },
	de: { 'src/myFolder/myText': 'Hallo, Welt!' },
}

const translatedLanguageMap = {
	fr: {
		value: { 'src/myFolder/myText': 'Bonjour, le monde!' },
		missingMessageKeys: ['src/myFolder2/myText'],
		translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
		newMessages: {
			'src/myFolder/myText': `
---
title: fr-title
tags: fr-tag1, fr-tag2
---

# 제목
내용
`,
			'src/myFolder2/myText': '번역된 메시지',
		},
	},
	de: {
		value: { 'src/myFolder/myText': 'Hallo, Welt!' },
		missingMessageKeys: ['src/myFolder2/myText'],
		translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
		newMessages: {
			'src/myFolder/myText': `
---
title: de-title
tags: de-tag1, de-tag2
---

# 제목
내용
`,
		},
	},
}

export const getMetaDataObject = (originalLanguageMap, translatedLanguageMap) => {
	const completeLanguageMap = R.pipe(
		{},
		R.merge(R.pick('ko')(originalLanguageMap)),
		R.merge(R.pick('en')(originalLanguageMap)),
		R.merge(R.mapObject((value) => value.newMessages)(translatedLanguageMap)),
	)
	console.log('💬 completeLanguageMap:', completeLanguageMap)

	const metaDataObject = R.mapObject((messageObject) =>
		R.mapObject((messageValue) => {
			const parts = messageValue.trim().split('---')
			if (parts.length < 3) {
				return {} // 유효한 frontmatter 구조가 아님
			}
			const frontmatterContent = parts[1] // '---' 라인 사이의 내용

			// 키-값 쌍 파싱
			const lines = frontmatterContent.trim().split(/\r?\n/)
			const metaData = {}
			for (const line of lines) {
				const colonIndex = line.indexOf(':')
				if (colonIndex > 0) {
					// Check if key exists and colon is not the first char
					const key = line.slice(0, colonIndex).trim() // Use slice as per user's edit
					const value = line.slice(colonIndex + 1).trim() // Use slice as per user's edit
					if (key && value) {
						// Check if both key and value are non-empty after trim
						metaData[key] = value
					}
				}
			}
			return metaData // Return the dynamically parsed object
		})(messageObject),
	)(completeLanguageMap)

	return metaDataObject
}

console.log('💬 metaDataObject:', getMetaDataObject(originalLanguageMap, translatedLanguageMap))
