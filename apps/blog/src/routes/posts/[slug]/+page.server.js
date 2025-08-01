import { redirect } from '@sveltejs/kit'

import { getPost } from '$lib/server/getPost'
import { getDescriptionFromMD } from '@library/helpers/processText'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const post = await getPost(params.slug)
	const { allMetadata } = await parent()
	const currentMetadata = allMetadata[`posts/${params.slug}`]

	if (!post) {
		redirect(307, '/')
	}

	const description = getDescriptionFromMD(post)

	return {
		post,
		currentMetadata,
		description,
	}
}
