import { create } from '@library/helpers/mutative'


// dummy function for test
export async function getTranslatedMessages_forTest (language, combinedMessages) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return translatedMessages
}

const messageMapForTest = {
	en: {
	open: 'Open',
	},
	ko: {
		hello_world: '안녕하세요',
		open: '열기',
		close: '닫기',
	},
	fr: {
		hello_world: 'Bonjour, le monde!',
	},
	de: {
		open: 'Öffnen',
	},
}

const explanations_forTest = {
		hello_world: 'This is a test message',
		open: 'This is a test message',
		close: 'This is a test message',
	}

const combinedMessages_cached_forTest = {
		hello_world: {
			ko: '안녕하세요',
			explanation: 'This is a test message',
		},
		open: {
			ko: '열기',
			explanation: 'This is a test message',
		},
	}

export async function getTranslatedLanguageMap (messageMap, explanations, combinedMessages_cached, getTranslatedMessages) {

	const messages_ko = messageMap.ko

	const targetLanguageMap = {}
	for (const [ key, value ] of Object.entries(messageMap)) {
		if (key === 'ko') {
			continue
		}

		targetLanguageMap[key] = {
			value,
			missingMessageKeys: [],
		}
	}


	const combinedMessages_latest = {}
	for (const [key, value] of Object.entries(messages_ko)) {
		combinedMessages_latest[key] = {
			ko: value,
		}
		if (explanations[key]) {
			combinedMessages_latest[key].explanation = explanations[key]
		}
	}
	for (const [messageKey, combinedMessage] of Object.entries(combinedMessages_latest)) {
		if (JSON.stringify(combinedMessage) !== JSON.stringify(combinedMessages_cached[messageKey])) {
			for (const language of Object.keys(targetLanguageMap)) {
				targetLanguageMap[language].missingMessageKeys.push(messageKey)
			}
			continue
		}

		for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {


			if (!(languageMessage.value[messageKey])) {
				targetLanguageMap[language].missingMessageKeys.push(messageKey)
			}
		}
	}

	const translatedLanguageMap = {}
	for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {
		translatedLanguageMap[language] = await translateOneLanguageMessages(language, languageMessage, combinedMessages_latest, getTranslatedMessages)
	}

	return translatedLanguageMap
}

async function translateOneLanguageMessages (language, languageMessageObject, combinedMessages_latest, getTranslatedMessages) {
	const combinedMessages_target = {}
		for (const messageKey of languageMessageObject.missingMessageKeys) {
			combinedMessages_target[messageKey] = combinedMessages_latest[messageKey]
		}
		const messageKeysToNumbersMap = {}
		const numbersToMessageKeysMap = {}
		let counter = 0
		const combinedMessages_target_numbers = {}
		for (const messageKey of Object.keys(combinedMessages_target)) {
			messageKeysToNumbersMap[messageKey] = counter
			numbersToMessageKeysMap[counter] = messageKey
			combinedMessages_target_numbers[counter] = combinedMessages_target[messageKey]
			counter += 1
		}
		const translatedMessages_numbers = await getTranslatedMessages(language, combinedMessages_target_numbers)
		const translatedMessages = {}
		for (const [number, messageKey] of Object.entries(numbersToMessageKeysMap)) {
			translatedMessages[messageKey] = translatedMessages_numbers[number]
		}

		const newMessages = create(languageMessageObject.value, draft => {
			for (const [messageKey, message] of Object.entries(translatedMessages)) {
				draft[messageKey] = message
			}
		})

		return create(languageMessageObject, draft => {
			draft.translatedMessages = translatedMessages
			draft.newMessages = newMessages
		})
}

const result = await getTranslatedLanguageMap(messageMapForTest, explanations_forTest, combinedMessages_cached_forTest, getTranslatedMessages_forTest)
console.log('💬 result:', result)
// result:
// {
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
//  }
