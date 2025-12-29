import { R } from '@library/helpers/R'

import { ai } from './ai.js'
import { flashModel, latestModel } from './modelNames.js'

export const getCachBySystemInstructions = R.curry(
	async (modelName, duration, options, willBeCachedData) => {
		if (!Number.isInteger(duration) || duration <= 0) {
			throw new Error('Duration must be a positive integer.')
		}
		if (duration > 120) {
			throw new Error('Duration must be less than 120.')
		}

		const options0 = options || {}

		const { name: cacheName } = await ai.caches.create({
			model: modelName,
			config: {
				systemInstruction: willBeCachedData,
				ttl: `${60 * duration}s`,
				...options0,
			},
		})

		return cacheName
	},
)

export const getCacheBySystemInstructions_latestModel = getCachBySystemInstructions(latestModel)
export const getCacheBySystemInstructions_flashModel = getCachBySystemInstructions(flashModel)
