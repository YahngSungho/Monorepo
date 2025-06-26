import { error } from '@sveltejs/kit'

import { getMetadataOfPost } from '$lib/server/getMetadata.js'
import { getPost } from '$lib/server/getPost'

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
