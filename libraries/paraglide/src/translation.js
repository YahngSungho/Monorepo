import { create } from '@library/helpers/mutative'


// dummy function for test
export async function getTranslatedMessages_forTest (language, combinedMessages) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return translatedMessages
}

// const messageMapForTest = {
// 	en: {
// 	hello_world: 'Hello, world!',
// 	open: 'Open',
// 	close: 'Close',
// 	},
// 	ko: {
// 		hello_world: '안녕하세요',
// 		open: '열기',
// 		close: '닫기',
// 	},
// 	explanations: {
// 		hello_world: 'This is a test message',
// 		open: 'This is a test message',
// 		close: 'This is a test message',
// 	},
// 	fr: {
// 		hello_world: 'Bonjour, le monde!',
// 	},
// 	de: {
// 		open: 'Öffnen',
// 	},
// }

// const combinedMessages_cached_forTest = {
// 		hello_world: {
// 			en: 'Hello, world!',
// 			ko: '안녕하세요',
// 			explanation: 'This is a test message',
// 		},
// 		open: {
// 			en: 'Open',
// 			ko: '열기',
// 			explanation: 'This is a test message',
// 		},
// 	}

export async function getTranslatedLanguageMap (messageMap, combinedMessages_cached, getTranslatedMessages) {

	const messages_en = messageMap.en
	const messages_ko = messageMap.ko
	const messages_explanations = messageMap.explanations

	const targetLanguageMap = {}
	for (const [ key, value ] of Object.entries(messageMap)) {
		if (key === 'en' || key === 'ko' || key === 'explanations') {
			continue
		}

		targetLanguageMap[key] = {
			value,
			missingMessageKeys: [],
		}
	}


	const combinedMessages_latest = {}
	for (const [key, value] of Object.entries(messages_en)) {
		combinedMessages_latest[key] = {
			en: value,
			ko: messages_ko[key],
			explanation: messages_explanations[key],
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
	for (const [language, languageMessage] of Object.entries(targetLanguageMap)) {
		const combinedMessages_target = {}
		for (const messageKey of languageMessage.missingMessageKeys) {
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
		targetLanguageMap[language].translatedMessages = translatedMessages

		const newMessages = create(targetLanguageMap[language].value, draft => {
			for (const [messageKey, message] of Object.entries(translatedMessages)) {
				draft[messageKey] = message
			}
		})

		targetLanguageMap[language].newMessages = newMessages

	}

	return targetLanguageMap
}

// const result = await getTranslatedLanguageMap(messageMapForTest, combinedMessages_cached_forTest, getTranslatedMessages_forTest)
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
