import { deLocalizeUrl } from '@library/paraglide/runtime.js'
import type { Reroute } from '@sveltejs/kit'
import { config } from '@dotenvx/dotenvx'

config({ path: '../../.env.public' })

export const reroute: Reroute = (request) => {
	return deLocalizeUrl(request.url).pathname
}
