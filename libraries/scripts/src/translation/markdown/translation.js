/*
파일 구조:
각 프로젝트별 src/translation 폴더에 스크립트 파일(js), Cache 저장
각 text들은 src의 하위 폴더들 중에 적절한 곳에 폴더 단위로 존재
하나의 폴더에 ko, en을 포함한 언어별 + explanation까지 마크다운 파일
dicts는 각 프로젝트별이 아니라 paraglide/messages-helpers/dicts 폴더에 저장

Blog의 경우 article에 대한 폴더에 title, tags 폴더도 추가
- article
  - ko.md
  - en.md
  - title
    - ko.md
    - en.md
	- tags
    - ko.md
    - en.md
*/

import path from 'node:path'

import { readFilesToObjects, readFilesToStrings_recursive, writeFile_async } from '@library/helpers/fs-async'
import { getAbsolutePath } from '@library/helpers/fs-sync'
import { R } from '@library/helpers/R'

import {
	calculateInitialTranslationStateByBaseLanguages,
	getInitialLanguageMap,
	getNewCache,
	translateOneLanguageMessages,
} from '../helpers.js'


// dummy function for test
// export async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages, dictionary) {
// 	const translatedMessages = {}
// 	for (const messageKey of Object.keys(combinedMessages)) {
// 		translatedMessages[messageKey] = '번역된 메시지'
// 	}
// 	return {
// 		translatedMessages,
// 		newDictionary: {},
// 	}
// }

const dictFolderPath = getAbsolutePath(import.meta.url, '../../../../paraglide/messages-helpers/dicts')

export async function getFiles (rootAbsolutePath, helperFolderPath) {
	const languageMessageMap = getInitialLanguageMap()

	const markdownFiles = await readFilesToStrings_recursive(rootAbsolutePath, '**/*.md')
	const helperFiles = await readFilesToObjects(helperFolderPath)
	const dictFiles = await  readFilesToObjects(dictFolderPath)

	const cache = helperFiles['cache.json'] || {}

	const dictPerLanguage = {}
	for (const language of Object.keys(languageMessageMap)) {
		dictPerLanguage[language] = dictFiles[`${language}.json`] || {}
	}

	return { initialMarkdownFiles: markdownFiles, dictPerLanguage, cache }
}



// const initialMarkdownFiles_forTest = [
// 	{
// 		path: 'src/myFolder/myText/ko.md',
// 		value: '안녕하세요',
// 	},
// 	{
// 		path: 'src/myFolder/myText/en.md',
// 		value: 'Hello, world!',
// 	},
// 	{
// 		path: 'src/myFolder/myText/explanation.md',
// 		value: 'This is a test message',
// 	},
// 	{
// 		path: 'src/myFolder/myText/fr.md',
// 		value: 'Bonjour, le monde!',
// 	},
// 	{
// 		path: 'src/myFolder/myText/de.md',
// 		value: 'Hallo, Welt!',
// 	},
// 	{
// 		path: 'src/myFolder/myText/unknownLanguage.md',
// 		value: 'Unknown language',
// 	},
// 	{
// 		path: 'src/myFolder2/myText/ko.md',
// 		value: '그게 평범하지 않은 거야',
// 	},
// 	{
// 		path: 'src/myFolder2/myText/en.md',
// 		value: 'That is not ordinary',
// 	},
// 	{
// 		path: 'src/myFolder2/myText/explanation.md',
// 		value: 'This is a test message',
// 	},
// ]

// const dictPerLanguage_forTest = {
// 		en: {
// 			open: 'Open',
// 		},
// 		fr: {}
// }

// const combinedMessages_cached_forTest = {
// 		'src/myFolder/myText': {
// 			ko: '안녕하세요',
// 			en: 'Hello, world!',
// 			explanation: 'This is a test message',
// 		},
// 		hello_world: {
// 			ko: '안녕하세요',
// 			en: 'Hello, world!',
// 			explanation: 'This is a test message',
// 		},
// 		open: {
// 			ko: '열기',
// 			en: 'Open',
// 			explanation: 'This is a test message',
// 		},
// 	}

