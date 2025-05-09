import { generateText } from 'ai'

export const generateText_default = async (options) => {
	return await generateText({
		topP: 0.2,
		providerOptions: {
			google: {
				responseMimeType: 'application/json',
				thinkingConfig: {
					includeThoughts: false, thinkingBudget: 5000
				}
			}
		},
		...options,
	})
}