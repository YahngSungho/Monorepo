const envVarList = ['NODE_ENV', 'GITHUB_ACTIONS']

export let env_public = Object.fromEntries(
	Object.entries(globalThis?.process?.env || {}).filter(
		([key]) => key.startsWith('PUBLIC_') || envVarList.includes(key),
	),
)

export const setEnv_public = (envObject) => {
	env_public = Object.assign(env_public, envObject)
}
