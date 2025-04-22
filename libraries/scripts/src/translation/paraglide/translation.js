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

const messageFolderPath = getAbsolutePath('../../../../paraglide/messages/', import.meta.url)
const helperFolderPath = getAbsolutePath('../../../../paraglide/messages-helpers/', import.meta.url)
const dictFolderPath = getAbsolutePath('../../../../paraglide/messages-helpers/dicts/', import.meta.url)

export async function getFiles() {
	const languageMessageMap = getInitialLanguageMap()

	const messageFiles = await readFilesToObjects(messageFolderPath)
	const helperFiles = await readFilesToObjects(helperFolderPath)
	const dictFiles = await readFilesToObjects(dictFolderPath)

	for (const language of Object.keys(languageMessageMap)) {
		languageMessageMap[language] = messageFiles[`${language}.json`] ? R.omit(['$schema'], messageFiles[`${language}.json`]) : {}
	}

	const explanations = R.omit(['$schema'], helperFiles['explanations.json']) || {}
	const cache = helperFiles['cache.json'] || {}

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

export async function getTranslatedLanguageMap (languageMessageMap, explanations, dictPerLanguage, combinedMessages_cached, getTranslatedMessages) {

	// 순수 함수: 초기 상태 계산
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

	// 다른 언어들 번역 실행 (액션)
	const translatedLanguageMap = {}
	for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {
		// 이미 영어 번역 결과를 가지고 있다면, 다시 번역할 필요 없음
		if (language === 'en' && englishMessageObject_translated) {
			translatedLanguageMap[language] = englishMessageObject_translated;
			continue;
		}
		translatedLanguageMap[language] = await translateOneLanguageMessages(language, languageMessage, dictPerLanguage[language], combinedMessages_latest_withEn, getTranslatedMessages)
	}

	// 영어 번역이 실패했거나 없었을 경우, 결과 맵에 포함되지 않으므로 추가 확인/처리 필요 시 여기에 로직 추가

	return translatedLanguageMap
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
		await writeFile_async(path.join(messageFolderPath, `${language}.json`), JSON.stringify(languageMessage.newMessages, undefined, 2))

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