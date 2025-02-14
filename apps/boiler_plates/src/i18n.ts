import { createI18n } from '@inlang/paraglide-sveltekit'
import * as runtime from '@library/base/runtime.js'

export const i18n = createI18n(runtime, {
	prefixDefaultLanguage: 'always',
})
