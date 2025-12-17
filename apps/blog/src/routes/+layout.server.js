import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata'
import {extractLocaleFromRequest} from '@library/paraglide/helpers'

export const load = async ({request}) => {
	const locale = extractLocaleFromRequest(request)
	const allMetadataObject = await getAllMetadataObject(locale)
	const description = Object.values(allMetadataObject)
		.filter((item) => item.pinned)
		.map((item) => item.title)
		.join(' / ')

	return {
		allMetadataObject,
		description,
	}
}
