import path from 'node:path'

import { writeFile_async } from '@library/helpers/fs-async'
import { R } from '@library/helpers/R'

// import { getTranslatedMessages_markdown } from '../translation/llm.js'
import {
	convertMarkdownFiles,
	getFiles,
	getTranslatedLanguageMap_action,
	saveFiles_action,
} from '../translation/markdown/translation.js'
import { getFrontmatterObject } from './getFrontmatters.js'

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
		translatedMessages,
		newDictionary: {},
	}
}

const basicLangs = ['ko', 'en']

export async function markdownScript_action(rootPath, helperPath) {
	const { initialMarkdownFiles, dictPerLanguage, cache } = await getFiles(rootPath, helperPath)
	const { languageMessageMap, explanations } = convertMarkdownFiles(initialMarkdownFiles, rootPath)
	const translatedLanguageMap = await getTranslatedLanguageMap_action(
		basicLangs,
		languageMessageMap,
		explanations,
		dictPerLanguage,
		cache,
		// getTranslatedMessages_markdown,
		getTranslatedMessages_forTest,
	)
	// @ts-ignore
	await saveFiles_action(
		rootPath,
		helperPath,
		translatedLanguageMap,
		explanations,
		R.pick(basicLangs)(languageMessageMap),
	)

	const languageMessageMap_new = R.merge(languageMessageMap)(
		R.pipe(
			translatedLanguageMap,
			R.mapObject((object) => object.newMessages),
			R.filter(Boolean),
		),
	)

	const frontmatterObject = getFrontmatterObject(languageMessageMap_new)
	for (const [lang, frontmatter] of Object.entries(frontmatterObject)) {
		const filePath = path.join(helperPath, 'frontmatters', `${lang}.json`)
		await writeFile_async(filePath, JSON.stringify(frontmatter, null, 2))
	}
}
