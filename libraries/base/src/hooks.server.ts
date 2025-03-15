import { paraglideMiddleware } from '@library/paraglide/server.js'
import { handleErrorWithSentry, initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const myErrorHandler = ({ error, event }) => {
	console.error('서버 측에서 오류 발생:', error, event)
}

export const handleError = handleErrorWithSentry(myErrorHandler)

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

const isDeployEnv =
	process.env.CF_PAGES_BRANCH === 'main' || process.env.CF_PAGES_BRANCH === 'production'

export const handle = sequence(
	initCloudflareSentryHandle({
		dsn: 'https://f92c54aa251145c5a82fe3f56d688c24@o4508958888034304.ingest.us.sentry.io/4508958894129152',
		tracesSampleRate: isDeployEnv ? 0.1 : 1,
	}),
	sentryHandle(),
	paraglideHandle,
)
