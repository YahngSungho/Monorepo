import { getFiles, getTranslatedLanguageMap, saveFiles } from '@library/scripts/translation-paraglide'
import { getTranslatedMessages_paraglide } from '@library/scripts/translation-llm'

const { languageMessageMap, dictPerLanguage, explanations, cache } = await getFiles()
const result = await getTranslatedLanguageMap(languageMessageMap, explanations, dictPerLanguage, cache, getTranslatedMessages_paraglide)
await saveFiles(result, explanations, languageMessageMap.ko)
