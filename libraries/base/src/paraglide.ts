import type {AvailableLanguageTag} from './lib/paraglide/runtime.js'
import {i18n} from './lib/i18n.js'
import {page} from '$app/state'
import {goto} from '$app/navigation'

function switchToLanguage(newLanguage: AvailableLanguageTag) {
	const canonicalPath = i18n.route(page.url.pathname)
	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage)
	goto(localisedPath)
}

export {switchToLanguage}

export * as m from './lib/paraglide/messages.js'
