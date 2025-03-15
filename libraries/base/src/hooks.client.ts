import * as Sentry from '@sentry/sveltekit'

Sentry.init({
	dsn: 'https://f92c54aa251145c5a82fe3f56d688c24@o4508958888034304.ingest.us.sentry.io/4508958894129152',
	tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
	integrations: [],
	replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0 : 0.1,
	replaysOnErrorSampleRate: 1.0,
})

import('@sentry/sveltekit')
	// eslint-disable-next-line github/no-then
	.then((lazyLoadedSentry) => {
		Sentry.addIntegration(
			lazyLoadedSentry.replayIntegration({
				maskAllText: true,
				blockAllMedia: true,
			}),
		)
		Sentry.addIntegration(lazyLoadedSentry.replayCanvasIntegration())
	})
	// eslint-disable-next-line github/no-then
	.catch((error) => {
		console.error('Error loading Sentry:', error)
	})

const myErrorHandler = ({ error, event }) => {
	console.error('클라이언트 측에서 오류 발생:', error, event)
}

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler)

// or alternatively, if you don't have a custom error handler:
// export const handleError = handleErrorWithSentry();
