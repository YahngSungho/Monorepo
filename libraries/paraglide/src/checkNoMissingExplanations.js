import { getMissingExplanations } from '@library/scripts/explanation-ready'

const result = await getMissingExplanations()

if (Object.keys(result).length > 0) {
	throw new Error('Missing explanations')
}