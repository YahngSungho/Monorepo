import { convertMarkdownFiles, getFiles, getTranslatedLanguageMap, saveFiles } from '@library/scripts/translation-markdown'
import { getAbsolutePath } from '@library/helpers/fs-sync'

// dummy function for test
export async function getTranslatedMessages_forTest (language, combinedMessages, olderMessages, dictionary) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return {
		translatedMessages,
		newDictionary: {},
	}
}

const rootPath = getAbsolutePath(import.meta.url, '../')
const helperPath = getAbsolutePath(import.meta.url, './')
const { initialMarkdownFiles, dictPerLanguage, cache  } = await getFiles(rootPath, helperPath)
const { languageMessageMap, explanations } = convertMarkdownFiles(initialMarkdownFiles, rootPath)
const translatedLanguageMap = await getTranslatedLanguageMap(languageMessageMap, explanations, dictPerLanguage, cache, getTranslatedMessages_forTest)
// @ts-ignore
await saveFiles(rootPath, helperPath, translatedLanguageMap, explanations, languageMessageMap.ko, languageMessageMap.en)
