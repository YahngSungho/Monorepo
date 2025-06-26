import { getFiles, getTranslatedLanguageMap, saveFiles } from '@library/scripts/translation-paraglide'
// import { getTranslatedMessages_paraglide } from '@library/scripts/translation-llm'

// dummy function for test
async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages, dictionary) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return {
		translatedMessages,
		newDictionary: {},
	}
}

const { languageMessageMap, dictPerLanguage, explanations, cache } = await getFiles()
const result = await getTranslatedLanguageMap(languageMessageMap, explanations, dictPerLanguage, cache,
	// getTranslatedMessages_paraglide
	getTranslatedMessages_forTest
)
await saveFiles(result, explanations, languageMessageMap.ko)
