import { R } from '@library/helpers/R'

// const myPost = `
// ---
// title: 제목
// tags: 태그1, 태그2
// ---

// # 제목
// 내용
// `

// const titleRegex = /^title: (.*)$/m
// const tagsRegex = /^tags: (.*)$/m

// const originalLanguageMap = {
// 	en: {
// 		'src/myFolder/myText': `
// ---
// title: title
// tags: tag1, tag2
// ---

// # 제목
// 내용
// `,
// 		'src/myFolder2/myText': 'That is not ordinary',
// 	},
// 	ko: {
// 		'src/myFolder/myText': `
// ---
// title: 제목
// tags: 태그1, 태그2
// ---

// # 제목
// 내용
// `,
// 		'src/myFolder2/myText': '그게 평범하지 않은 거야',
// 	},
// 	fr: { 'src/myFolder/myText': 'Bonjour, le monde!' },
// 	de: { 'src/myFolder/myText': 'Hallo, Welt!' },
// }

// const translatedLanguageMap = {
// 	fr: {
// 		value: { 'src/myFolder/myText': 'Bonjour, le monde!' },
// 		missingMessageKeys: ['src/myFolder2/myText'],
// 		translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
// 		newMessages: {
// 			'src/myFolder/myText': `
// ---
// title: fr-title
// tags: fr-tag1, fr-tag2
// ---

// # 제목
// 내용
// `,
// 			'src/myFolder2/myText': '번역된 메시지',
// 		},
// 	},
// 	de: {
// 		value: { 'src/myFolder/myText': 'Hallo, Welt!' },
// 		missingMessageKeys: ['src/myFolder2/myText'],
// 		translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
// 		newMessages: {
// 			'src/myFolder/myText': `
// ---
// title: de-title
// tags: de-tag1, de-tag2
// ---

// # 제목
// 내용
// `,
// 		},
// 	},
// }

export const getMetaDataObject = (originalLanguageMap, translatedLanguageMap) => {
	const completeLanguageMap = R.pipe(
		{},
		R.merge(R.pick('ko')(originalLanguageMap || {})),
		R.merge(R.pick('en')(originalLanguageMap || {})),
		R.merge(
			R.mapObject(
				(value) => value?.newMessages || {},
			)(translatedLanguageMap || {}),
		),
	)

	const metaDataObject = R.mapObject((messageObject) =>
		R.mapObject((messageValue) => {
			if (typeof messageValue !== 'string') {
				return {}
			}
			const parts = messageValue.trim().split('---')
			if (parts.length < 3) {
				return {}
			}
			const frontmatterContent = parts[1]

			const lines = frontmatterContent.trim().split(/\r?\n/)
			const metaData = {}
			for (const line of lines) {
				const colonIndex = line.indexOf(':')
				if (colonIndex > 0) {
					const key = line.slice(0, colonIndex).trim()
					const value = line.slice(colonIndex + 1).trim()
					if (key && value) {
						metaData[key] = value
					}
				}
			}
			return metaData
		})(messageObject),
	)(completeLanguageMap)

	return metaDataObject
}

// console.log('💬 metaDataObject:', getMetaDataObject(originalLanguageMap, translatedLanguageMap))
// [
//   '💬 metaDataObject:',
//   {
//     fr: {
//       'src/myFolder/myText': { title: 'fr-title', tags: 'fr-tag1, fr-tag2' },
//       'src/myFolder2/myText': {}
//     },
//     de: {
//       'src/myFolder/myText': { title: 'de-title', tags: 'de-tag1, de-tag2' }
//     },
//     en: {
//       'src/myFolder/myText': { title: 'title', tags: 'tag1, tag2' },
//       'src/myFolder2/myText': {}
//     },
//     ko: {
//       'src/myFolder/myText': { title: '제목', tags: '태그1, 태그2' },
//       'src/myFolder2/myText': {}
//     }
//   }
// ]