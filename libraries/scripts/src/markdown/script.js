import { getMarkdownListByProjectName } from '@library/backends/supabase'
import { isSameNormalizedString } from '@library/helpers/functions'
import { R } from '@library/helpers/R'

// import { getTranslatedMessages_markdown } from '../translation/llm.js'
import {
	convertMarkdownFiles,
	getFiles,
	getTranslatedLanguageMap_action,
} from '../translation/markdown/translation.js'
import { saveFiles_action } from './saveFiles.js'

export { fixMarkdownText_action } from './fixMarkdownText.js'

// dummy function for test
async function getTranslatedMessages_forTest(
	language,
	combinedMessages,
	olderMessages,
	dictionary,
) {
	const translatedMessages = {}
	for (const messageKey of Object.keys(combinedMessages)) {
		translatedMessages[messageKey] = '번역된 메시지 5'
	}
	return {
		newDictionary: {},
		translatedMessages,
	}
}

export async function translationScript_action(projectName, baseLocales, rootPath, helperPath) {
	const { cache, dictPerLanguage, initialMarkdownFiles } = await getFiles(rootPath, helperPath)

	const markdownListFromSupabase = await getMarkdownListByProjectName(projectName, baseLocales)
	const { explanations, languageMessageMap } = convertMarkdownFiles(
		initialMarkdownFiles,
		rootPath,
		markdownListFromSupabase,
	)
	const translatedLanguageMap = await getTranslatedLanguageMap_action(
		baseLocales,
		languageMessageMap,
		explanations,
		dictPerLanguage,
		cache,
		// getTranslatedMessages_markdown,
		getTranslatedMessages_forTest,
	)

	const languageMessageMap_baseLocales = R.pick(baseLocales)(languageMessageMap)
	const updatedMessagesPerLang = {}
	for (const [lang, messageMap] of Object.entries(languageMessageMap_baseLocales)) {
		updatedMessagesPerLang[lang] = {}
		for (const [messageKey, messageValue] of Object.entries(messageMap)) {
			if (!isSameNormalizedString(messageValue, cache[messageKey]?.[lang] || '')) {
				updatedMessagesPerLang[lang][messageKey] = messageValue
			}
		}
	}

	await saveFiles_action(
		projectName,
		helperPath,
		translatedLanguageMap,
		updatedMessagesPerLang,
		explanations,
		languageMessageMap_baseLocales,
	)
}
