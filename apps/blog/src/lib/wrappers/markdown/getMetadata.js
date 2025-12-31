// @ts-ignore
import { R } from '@library/helpers/R'
import { getMarkdownFrontmatterList } from '@library/third-parties/supabase'

import { APP_NAME } from '$lib/info.js'

import { metadata } from '../../markdown-helpers/metadata.js'

export async function getAllMetadataObject(locale) {
	const frontmatterList = await getMarkdownFrontmatterList(APP_NAME, locale)
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
