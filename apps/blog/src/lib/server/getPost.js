import { getOneMarkdownBody } from '@library/backends/supabase'
import { getLocale } from '@library/paraglide/helpers'

import { APP_NAME } from '$lib/info.js'

export async function getPost(slug) {
	const lang = getLocale()
	return await getOneMarkdownBody(APP_NAME, lang, slug)
}
