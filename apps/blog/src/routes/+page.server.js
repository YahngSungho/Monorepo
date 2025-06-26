import { getAllMetadata } from '$lib/server/getMetadata'

export const load = async () => {
	const allMetadata = await getAllMetadata()

	return {
		allMetadata,
	}
}
