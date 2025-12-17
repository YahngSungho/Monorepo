import { getDescriptionFromMD } from '@library/helpers/markdown'
import { redirect } from '@sveltejs/kit'

import { getOneMarkdown } from '$lib/wrappers/markdown/getMarkdown'

import {extractLocaleFromRequest} from '@library/paraglide/helpers'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent, request }) => {
const locale = extractLocaleFromRequest(request)
	console.log('💬 posts/slug ~ load ~ locale:', locale)

	const post = await getOneMarkdown(params.slug)
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
