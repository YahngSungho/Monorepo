/*
파일 구조:
각 프로젝트별 src/translation 폴더에 스크립트 파일(js), 용어사전, Cache 저장
각 text들은 src의 하위 폴더들 중에 적절한 곳에 폴더 단위로 존재
하나의 폴더에 ko, en을 포함한 언어별 + explanation까지 마크다운 파일
*/

import { R } from '@library/helpers/R'

import {
	calculateInitialTranslationStateByBaseLanguages,
	translateOneLanguageMessages,
} from '../helpers.js'

export function convertMarkdownFiles(initialMarkdownFiles, initialLanguageMessageMap) {
	const languageMessageMap = { ...initialLanguageMessageMap }

const explanations = {}
for (const fileObject of initialMarkdownFiles) {
	const { path, value } = fileObject
	const pathArray = path.split('/')
	const fileName = R.last(pathArray)
	if (!fileName.endsWith('.md')) {
		continue
	}
	const lang = fileName.match(/^(.*)\.md$/)[1]
	const fileKey = R.init(pathArray).join('/')

	if (languageMessageMap[lang]) {
		languageMessageMap[lang][fileKey] = value
	}
	if (lang === 'explanation') {
		explanations[fileKey] = value
	}
}
	return { languageMessageMap, explanations }
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

// const initialLanguageMessageMap_forTest = {
// 	en: {},
// 	ko: {},
// 	fr: {},
// 	de: {},
// }

// const { languageMessageMap: languageMessageMap_forTest, explanations: explanations_forTest } = convertMarkdownFiles(initialMarkdownFiles_forTest, initialLanguageMessageMap_forTest)
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

/**
 * 초기 번역 상태(대상 언어 맵, 최신 결합 메시지, 누락 키 목록)를 계산하는 순수 함수입니다.
 *
 * @param {object} messageMap - 언어별 메시지 맵
 * @param {object} explanations - 메시지 설명 객체
 * @param {object} combinedMessages_cached - 캐시된 결합 메시지 객체
 * @returns {{ combinedMessages_latest: object; targetLanguageMap: object }} - 계산된 최신 결합 메시지와 대상 언어
 *   맵(누락 키 포함)
 */
export function calculateInitialTranslationState(
	messageMap,
	explanations,
	combinedMessages_cached,
) {
	const { combinedMessages_latest, targetLanguageMap } =
		calculateInitialTranslationStateByBaseLanguages(
			['ko', 'en'],
			messageMap,
			explanations,
			combinedMessages_cached,
		)

	return { combinedMessages_latest, targetLanguageMap }
}

export async function getTranslatedLanguageMap(
	messageMap,
	explanations,
	dictPerLanguage,
	combinedMessages_cached,
	getTranslatedMessages,
) {
	// 순수 함수: 초기 상태 계산
	const { combinedMessages_latest, targetLanguageMap } = calculateInitialTranslationState(
		messageMap,
		explanations,
		combinedMessages_cached,
	)

	// 다른 언어들 번역 실행 (액션)
	const translatedLanguageMap = {}
	for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {
		// 이미 영어 번역 결과를 가지고 있다면, 다시 번역할 필요 없음

		translatedLanguageMap[language] = await translateOneLanguageMessages(
			language,
			languageMessage,
			dictPerLanguage[language],
			combinedMessages_latest,
			getTranslatedMessages,
		)
	}

	// 영어 번역이 실패했거나 없었을 경우, 결과 맵에 포함되지 않으므로 추가 확인/처리 필요 시 여기에 로직 추가

	return translatedLanguageMap
}

// dummy function for test
export async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages, dictionary) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return translatedMessages
}

// const dictPerLanguage_forTest = {
// 		en: {
// 			open: 'Open',
// 		}
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