import { getAllMetadata0 } from '$lib/server/getMetadata'

export const load = async () => {
	const allMetadata = await getAllMetadata0()

	return {
		allMetadata,
	}
}
