import { calculateInitialTranslationStateByBaseLanguage, combineEnglishTranslation, translateOneLanguageMessages } from '../helpers.js'


// // dummy function for test
// export async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages, dictionary) {
// 	const translatedMessages = {}
// 	for (const messageKey of Object.keys(combinedMessages)) {
// 		translatedMessages[messageKey] = '번역된 메시지'
// 	}
// 	return translatedMessages
// }

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

/**
 * 초기 번역 상태(대상 언어 맵, 최신 결합 메시지, 누락 키 목록)를 계산하는 순수 함수입니다.
 * @param {object} messageMap - 언어별 메시지 맵
 * @param {object} explanations - 메시지 설명 객체
 * @param {object} combinedMessages_cached - 캐시된 결합 메시지 객체
 * @returns {{combinedMessages_latest: object, targetLanguageMap: object}} - 계산된 최신 결합 메시지와 대상 언어 맵(누락 키 포함)
 */
export function calculateInitialTranslationState(messageMap, explanations, combinedMessages_cached) {

	const { combinedMessages_latest, targetLanguageMap } = calculateInitialTranslationStateByBaseLanguage('ko', messageMap, explanations, combinedMessages_cached)

	return { combinedMessages_latest, targetLanguageMap }
}

export async function getTranslatedLanguageMap (messageMap, explanations, dictPerLanguage, combinedMessages_cached, getTranslatedMessages) {

	// 순수 함수: 초기 상태 계산
	const { combinedMessages_latest, targetLanguageMap } = calculateInitialTranslationState(
		messageMap,
		explanations,
		combinedMessages_cached,
	);

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
//     fr: {
//       value: { hello_world: 'Bonjour, le monde!' },
//       missingMessageKeys: [ 'open', 'close' ],
//       translatedMessages: { open: '번역된 메시지', close: '번역된 메시지' },
//       newMessages: {
//         hello_world: 'Bonjour, le monde!',
//         open: '번역된 메시지',
//         close: '번역된 메시지'
//       }
//     },
//     de: {
//       value: { open: 'Öffnen' },
//       missingMessageKeys: [ 'hello_world', 'close' ],
//       translatedMessages: { hello_world: '번역된 메시지', close: '번역된 메시지' },
//       newMessages: { open: 'Öffnen', hello_world: '번역된 메시지', close: '번역된 메시지' }
//     }
//   }
// ]
