import { paraglideMiddleware } from '@library/paraglide/server.js'
import type { Handle } from '@sveltejs/kit'

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ locale }) => {
			return resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%lang%', locale),
			})
		},
		{
			disableAsyncLocalStorage: true,
		},
	)

export const handle: Handle = paraglideHandle
