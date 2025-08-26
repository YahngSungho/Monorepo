// @ts-ignore
import { getMarkdownFrontmatterList } from '@library/backends/supabase'
import { R } from '@library/helpers/R'
// @ts-ignore
import { getLocale } from '@library/paraglide/helpers'

import { APP_NAME } from '$lib/info.js'

const metadata = import.meta.glob('/src/translation/metadata.json', { eager: true, query: 'raw' })

export async function getAllMetadata0() {
	const lang = getLocale()
	const frontmatterList = await getMarkdownFrontmatterList(APP_NAME, lang)
	console.log('💬 ~ getAllMetadata0 ~ frontmatterList:', frontmatterList)

	// @ts-ignore
	const parsedMetadata = JSON.parse(metadata['/src/translation/metadata.json'].default)

	return R.mapObject((value, key) => {
		return {
			slug: key.slice(key.lastIndexOf('/') + 1),
			...value,
			...parsedMetadata[key],
		}
	})(frontmatterList)
}
