import { getDescriptionFromMD } from '@library/helpers/markdown'
import { redirect } from '@sveltejs/kit'
import { getLocale } from '@library/paraglide/helpers'

import { getOneMarkdown } from '$lib/wrappers/markdown/getMarkdown'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const post = await getOneMarkdown(getLocale(), params.slug)
	const { allMetadataObject } = await parent()
	const currentMetadata = allMetadataObject[params.slug]

	if (!post) {
		redirect(307, '/')
	}

	const description = getDescriptionFromMD(post.body)

	return {
		currentMetadata,
		description,
		post,
	}
}
