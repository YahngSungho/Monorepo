import fs from 'node:fs/promises'
import path from 'node:path'
import { getAbsolutePath } from '@library/helpers/fs-sync'

const appsPath = getAbsolutePath(import.meta.url, '../../../../../apps/')
const headersBasePath = getAbsolutePath(import.meta.url, './_headers')

await generateHeaders_action()

/**
 * apps 하위 각 앱 루트에 `_headers` 파일 생성 (액션)
 * - 소스: headersBasePath의 `_headers`
 * - 대상: 각 앱 디렉토리의 루트 `_headers`
 * @returns {Promise<void>}
 */
export async function generateHeaders_action() {
	const headersContent = await fs.readFile(headersBasePath, 'utf8')
	const appDirs = await getAppDirs_action(appsPath)
	for (const appDir of appDirs) {
		const outPath = path.join(appDir, '_headers')
		await fs.writeFile(outPath, headersContent, 'utf8')
	}
}

/**
 * apps 디렉토리의 직속 하위 폴더 절대경로 목록을 반환 (액션)
 * @param {string} absoluteAppsPath
 * @returns {Promise<string[]>}
 */
async function getAppDirs_action(absoluteAppsPath) {
	const dirents = await fs.readdir(absoluteAppsPath, { withFileTypes: true })
	return dirents.filter((d) => d.isDirectory()).map((d) => path.join(absoluteAppsPath, d.name))
}
