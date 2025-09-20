import { env_public } from '@library/library-bottom/env-objects/public'
import { paraglideMiddleware } from '@library/paraglide/server.js'
import { handleErrorWithSentry, initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit'
import type { Handle } from '@sveltejs/kit'

const isDev = env_public.dev

// 에러 핸들러 정의
const myErrorHandler = ({ error, event }) => {
	console.error('서버 측에서 오류 발생:', error, event)
	// 여기에 필요에 따라 추가적인 에러 로깅 또는 처리를 할 수 있습니다.
	// Sentry로 보내기 전에 사용자 정의 로직을 추가하거나,
	// 특정 에러는 Sentry로 보내지 않도록 필터링할 수도 있습니다.
}

// Sentry 에러 핸들러
export const handleError = handleErrorWithSentry(myErrorHandler)

const rtlLocales = new Set(['ar', 'fa', 'he', 'prs', 'ps', 'sd', 'ur'])
function getDir(locale: string) {
	const lang = locale.split('-')[0]
	return rtlLocales.has(lang) ? 'rtl' : 'ltr'
}

// Paraglide 핸들러
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('%lang%', locale).replace('%dir%', getDir(locale)),
		})
	})

// 개발자 도구 등에서 발생하는 불필요한 요청을 무시하기 위한 핸들러
const junkRequestHandle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		// 해당 경로의 요청에 대해 204 No Content 응답을 반환하여 처리를 중단합니다.
		return new Response(null, { status: 204 })
	}
	// 그 외의 요청은 다음 핸들러로 전달합니다.
	return resolve(event)
}

// 모든 핸들러를 sequence로 결합
export const defaultHandlers: Handle[] = [
	// 불필요한 요청 무시 핸들러 추가
	junkRequestHandle,
	// Sentry 초기화 핸들러 (가장 먼저 실행되도록 하는 것이 일반적)
	initCloudflareSentryHandle({
		dsn: 'https://f92c54aa251145c5a82fe3f56d688c24@o4508958888034304.ingest.us.sentry.io/4508958894129152',
		tracesSampleRate: isDev ? 0 : 0.1,
	}),
	// Sentry 요청 핸들러
	sentryHandle(),
	// Paraglide 핸들러
	paraglideHandle,
]
