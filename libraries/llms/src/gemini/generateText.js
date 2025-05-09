import { R } from '@library/helpers/R'

import { ai } from './ai.js'
import { latestModel } from './modelNames.js'

export const generateText = R.curry(async (model, config, cache, contents) => {
	const config0 = config || {}

	const result =  await ai.models.generateContent({
		model,
		contents,
		config: {
			cachedContent: cache,
			topP: 0.2,
			responseMimeType: 'application/json',
			thinkingConfig: {
				...config0,
				includeThoughts: true, thinkingBudget: 50_000
			},
		}
		})

	return result.text
})

export const generateText_latestModel = generateText(latestModel)