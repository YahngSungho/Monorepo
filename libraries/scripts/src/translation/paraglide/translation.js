import { generateKeyNumberFunctions } from '@library/helpers/helper-functions'
import { create } from '@library/helpers/mutative'
import { R } from '@library/helpers/R'


// // dummy function for test
// export async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages) {
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
	const messages_ko = messageMap.ko || {}

	// combinedMessages_latest 계산 (순수)
	const combinedMessages_latest = R.mapObjIndexed(
		(value, key) => ({
			ko: value,
			...(explanations[key] && { explanation: explanations[key] }),
		}),
		messages_ko,
	)

	// 초기 targetLanguageMap 계산 (순수) - ko 제외
	const initialTargetLanguageMap = R.pipe(
		R.omit(['ko']),
		R.mapObjIndexed((value) => ({
			value,
			missingMessageKeys: [], // 초기화
		})),
	)(messageMap)

	// missingMessageKeys 계산 (순수, 불변성 유지)
	const finalTargetLanguageMap = create(initialTargetLanguageMap, draft => {
		for (const [messageKey, combinedMessage] of Object.entries(combinedMessages_latest)) {
			const isMessageChanged = JSON.stringify(combinedMessage) !== JSON.stringify(combinedMessages_cached[messageKey]);

			for (const language of Object.keys(draft)) {
				const languageMessage = draft[language]
				// 메시지가 변경되었거나 해당 언어에 메시지 자체가 없는 경우
				if (isMessageChanged || !languageMessage.value[messageKey]) {
					languageMessage.missingMessageKeys.push(messageKey)
				}
				console.log('💬 calculateInitialTranslationState languageMessage:', languageMessage)
			}
		}
		// 중복 제거
		for (const langData of Object.values(draft)) {
			langData.missingMessageKeys = R.uniq(langData.missingMessageKeys)
		}
	})


	return { combinedMessages_latest, targetLanguageMap: finalTargetLanguageMap }
}

/**
 * 번역된 영어 메시지를 최신 결합 메시지에 통합하는 순수 함수입니다.
 * @param {object} combinedMessages_latest - 최신 결합 메시지 (영어 번역 전)
 * @param {object} englishMessageObject_translated - 번역된 영어 메시지 객체 ('translateOneLanguageMessages'의 결과)
 * @returns {object} - 영어 번역이 통합된 새로운 결합 메시지 객체
 */
export function combineEnglishTranslation(combinedMessages_latest, englishMessageObject_translated) {
	return R.mapObjIndexed(
		(value, messageKey) => ({
			// 영어 번역 결과에서 newMessages 사용
			en: englishMessageObject_translated.newMessages[messageKey],
			...value, // 기존 'ko', 'explanation' 등 포함
		}),
		combinedMessages_latest,
	)
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

/**
 * 번역 요청에 필요한 페이로드와 키 매핑을 준비하는 순수 함수입니다.
 * @param {object} languageMessageObject - 특정 언어의 메시지 정보 객체
 * @param {object} combinedMessages_latest - 최신 결합 메시지 객체
 * @returns {{ combinedMessages_target_numbers: object, restoreFromNumberKeys: function, olderMessages: object }} - 번호가 매겨진 번역 대상 메시지와 restoreFromNumberKeys 함수
 */
export function prepareTranslationPayload(languageMessageObject, combinedMessages_latest) {
	const combinedMessages_target = {};
	for (const messageKey of languageMessageObject.missingMessageKeys) {
		combinedMessages_target[messageKey] = combinedMessages_latest[messageKey];
	}

	const { convertToNumberKeys, restoreFromNumberKeys } = generateKeyNumberFunctions(combinedMessages_target);

	const olderMessages = []
	for (const olderMessage of Object.values(R.omit(languageMessageObject.missingMessageKeys, languageMessageObject.value))) {
		olderMessages.push(olderMessage)
	}

	return {
		combinedMessages_target_numbers: convertToNumberKeys(combinedMessages_target),
		restoreFromNumberKeys,
		olderMessages,
	};
}

/**
 * 번역된 메시지를 기존 언어 메시지 객체와 통합하는 순수 함수입니다.
 * @param {object} languageMessageObject - 원본 언어 메시지 정보 객체
 * @param {object} translatedMessages_numbers - 번호 키로 매핑된 번역된 메시지 객체
 * @param {function} restoreFromNumberKeys - 번호 키를 원래 메시지 키로 변환하는 함수
 * @returns {object} - 번역된 메시지가 통합된 새로운 언어 메시지 정보 객체
 */
export function integrateTranslatedMessages(languageMessageObject, translatedMessages_numbers, restoreFromNumberKeys) {
	// 결과 매핑: 번호 키를 원래 메시지 키로 변환
	const translatedMessages = restoreFromNumberKeys(translatedMessages_numbers);

	// mutative를 사용하여 불변성을 유지하며 새 메시지 객체 생성
	const newMessages = create(languageMessageObject.value, draft => {
		for (const [messageKey, message] of Object.entries(translatedMessages)) {
			draft[messageKey] = message;
		}
	});

	// mutative를 사용하여 불변성을 유지하며 최종 결과 객체 생성
	return create(languageMessageObject, draft => {
		draft.translatedMessages = translatedMessages;
		draft.newMessages = newMessages;
	});
}

/**
 * 특정 언어에 대한 메시지를 번역하고 결과를 통합하는 비동기 함수입니다.
 * @param {string} language - 대상 언어 코드
 * @param {object} languageMessageObject - 해당 언어의 메시지 정보 객체
 * @param {object} combinedMessages_latest - 최신 결합 메시지 객체
 * @param {function} getTranslatedMessages - 메시지 번역을 수행하는 비동기 함수
 * @returns {Promise<object>} - 번역 결과가 포함된 업데이트된 언어 메시지 정보 객체
 */
export async function translateOneLanguageMessages (language, languageMessageObject, dictionary, combinedMessages_latest, getTranslatedMessages) {
	// 순수 함수: 번역 요청 페이로드 준비
	const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } = prepareTranslationPayload(
		languageMessageObject,
		combinedMessages_latest,
	);

	// 비동기 호출: 번역 실행
	const translatedMessages_numbers = await getTranslatedMessages(language, combinedMessages_target_numbers, olderMessages, dictionary);

	// 순수 함수: 번역된 메시지를 기존 객체와 통합 (결과 매핑 포함)
	return integrateTranslatedMessages(languageMessageObject, translatedMessages_numbers, restoreFromNumberKeys);
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
