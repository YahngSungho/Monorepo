import { extractCritical } from '@emotion/server' // Emotion 서버 유틸리티 import
import { paraglideMiddleware } from '@library/paraglide/server.js'
import { handleErrorWithSentry, initCloudflareSentryHandle, sentryHandle } from '@sentry/sveltekit'
import type { Handle } from '@sveltejs/kit'

// 환경 변수 확인
const isDeployEnv =
	process.env.CF_PAGES_BRANCH === 'main' || process.env.CF_PAGES_BRANCH === 'production'

import { sequence } from '@sveltejs/kit/hooks'

// 에러 핸들러 정의
const myErrorHandler = ({ error, event }) => {
	console.error('서버 측에서 오류 발생:', error, event)
	// 여기에 필요에 따라 추가적인 에러 로깅 또는 처리를 할 수 있습니다.
	// Sentry로 보내기 전에 사용자 정의 로직을 추가하거나,
	// 특정 에러는 Sentry로 보내지 않도록 필터링할 수도 있습니다.
}

// Sentry 에러 핸들러
export const handleError = handleErrorWithSentry(myErrorHandler)

// eslint-disable-next-line unicorn/prefer-set-has
const rtlLocales = ['ar', 'fa', 'he', 'prs', 'ps', 'sd', 'ur']
function getDir(locale: string) {
	const lang = locale.split('-')[0]
	return rtlLocales.includes(lang) ? 'rtl' : 'ltr'
}

// Paraglide 핸들러
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale).replace('%dir%', getDir(locale)),
		})
	})

// Emotion SSR 핸들러 정의
const emotionSsrHandle: Handle = async ({ event, resolve }) => {
	// resolve 함수를 호출하고, 반환된 Response 객체를 그대로 반환합니다.
	// transformPageChunk 옵션은 resolve 함수의 두 번째 인자로 전달됩니다.
	const response = await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			// 'done' 플래그는 HTML 청크 스트림의 마지막 부분을 나타냅니다.
			// 전체 HTML이 준비되었을 때만 스타일을 추출하고 삽입합니다.
			if (done) {
				// extractCritical 함수는 전달된 HTML 문자열에서 사용된 Emotion 스타일을 추출합니다.
				const { ids, css, html: transformedHtml } = extractCritical(html)

				// 추출된 CSS가 있다면, <style> 태그로 만들어 <head> 태그 내부에 삽입합니다.
				if (css) {
					// transformedHtml은 Emotion에 의해 일부 내부 마크업이 제거된 HTML일 수 있습니다.
					// 이 transformedHtml을 기반으로 스타일 태그를 주입합니다.
					return transformedHtml.replace(
						'</head>', // </head> 태그를 찾아 그 바로 앞에 스타일 태그를 삽입합니다.
						// eslint-disable-next-line github/unescaped-html-literal
						`<style data-emotion-css="${ids.join(' ')}">${css}</style></head>`,
					)
				}
				return transformedHtml // CSS가 없으면 변환된 HTML을 그대로 반환합니다.
			}
			return html // 마지막 청크가 아니면 원본 HTML 청크를 그대로 반환합니다.
		},
	})
	return response
}

// 모든 핸들러를 sequence로 결합
export const handle = sequence(
	// Sentry 초기화 핸들러 (가장 먼저 실행되도록 하는 것이 일반적)
	initCloudflareSentryHandle({
		dsn: 'https://f92c54aa251145c5a82fe3f56d688c24@o4508958888034304.ingest.us.sentry.io/4508958894129152',
		tracesSampleRate: isDeployEnv ? 0.1 : 1,
	}),
	// Sentry 요청 핸들러
	sentryHandle(),
	// Paraglide 핸들러
	paraglideHandle,
	// Emotion SSR 핸들러 (Paraglide 이후 또는 필요에 따라 순서 조정 가능)
	emotionSsrHandle,
)
