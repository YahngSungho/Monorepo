import { blockClient_action } from '../functions.js'

blockClient_action()

export let env_private = process?.env || {}

export const setEnv_private = (environmentObject) => {
	env_private = Object.assign(env_private, environmentObject)
}
