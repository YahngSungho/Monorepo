import { getOneMarkdown_base } from '@library/backends/supabase'
import { getLocale } from '@library/paraglide/helpers'

import { APP_NAME } from '$lib/info.js'

export async function getOneMarkdown(slug) {
	const lang = getLocale()
	return await getOneMarkdown_base(APP_NAME, lang, slug)
}
