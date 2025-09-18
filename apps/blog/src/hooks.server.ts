import { defaultHandlers, } from '@library/base/hooks.server.ts'
import { sequence } from '@sveltejs/kit/hooks'
import { env } from '$env/dynamic/private'
import { setEnv_private } from '@library/library-bottom/env-objects/private'

setEnv_private(env)

export const handle = sequence(...defaultHandlers)

export {handleError} from '@library/base/hooks.server.ts'