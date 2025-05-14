import { R } from '@library/helpers/R'

import { ai } from './ai.js'
import { latestModel } from './modelNames.js'

export const getCachBySystemInstructions = R.curry(
	async (modelName, duration, options, willBeCachedData) => {
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
