import { getAllMetadata0 } from '$lib/server/getMetadata'

export const load = async () => {
	const allMetadata = await getAllMetadata0()
	const description = Object.values(allMetadata)
	.filter((item) => item.pinned).map((item) => (item.title)).join(' / ')

	return {
		allMetadata,
		description,
	}
}
