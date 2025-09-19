export let env_public = Object.fromEntries(
	Object.entries(globalThis?.process?.env || {}).filter(
		([key]) => key.startsWith('PUBLIC_') || key === 'NODE_ENV' || key === 'GITHUB_ACTIONS',
	),
)

export const setEnv_public = (envObject) => {
	env_public = Object.assign(env_public, envObject)
}
