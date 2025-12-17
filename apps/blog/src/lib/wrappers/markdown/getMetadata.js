// @ts-ignore
import { getMarkdownFrontmatterList } from '@library/backends/supabase'
import { R } from '@library/helpers/R'
// @ts-ignore
import { getLocale } from '@library/paraglide/helpers'

import { APP_NAME } from '$lib/info.js'

import { metadata } from '../../markdown-helpers/metadata.js'

export async function getAllMetadataObject() {
	const lang = getLocale()

	const frontmatterList = await getMarkdownFrontmatterList(APP_NAME, lang)
	const frontmatterObjectObject = {}
	for (const value of frontmatterList) {
		frontmatterObjectObject[value.key] = value.frontmatter
	}

	return R.applyPipe(
		frontmatterObjectObject,
		R.mapObject((value, key) => {
			return {
				slug: key,
				...value,
				...metadata[key],
			}
		}),
		R.pickBy((value) => !value.skip),
	)
}
