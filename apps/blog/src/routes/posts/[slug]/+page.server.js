import { getDescriptionFromMD } from '@library/helpers/markdown'
import { redirect } from '@sveltejs/kit'

import { getPost } from '$lib/server/getPost'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const post = await getPost(params.slug)
	const { allMetadata } = await parent()
	const currentMetadata = allMetadata[params.slug]

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
