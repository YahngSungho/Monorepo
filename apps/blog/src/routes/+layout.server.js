import { getLocale } from '@library/paraglide/helpers'

import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata'

export const load = async () => {
	const allMetadataObject = await getAllMetadataObject(getLocale())
	const description = Object.values(allMetadataObject)
		.filter((item) => item.pinned)
		.map((item) => item.title)
		.join(' / ')

	return {
		allMetadataObject,
		description,
	}
}
