import { setEnv_public } from '@library/library-bottom/env-objects/public'

import { env } from '$env/dynamic/public'

setEnv_public({
	...env,
})

export * from '@library/base/hooks.ts'
