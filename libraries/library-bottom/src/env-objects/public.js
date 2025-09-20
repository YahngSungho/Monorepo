const envVarList = new Set(['GITHUB_ACTIONS', 'NODE_ENV'])

export let env_public = Object.fromEntries(
	Object.entries(globalThis?.process?.env || {}).filter(
		([key]) => key.startsWith('PUBLIC_') || envVarList.has(key),
	),
)

export const setEnv_public = (envObject) => {
	env_public = Object.assign(env_public, envObject)
}
