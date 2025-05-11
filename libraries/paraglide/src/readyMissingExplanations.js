import { getMissingExplanations, writeMissingExplanations_action } from '@library/scripts/explanation-ready'

const result = await getMissingExplanations()
await writeMissingExplanations_action(result)