import { isSameNormalizedString } from '@library/helpers/functions'
import { R } from '@library/helpers/R'

// import { getTranslatedMessages_markdown } from '../translation/llm.js'
import {
	convertMarkdownFiles,
	getFiles,
	getTranslatedLanguageMap_action,
	saveFiles_action,
} from '../translation/markdown/translation.js'

// dummy function for test
async function getTranslatedMessages_forTest(
	language,
	combinedMessages,
	olderMessages,
	dictionary,
) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지'
	}
	return {
		newDictionary: {},
		translatedMessages,
	}
}

const basicLangs = ['ko', 'en']

export async function markdownScript_action(projectName, rootPath, helperPath) {
	const { cache, dictPerLanguage, initialMarkdownFiles } = await getFiles(rootPath, helperPath)
	const { explanations, languageMessageMap } = convertMarkdownFiles(initialMarkdownFiles, rootPath)
	// Todo: Supabase에서 가져온거 추가
	const translatedLanguageMap = await getTranslatedLanguageMap_action(
		basicLangs,
		languageMessageMap,
		explanations,
		dictPerLanguage,
		cache,
		// getTranslatedMessages_markdown,
		getTranslatedMessages_forTest,
	)

	const languageMessageMap_basicLangs = R.pick(basicLangs)(languageMessageMap)
	const updatedMessagesPerLang = {}
	for (const [lang, messageMap] of Object.entries(languageMessageMap_basicLangs)) {
		updatedMessagesPerLang[lang] = {}
		for (const [messageKey, messageValue] of Object.entries(messageMap)) {
			if (!isSameNormalizedString(messageValue, (cache[messageKey]?.[lang] || ''))) {
				updatedMessagesPerLang[lang][messageKey] = messageValue
			}
		}
	}


	// @ts-ignore
	await saveFiles_action(
		projectName,
		helperPath,
		translatedLanguageMap,
		updatedMessagesPerLang,
		explanations,
		languageMessageMap_basicLangs
	)
}
