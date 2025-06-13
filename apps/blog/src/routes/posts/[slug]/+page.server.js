import { error } from '@sveltejs/kit'

import { getPost } from '$lib/server/getPost'
import { getLocale } from '@library/paraglide/helpers'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const post = await getPost(params.slug, getLocale())

	if (!post) {
		error(404, 'Post not found')
	}

	return {
		post,
	}
}