import { error } from '@sveltejs/kit'

import { getAllMetadata } from '$lib/server/getMetadata.js'
import { getPost } from '$lib/server/getPost'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const post = await getPost(params.slug)
	const allMetadata = await getAllMetadata()
	const metadata = allMetadata[`posts/${params.slug}`]

	if (!post) {
		error(404, 'Post not found')
	}

	return {
		post,
		allMetadata,
		metadata,
	}
}