export function convertMarkdownFiles(initialMarkdownFiles, rootAbsolutePath) {
	const initialLanguageMessageMap = getInitialLanguageMap()
	const languageMessageMap = { ...initialLanguageMessageMap }

	const explanations = {}
	for (const fileObject of initialMarkdownFiles) {
		const relativePath = path.relative(rootAbsolutePath, fileObject.path)
		const pathSegments = relativePath.split(path.sep)
		const fileNameWithExt = R.last(pathSegments)
		if (!fileNameWithExt || !fileNameWithExt.endsWith('.md')) {
			continue
		}
		const lang = path.basename(fileNameWithExt, '.md')

		const fileKey = R.init(pathSegments).join('/')

		if (languageMessageMap[lang]) {
			languageMessageMap[lang][fileKey] = fileObject.value
		}
		if (lang === 'explanation') {
			explanations[fileKey] = fileObject.value
		}
	}
	return { languageMessageMap, explanations }
}

// const { languageMessageMap: languageMessageMap_forTest, explanations: explanations_forTest } = convertMarkdownFiles(initialMarkdownFiles_forTest, 'src')
// Return:
// {
//   languageMessageMap: {
//     en: {
//       'src/myFolder/myText': 'Hello, world!',
//       'src/myFolder2/myText': 'That is not ordinary'
//     },
//     ko: {
//       'src/myFolder/myText': '안녕하세요',
//       'src/myFolder2/myText': '그게 평범하지 않은 거야'
//     },
//     fr: { 'src/myFolder/myText': 'Bonjour, le monde!' },
//     de: { 'src/myFolder/myText': 'Hallo, Welt!' }
//   },
//   explanations: {
//     'src/myFolder/myText': 'This is a test message',
//     'src/myFolder2/myText': 'This is a test message'
//   }
// }

export async function getTranslatedLanguageMap(
	messageMap,
	explanations,
	dictPerLanguage,
	combinedMessages_cached,
	getTranslatedMessages,
) {
	// 순수 함수: 초기 상태 계산
	const { combinedMessages_latest, targetLanguageMap } =
		calculateInitialTranslationStateByBaseLanguages(
			['ko', 'en'],
			messageMap,
			explanations,
			combinedMessages_cached,
		)

	// 다른 언어들 번역 실행 (액션)
	const translatedLanguageMap = {}
	for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {
		translatedLanguageMap[language] = await translateOneLanguageMessages(
			language,
			languageMessage,
			dictPerLanguage[language],
			combinedMessages_latest,
			getTranslatedMessages,
		)
	}

	return translatedLanguageMap
}

// const result = await getTranslatedLanguageMap(languageMessageMap_forTest, explanations_forTest, dictPerLanguage_forTest, combinedMessages_cached_forTest, getTranslatedMessages_forTest)
// Return:
// {
//   fr: {
//     value: { 'src/myFolder/myText': 'Bonjour, le monde!' },
//     missingMessageKeys: [ 'src/myFolder2/myText' ],
//     translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
//     newMessages: {
//       'src/myFolder/myText': 'Bonjour, le monde!',
//       'src/myFolder2/myText': '번역된 메시지'
//     }
//   },
//   de: {
//     value: { 'src/myFolder/myText': 'Hallo, Welt!' },
//     missingMessageKeys: [ 'src/myFolder2/myText' ],
//     translatedMessages: { 'src/myFolder2/myText': '번역된 메시지' },
//     newMessages: {
//       'src/myFolder/myText': 'Hallo, Welt!',
//       'src/myFolder2/myText': '번역된 메시지'
//     }
//   }
// }

export async function saveFiles (rootAbsolutePath, helperFolderPath, translatedLanguageMap, explanations, languageMessageMap_ko, languageMessageMap_en) {
	for await (const [language, messageMap] of Object.entries(translatedLanguageMap)) {
		for await (const [ messageKey, messageValue ] of Object.entries(messageMap.newMessages)) {
			const filePath = path.join(rootAbsolutePath, messageKey, `${language}.md`)
			await writeFile_async(filePath, messageValue)
		}

		await writeFile_async(path.join(dictFolderPath, `${language}.json`), JSON.stringify(messageMap.newDictionary, undefined, 2))
	}

	const newCache = getNewCache({ ko: languageMessageMap_ko, en: languageMessageMap_en }, explanations)

	await writeFile_async(path.join(helperFolderPath, 'cache.json'), JSON.stringify(newCache, undefined, 2))
}
