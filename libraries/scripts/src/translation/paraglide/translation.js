/*
파일 구조:
messages에 ko, en을 포함한 언어들의 JSON 파일들
message-helpers에 cache / explanations 다 JSON 파일들
message-helpers/dict에 언어별 용어 사전 JSON 파일들
*/

import path from 'node:path'

import { readFilesToObjects, writeFile_async } from '@library/helpers/fs-async'
import { getAbsolutePath } from '@library/helpers/fs-sync'
import { R } from '@library/helpers/R'

import { calculateInitialTranslationStateByBaseLanguages, combineEnglishTranslation, getInitialLanguageMap,getNewCache,translateOneLanguageMessages } from '../helpers.js'

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

const messageFolderPath = getAbsolutePath(import.meta.url, '../../../../paraglide/messages/')
const helperFolderPath = getAbsolutePath(import.meta.url, '../../../../paraglide/messages-helpers/')
const dictFolderPath = getAbsolutePath(import.meta.url, '../../../../paraglide/messages-helpers/dicts/')

export async function getFiles() {
	const languageMessageMap = getInitialLanguageMap()

	const messageFiles = await readFilesToObjects(messageFolderPath)
	const helperFiles = await readFilesToObjects(helperFolderPath)
	const dictFiles = await readFilesToObjects(dictFolderPath)

	for (const language of Object.keys(languageMessageMap)) {
		console.log('💬 getFiles language:', language)
		languageMessageMap[language] = messageFiles[`${language}.json`] ? R.omit(['$schema'])(messageFiles[`${language}.json`]) : {}
	}

	const explanations = R.omit(['$schema'])(helperFiles['explanations.json']) || {}
	const cache = R.omit(['$schema'])(helperFiles['cache.json']) || {}

	const dictPerLanguage = {}
	for (const language of Object.keys(languageMessageMap)) {
		dictPerLanguage[language] = dictFiles[`${language}.json`] || {}
	}

	return { languageMessageMap, dictPerLanguage, explanations, cache }
}

// const dictPerLanguage_forTest = {
// 	en: {
// 		open: 'Open',
// 	}
// }
// const messageMap_forTest = {
// 	en: {
// 	open: 'Open',
// 	},
// 	ko: {
// 		hello_world: '안녕하세요',
// 		open: '열기',
// 		close: '닫기',
// 	},
// 	fr: {
// 		hello_world: 'Bonjour, le monde!',
// 	},
// 	de: {
// 		open: 'Öffnen',
// 	},
// }

// const explanations_forTest = {
// 		hello_world: 'This is a test message',
// 		open: 'This is a test message',
// 		close: 'This is a test message',
// 	}

// const combinedMessages_cached_forTest = {
// 		hello_world: {
// 			ko: '안녕하세요',
// 			explanation: 'This is a test message',
// 		},
// 		open: {
// 			ko: '열기',
// 			explanation: 'This is a test message',
// 		},
// 	}

export async function getTranslatedLanguageMap (languageMessageMap, explanations, dictPerLanguage, combinedMessages_cached, getTranslatedMessages) { // 순수 함수: 초기 상태 계산
const { combinedMessages_latest, targetLanguageMap } = calculateInitialTranslationStateByBaseLanguages(['ko'], languageMessageMap, explanations, combinedMessages_cached)

	// 영어 번역 실행 (액션)
	const englishMessageObject = targetLanguageMap.en;
	if (!englishMessageObject) {
		throw new Error("English ('en') messages not found in messageMap. Skipping English pre-translation.");
	}

	const englishMessageObject_translated = await translateOneLanguageMessages('en', englishMessageObject, dictPerLanguage.en, combinedMessages_latest, getTranslatedMessages)
	// 순수 함수: 영어 번역 결과를 combinedMessages에 통합
	// englishMessageObject_translated가 null일 경우 combinedMessages_latest를 그대로 사용
	const combinedMessages_latest_withEn = combineEnglishTranslation(combinedMessages_latest, englishMessageObject_translated)

	return await R.mapObjectParallel(async (languageMessage, language) => {
				if (language === 'en') {
					return englishMessageObject_translated
				}

				return await translateOneLanguageMessages(
					language,
					languageMessage,
					dictPerLanguage[language],
					combinedMessages_latest_withEn,
					getTranslatedMessages,
				)
			})(targetLanguageMap)
}

// const result = await getTranslatedLanguageMap(messageMap_forTest, explanations_forTest, dictPerLanguage_forTest, combinedMessages_cached_forTest, getTranslatedMessages_forTest)
// [
//   '💬 result:', {
//     en: {
//       value: { open: 'Open' },
//       missingMessageKeys: [ 'hello_world', 'close' ],
//       translatedMessages: { hello_world: '번역된 메시지', close: '번역된 메시지' },
//       newMessages: { open: 'Open', hello_world: '번역된 메시지', close: '번역된 메시지' }
//     },
// 			newDictionary: {
// 				en: {
// 					open: 'Open',
// 				}
// 			},
//     fr: {
//       value: { hello_world: 'Bonjour, le monde!' },
//       missingMessageKeys: [ 'open', 'close' ],
//       translatedMessages: { open: '번역된 메시지', close: '번역된 메시지' },
//       newMessages: {
//         hello_world: 'Bonjour, le monde!',
//         open: '번역된 메시지',
//         close: '번역된 메시지'
//       }
// 			newDictionary: {
// 				fr: {
// 				}
// 			},
//     },
//     de: {
//       value: { open: 'Öffnen' },
//       missingMessageKeys: [ 'hello_world', 'close' ],
//       translatedMessages: { hello_world: '번역된 메시지', close: '번역된 메시지' },
//       newMessages: { open: 'Öffnen', hello_world: '번역된 메시지', close: '번역된 메시지' }
//       newDictionary: {
// 				de: {
// 				}
// 			},
//     }
//   }
// ]

export async function saveFiles (translatedLanguageMap, explanations, languageMessageMap_ko) {
	for await (const [language, languageMessage] of Object.entries(translatedLanguageMap)) {
		if (languageMessage.missingMessageKeys.length === 0) {
			continue
		}

		await writeFile_async(path.join(messageFolderPath, `${language}.json`), JSON.stringify({
			"$schema": "https://inlang.com/schema/inlang-message-format",
			...languageMessage.newMessages,
		}, undefined, 2))

		await writeFile_async(path.join(dictFolderPath, `${language}.json`), JSON.stringify(languageMessage.newDictionary, undefined, 2))
	}

	const newCache = getNewCache({ ko: languageMessageMap_ko }, explanations)
	await writeFile_async(path.join(helperFolderPath, 'cache.json'), JSON.stringify(newCache, undefined, 2))
}

// const { languageMessageMap, dictPerLanguage, explanations, cache } = await getFiles()
// const result = await getTranslatedLanguageMap(languageMessageMap, explanations, dictPerLanguage, {
// 	deft_east_mouse_hope: {
// 		ko: '안녕하세요',
// 		explanation: 'Hello', }
// }, getTranslatedMessages_forTest)
// await saveFiles(result, explanations, languageMessageMap.ko)