import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeString } from '@library/helpers/functions'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CACHE_DIR = path.join(__dirname, '..', '.cache') // 프로젝트 루트의 .cache 디렉토리

/**
 * 지정된 경로에서 캐시 파일을 읽어 내용을 반환합니다. 파일이 없거나 오류 발생 시 null을 반환합니다.
 *
 * @param {string} cacheFilePath - 읽어올 캐시 파일의 전체 경로
 * @returns {string | undefined} 캐시 파일 내용 또는 undefined
 */
function readCache(cacheFilePath) {
	try {
		if (!fs.existsSync(cacheFilePath)) {
			return undefined
		}
		return fs.readFileSync(cacheFilePath, 'utf8')
	} catch (error) {
		console.error(`캐시 읽기 오류 (${cacheFilePath}):`, error)
		return undefined
	}
}

/**
 * 주어진 상태(state)를 지정된 경로의 캐시 파일에 씁니다.
 *
 * @param {string} state - 저장할 페이지 상태 (직렬화된 문자열)
 * @param {string} cacheFilePath - 저장할 캐시 파일의 전체 경로
 */
function writeCache_action(state, cacheFilePath) {
	try {
		// 캐시 디렉토리가 없으면 생성
		const dir = path.dirname(cacheFilePath)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}
		fs.writeFileSync(cacheFilePath, state, 'utf8')
		// console.log(`페이지 상태 캐시 저장 완료: ${cacheFilePath}`)
	} catch (error) {
		console.error(`캐시 쓰기 오류 (${cacheFilePath}):`, error)
	}
}

/**
 * Playwright Page 객체를 받아 직렬화된 문자열로 반환합니다. (현재는 전체 HTML 사용)
 *
 * @param {import('@playwright/test').Page} page - 직렬화할 Playwright 페이지 객체
 * @returns {Promise<string>} 직렬화된 페이지 내용 (HTML 문자열)
 */
async function serializePage(page) {
	const content = await page.content()
	return normalizeString(content, { toLowerCase: false })
}

/**
 * 두 상태 문자열을 비교하여 동일한지 여부를 반환합니다.
 *
 * @param {string | undefined} cachedState - 캐시에서 읽어온 상태 문자열 (없으면 undefined)
 * @param {string} currentState - 현재 페이지에서 직렬화된 상태 문자열
 * @returns {boolean} 두 상태가 동일하면 true, 아니면 false
 */
function isSameState(cachedState, currentState) {
	// 간단한 문자열 비교
	return cachedState === currentState
}

export { CACHE_DIR, isSameState, readCache, serializePage, writeCache_action }
