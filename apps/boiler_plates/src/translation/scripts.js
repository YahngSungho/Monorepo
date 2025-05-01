import { getAbsolutePath } from '@library/helpers/fs-sync'
import {
	convertMarkdownFiles,
	getFiles,
	getTranslatedLanguageMap,
	getTranslatedMessages,
	saveFiles,
} from '@library/scripts/translation-markdown'

const rootPath = getAbsolutePath(import.meta.url, '../')
const helperPath = getAbsolutePath(import.meta.url, './')
const { initialMarkdownFiles, dictPerLanguage, cache } = await getFiles(rootPath, helperPath)
const { languageMessageMap, explanations } = convertMarkdownFiles(initialMarkdownFiles, rootPath)
const translatedLanguageMap = await getTranslatedLanguageMap(
	languageMessageMap,
	explanations,
	dictPerLanguage,
	cache,
	getTranslatedMessages,
)
// @ts-ignore
await saveFiles(
	rootPath,
	helperPath,
	translatedLanguageMap,
	explanations,
	// @ts-ignore
	languageMessageMap.ko,
	// @ts-ignore
	languageMessageMap.en,
)
