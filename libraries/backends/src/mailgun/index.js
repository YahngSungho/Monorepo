import { blockClient_action } from '@library/helpers/functions'
import { R } from '@library/helpers/R'
import { env_private } from '@library/library-bottom/env-objects/private'

blockClient_action()

const encodeBasicAuth = (username, password) => {
	if (typeof btoa === 'function') {
		return btoa(`${username}:${password}`)
	}
	// Node fallback (used in non-Workers test environments)
	return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}


/**
 * 계산: Mailgun 메시지 페이로드를 x-www-form-urlencoded 로 변환
 * @param {Record<string, any>} data
 */
export const toMailgunParams = (data) => {
	const params = new URLSearchParams()
	const entries = Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
	for (const [key, value] of entries) {
		if (key === 'to') {
			const toValue = Array.isArray(value) ? value.join(',') : String(value)
			params.append('to', toValue)
			continue
		}
		if (Array.isArray(value)) {
			for (const item of value) params.append(key, String(item))
			continue
		}
		params.append(key, String(value))
	}
	return params
}

/**
 * 액션: Mailgun 메시지 생성. 커리 적용 및 `_action` 접미사
 * @type {(domain: string) => (data: Record<string, any>) => Promise<any>}
 */
export const createMessage_action = R.curry(async (domain, data) => {
	const endpoint = `https://api.mailgun.net/v3/${domain}/messages`
	const authHeader = `Basic ${encodeBasicAuth('api', String(env_private.MAILGUN || ''))}`
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { authorization: authHeader },
		body: toMailgunParams(data),
	})
	if (!response.ok) {
		let text = ''
		try { text = await response.text() } catch {}
		throw new Error(`Mailgun API error ${response.status}: ${text}`)
	}
	return response.json()
})
