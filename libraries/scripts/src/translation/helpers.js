import fs from 'node:fs'

import { getAbsolutePath } from '@library/helpers/fs-sync'
import { generateKeyNumberFunctions } from '@library/helpers/helper-functions'
import { create } from '@library/helpers/mutative'
import { R } from '@library/helpers/R'

export function getInitialLanguageMap () {
	const settingPath = getAbsolutePath(import.meta.url, '../../../paraglide/project.inlang/settings.json')
	const settings = JSON.parse(fs.readFileSync(settingPath, 'utf8'))

	const result = {}
	for (const language of settings.locales) {
		result[language] = {}
	}
	return result
}

export function calculateInitialTranslationStateByBaseLanguages(
	baseLanguages,
	messageMap,
	explanations,
	combinedMessages_cached,
) {
	if (Object.keys(messageMap).length === 0) {
		return { combinedMessages_latest: {}, targetLanguageMap: {} }
	}
	const messages_baseLanguages = R.pick(baseLanguages)(messageMap)

	// combinedMessages_latest 계산 (순수)
	const combinedMessages_latest = {}
	for (const messageKey of Object.keys(messages_baseLanguages[baseLanguages[0]])) {
		combinedMessages_latest[messageKey] = {}
		for (const lang of baseLanguages) {
			combinedMessages_latest[messageKey][lang] = messages_baseLanguages[lang][messageKey]
		}
		if (explanations[messageKey]) {
			combinedMessages_latest[messageKey].explanation = explanations[messageKey]
		}
	}


	// 초기 targetLanguageMap 계산 (순수) - ko 제외
	const initialTargetLanguageMap = R.pipe(
		messageMap,
		R.omit(baseLanguages),
		R.mapObjIndexed((value) => ({
			value,
			missingMessageKeys: [], // 초기화
		})),
	)

	// missingMessageKeys 계산 (순수, 불변성 유지)
	const finalTargetLanguageMap = create(initialTargetLanguageMap, (draft) => {
		for (const [messageKey, combinedMessage] of Object.entries(combinedMessages_latest)) {
			const isMessageChanged = !(R.equals(combinedMessage)(combinedMessages_cached[messageKey]))

			for (const language of Object.keys(draft)) {
				const languageMessage = draft[language]
				// 메시지가 변경되었거나 해당 언어에 메시지 자체가 없는 경우
				if (isMessageChanged || !languageMessage.value[messageKey]) {
					languageMessage.missingMessageKeys.push(messageKey)
				}
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
		}))(combinedMessages_latest)
}


/**
 * 번역 요청에 필요한 페이로드와 키 매핑을 준비하는 순수 함수입니다.
 *
 * @param {object} languageMessageObject - 특정 언어의 메시지 정보 객체
 * @param {object} combinedMessages_latest - 최신 결합 메시지 객체
 * @returns {{
 * 	combinedMessages_target_numbers: object
 * 	restoreFromNumberKeys: function
 * 	olderMessages: object
 * }}
 *   - 번호가 매겨진 번역 대상 메시지와 restoreFromNumberKeys 함수
 */
export function prepareTranslationPayload(languageMessageObject, combinedMessages_latest) {
	const combinedMessages_target = {}
	for (const messageKey of languageMessageObject.missingMessageKeys) {
		combinedMessages_target[messageKey] = combinedMessages_latest[messageKey]
	}

	const { convertToNumberKeys, restoreFromNumberKeys } =
		generateKeyNumberFunctions(combinedMessages_target)

	const olderMessages = []
	for (const olderMessage of R.take(20)(Object.values(
		R.omit(languageMessageObject.missingMessageKeys)(languageMessageObject.value),
	))) {
		olderMessages.push(olderMessage)
	}

	return {
		combinedMessages_target_numbers: convertToNumberKeys(combinedMessages_target),
		restoreFromNumberKeys,
		olderMessages,
	}
}

/**
 * 번역된 메시지를 기존 언어 메시지 객체와 통합하는 순수 함수입니다.
 *
 * @param {object} languageMessageObject - 원본 언어 메시지 정보 객체
 * @param {object} translatedMessages_numbers - 번호 키로 매핑된 번역된 메시지 객체
 * @param {function} restoreFromNumberKeys - 번호 키를 원래 메시지 키로 변환하는 함수
 * @returns {object} - 번역된 메시지가 통합된 새로운 언어 메시지 정보 객체
 */
export function integrateTranslatedMessages(
	languageMessageObject,
	translatedMessages_numbers,
	restoreFromNumberKeys,
) {
	// 결과 매핑: 번호 키를 원래 메시지 키로 변환
	const translatedMessages = restoreFromNumberKeys(translatedMessages_numbers)

	// mutative를 사용하여 불변성을 유지하며 새 메시지 객체 생성
	const newMessages = create(languageMessageObject.value, (draft) => {
		for (const [messageKey, message] of Object.entries(translatedMessages)) {
			draft[messageKey] = message
		}
	})

	// mutative를 사용하여 불변성을 유지하며 최종 결과 객체 생성
	return create(languageMessageObject, (draft) => {
		draft.translatedMessages = translatedMessages
		draft.newMessages = newMessages
	})
}

/**
 * 특정 언어에 대한 메시지를 번역하고 결과를 통합하는 비동기 함수입니다.
 *
 * @param {string} language - 대상 언어 코드
 * @param {object} languageMessageObject - 해당 언어의 메시지 정보 객체
 * @param {object} combinedMessages_latest - 최신 결합 메시지 객체
 * @param {object} dictionary - 번역 사전 객체
 * @param {function} getTranslatedMessages - 메시지 번역을 수행하는 비동기 함수
 * @returns {Promise<object>} - 번역 결과가 포함된 업데이트된 언어 메시지 정보 객체
 */
export async function translateOneLanguageMessages(
	language,
	languageMessageObject,
	dictionary,
	combinedMessages_latest,
	getTranslatedMessages,
) {
	if (languageMessageObject.missingMessageKeys.length === 0) {
		return languageMessageObject
	}

	// 순수 함수: 번역 요청 페이로드 준비
	const { combinedMessages_target_numbers, restoreFromNumberKeys, olderMessages } =
	prepareTranslationPayload(languageMessageObject, combinedMessages_latest)
	// 비동기 호출: 번역 실행
	const {translatedMessages: translatedMessages_numbers, newDictionary} = await getTranslatedMessages(
		language,
		combinedMessages_target_numbers,
		olderMessages,
		dictionary,
	)
	// 순수 함수: 번역된 메시지를 기존 객체와 통합 (결과 매핑 포함)
	return {
		...(integrateTranslatedMessages(
		languageMessageObject,
		translatedMessages_numbers,
		restoreFromNumberKeys,
	)),
		newDictionary: {
			...dictionary,
			...newDictionary,
		}
	}
}

export function getNewCache (languageMessageMaps, explanations) {
	const newCache = {}
	for (const [ language, languageMessageMap ] of Object.entries(languageMessageMaps)) {
		for (const [ messageKey, messageValue ] of Object.entries(languageMessageMap)) {
			if (newCache[messageKey]) {
				newCache[messageKey][language] = messageValue
			} else {
				newCache[messageKey] = {
					[language]: messageValue,
				}
			}
	}
}

	for (const messageKey of Object.keys(newCache)) {
		if (explanations[messageKey]) {
			newCache[messageKey].explanation = explanations[messageKey]
		}
	}

	return newCache
}