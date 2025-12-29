import { R } from '@library/helpers/R'

import { ai } from './ai.js'
import { latestModel } from './modelNames.js'

export const generateText = R.curry(async (model, config, cache, contents) => {
	const config0 = config || {}

	const result = await ai.models.generateContent({
		config: {
			cachedContent: cache,
			responseMimeType: 'application/json',
			thinkingConfig: {
				thinkingBudget: 5000,
			},
			topP: 0.2,
			...config0,
		},
		contents,
		model,
	})

	return result.text
})

export const generateText_latestModel = generateText(latestModel)
