import path from 'node:path'

import { saveMarkdownList_action } from '@library/backends/supabase'
import { writeFile_async } from '@library/helpers/fs-async'

import { getNewCache } from '../translation/helpers.js'
import { dictFolderPath } from '../translation/markdown/translation.js'
import { getFrontmatterObject } from './getFrontmatters.js'
import { getMermaidSVGObject } from './getMermaidSVGObject.js'

export async function saveFiles_action(
	projectName,
	helperFolderPath,
	translatedLanguageMap,
	updatedMessagesPerLang,
	explanations,
	languageMessageMap_basicLangs,
) {
	const markdownListForSave = []

	for await (const [language, messageMap] of Object.entries(translatedLanguageMap)) {
		if (messageMap.missingMessageKeys.length === 0) {
			continue
		}

		for await (const [messageKey, messageValue] of Object.entries(messageMap.translatedMessages)) {
			await writeFile_async(
				path.join(dictFolderPath, `${language}.json`),
				JSON.stringify(
					{
						$schema: 'https://inlang.com/schema/inlang-message-format',
						...messageMap.newDictionary,
					},
					undefined,
					2,
				),
			)

			markdownListForSave.push({
				body: messageValue,
				frontmatter: getFrontmatterObject(messageValue),
				key: messageKey,
				locale: language,
				projectName,
				mermaidSVGObject: await getMermaidSVGObject(messageValue),
			})
		}

	}

	for await (const [lang, updatedMessages] of Object.entries(updatedMessagesPerLang)) {
		for await (const [messageKey, messageValue] of Object.entries(updatedMessages)) {
			markdownListForSave.push({
				body: messageValue,
				frontmatter: getFrontmatterObject(messageValue),
				key: messageKey,
				locale: lang,
				projectName,
				mermaidSVGObject: await getMermaidSVGObject(messageValue),
			})
		}
	}

	await saveMarkdownList_action(markdownListForSave)

	const newCache = getNewCache(languageMessageMap_basicLangs, explanations)
	await writeFile_async(
		path.join(helperFolderPath, 'cache.json'),
		JSON.stringify(newCache, undefined, 2),
	)
}
