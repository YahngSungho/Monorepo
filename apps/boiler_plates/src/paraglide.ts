import type { AvailableLanguageTag } from '@repo/base/runtime.js'
import { i18n } from './i18n.js'
import { page } from '$app/state'
import { goto } from '$app/navigation'

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
} from '@repo/base/runtime.js'
