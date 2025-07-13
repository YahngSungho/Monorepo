import { error } from '@sveltejs/kit'

import { getPost } from '$lib/server/getPost'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const post = await getPost(params.slug)
	const { allMetadata } = await parent()
	const currentMetadata = allMetadata[`posts/${params.slug}`]

	if (!post) {
		error(404, 'Post not found')
	}

	return {
		post,
		currentMetadata,
	}
}
