import { blockClient_action } from '../functions.js'

blockClient_action()

export let env_private = {}

export const setEnv_private = (envObject) => {
	env_private = envObject
}
