import type { AvailableLanguageTag } from '@library/base/runtime.js'

import { goto } from '$app/navigation'
import { page } from '$app/state'

import { i18n } from './i18n.js'

function switchToLanguage(newLanguage: AvailableLanguageTag) {
	const canonicalPath = i18n.route(page.url.pathname)
	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage)
	goto(localisedPath)
}

export { switchToLanguage }

export {
	availableLanguageTags,
	languageTag as getLanguageTag,
	isAvailableLanguageTag,
	onSetLanguageTag,
	setLanguageTag,
} from '@library/base/runtime.js'
