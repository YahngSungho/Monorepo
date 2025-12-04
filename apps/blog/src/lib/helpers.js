import { create } from '@library/helpers/mutative'

export const getHrefFromSlug = (slug) => {
	return `/posts/${slug}`
}

export const getLinkObjectArray = (allMetadata) => {
	return allMetadata.map((postMetadata) => {
		return create(postMetadata, draft => {
			draft.href = getHrefFromSlug(draft.slug)
		})
	})
}