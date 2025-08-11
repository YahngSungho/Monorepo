import { defaultHandlers, } from '@library/base/hooks.server.ts'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(...defaultHandlers)

export {handleError} from '@library/base/hooks.server.ts'