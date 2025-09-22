import { blockClient_action } from '../functions.js'

blockClient_action()

export let env_private = process?.env || {}

export const setEnv_private = (envObject) => {
	env_private = Object.assign(env_private, envObject)
}
