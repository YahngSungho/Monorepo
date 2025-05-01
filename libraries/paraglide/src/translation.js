import { getFiles, getTranslatedLanguageMap, getTranslatedMessages, saveFiles } from '@library/scripts/translation-paraglide'

const { languageMessageMap, dictPerLanguage, explanations, cache } = await getFiles()
const result = await getTranslatedLanguageMap(languageMessageMap, explanations, dictPerLanguage, cache, getTranslatedMessages)
await saveFiles(result, explanations, languageMessageMap.ko)
