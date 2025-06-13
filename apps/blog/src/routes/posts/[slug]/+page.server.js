import { getLocale } from '@library/paraglide/helpers'

import { getPost } from '$lib/server/getPost'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const post = getPost(params.slug, getLocale())
	return {
		post,
	}
}