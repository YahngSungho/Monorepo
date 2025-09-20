import { env_public } from '@library/library-bottom/env-objects/public'
import { paraglideMiddleware } from '@library/paraglide/server.js'
import { handleErrorWithSentry, initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit'
import type { Handle } from '@sveltejs/kit'

import { dev } from '$app/environment'

const isDevelopment = env_public.dev

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

export const paraglideHandle: Handle = async ({ event, resolve }) => {
	return paraglideMiddleware(event.request, async ({ locale, request: localizedRequest }) => {
		event.request = localizedRequest

		if (dev) {
			return resolve(event, {
				transformPageChunk: ({ html }) =>
					html.replace('%lang%', locale).replace('%dir%', getDir(locale)),
			})
		}

		const cache = event.platform?.caches?.default
		if (!cache || localizedRequest.method !== 'GET') {
			return resolve(event, {
				transformPageChunk: ({ html }) =>
					html.replace('%lang%', locale).replace('%dir%', getDir(locale)),
			})
		}

		// 최종(캐노니컬) URL을 캐시 키로 사용
		const canonicalUrl = new URL(localizedRequest.url, event.url)

		// 개인정보 유출 방지
		const hasAuth =
			localizedRequest.headers.has('authorization') || localizedRequest.headers.has('cookie')
		if (!hasAuth) {
			const cached = await cache.match(canonicalUrl.toString())
			if (cached) return cached
		}

		const response = await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('%lang%', locale).replace('%dir%', getDir(locale)),
		})

		// HTML 캐시 판단(공유 캐시 가능 조건)
		const ct = response.headers.get('content-type') || ''
		const cc = response.headers.get('cache-control') || ''
		const baseCacheable =
			response.status === 200 && /text\/html/i.test(ct) && !/no-store|private/i.test(cc) && !hasAuth

		if (!baseCacheable) return response

		// 캐시 헤더 준비
		const headers = new Headers(response.headers)
		headers.set('cache-control', 'public, s-maxage=3600, max-age=0') // 1h 엣지 TTL, 브라우저 0

		// Set-Cookie가 있는 최초 응답도 캐시에 저장하되, 저장본에서는 Set-Cookie 제거
		const hasSetCookie = headers.has('set-cookie')
		if (hasSetCookie) {
			const headersForCache = new Headers(headers)
			headersForCache.delete('set-cookie')

			const toCacheFirst = new Response(response.body, {
				headers: headersForCache,
				status: response.status,
				statusText: response.statusText,
			})
			event.platform?.ctx?.waitUntil(
				(cache as any).put(canonicalUrl as any, toCacheFirst.clone() as any),
			)
			// 사용자에게는 원본(쿠키 설정 포함) 반환
			return response
		}

		const toCache = new Response(response.body, {
			headers,
			status: response.status,
			statusText: response.statusText,
		})

		// 타입 충돌 회피: Cloudflare Response 타입과 DOM Response 타입 불일치 방지
		event.platform?.ctx?.waitUntil((cache as any).put(canonicalUrl as any, toCache.clone() as any))
		return toCache
	})
}

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
		tracesSampleRate: isDevelopment ? 0 : 0.1,
	}),
	// Sentry 요청 핸들러
	sentryHandle(),
	// Paraglide 핸들러
	paraglideHandle,
]
