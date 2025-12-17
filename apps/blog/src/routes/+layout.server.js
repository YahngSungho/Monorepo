import { getAllMetadataObject } from '$lib/wrappers/markdown/getMetadata'

export const load = async ({request}) => {
	const allMetadataObject = await getAllMetadataObject()
	const description = Object.values(allMetadataObject)
		.filter((item) => item.pinned)
		.map((item) => item.title)
		.join(' / ')

	return {
		allMetadataObject,
		description,
	}
}
