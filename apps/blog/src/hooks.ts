import { dev } from '$app/environment';
import { setEnv_public } from '@library/library-bottom/env-objects/public'

import { env } from '$env/dynamic/public'

setEnv_public({
	...env,
	dev
})

export * from '@library/base/hooks.ts'
