import { error } from '@sveltejs/kit'

import { getPost } from '$lib/server/getPost'
import { getMetadataOfPost } from '$lib/server/getMetadata.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const post = await getPost(params.slug)
	const metadata = await getMetadataOfPost(params.slug)

	if (!post) {
		error(404, 'Post not found')
	}

	return {
		post,
		metadata,
	}
}