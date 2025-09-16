import { getAbsolutePath } from '@library/helpers/fs-sync'
import { R } from '@library/helpers/R'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as jsoncParser from 'jsonc-parser'

const appsPath = getAbsolutePath(import.meta.url, '../../../../apps/')
const wranglerBasePath = getAbsolutePath(import.meta.url, './wrangler.base.jsonc')

await generateWranglers_action()

// ---

/**
 * 깊은 병합: 객체는 재귀 병합, 배열은 concat, 그 외는 override 선택 (계산)
 * @param {any} base
 * @param {any} override
 * @returns {any}
 */
function deepMergePreferOverride(base, override) {
	const combine = (left, right) =>
		Array.isArray(left) && Array.isArray(right) ? R.concat(left)(right) : right
	return R.mergeDeepWith(combine, base, override)
}

/**
 * 파일을 읽고 JSONC로 파싱 (액션)
 * @param {string} absoluteFilePath
 * @returns {Promise<any>}
 */
async function readJsoncFile_action(absoluteFilePath) {
	const content = await fs.readFile(absoluteFilePath, 'utf8')
	const errors = []
	const options = { allowTrailingComma: true, disallowComments: false, allowEmptyContent: true }
	const data = jsoncParser.parse(content, errors, options)
	if (errors.length > 0) {
		const msg = errors.map((e) => `code=${e.error}`).join(', ')
		throw new Error(`Invalid JSONC at ${absoluteFilePath}: ${msg}`)
	}
	return data
}

/**
 * JSON 객체를 pretty JSONC (주석 없음)으로 기록 (액션)
 * @param {string} absoluteFilePath
 * @param {any} data
 * @returns {Promise<void>}
 */
async function writeJsoncFile_action(absoluteFilePath, data) {
	const text = `${JSON.stringify(data, undefined, 2)}\n`
	await fs.writeFile(absoluteFilePath, text, 'utf8')
}

/**
 * apps 폴더 하위의 override 파일이 존재하는 앱 경로들을 반환 (액션)
 * @param {string} absoluteAppsPath
 * @returns {Promise<string[]>}
 */
async function getAppDirsWithOverride_action(absoluteAppsPath) {
	const dirents = await fs.readdir(absoluteAppsPath, { withFileTypes: true })
	const appDirs = dirents
		.filter((d) => d.isDirectory())
		.map((d) => path.join(absoluteAppsPath, d.name))
	/** @type {string[]} */
	const targets = []
	for (const dir of appDirs) {
		const overridePath = path.join(dir, 'wrangler.override.jsonc')
		try {
			await fs.access(overridePath)
			targets.push(dir)
		} catch {}
	}
	return targets
}

/**
 * wrangler.base.jsonc + 각 앱의 wrangler.override.jsonc 를 머지하여 wrangler.jsonc 생성 (액션)
 * - 키 충돌 시 override가 우선, 그 외는 base 유지
 * @returns {Promise<void>}
 */
export async function generateWranglers_action() {
	// base 한번만 읽기
	const base = await readJsoncFile_action(wranglerBasePath)
	const targetApps = await getAppDirsWithOverride_action(appsPath)

	for (const appDir of targetApps) {
		const overridePath = path.join(appDir, 'wrangler.override.jsonc')
		const outPath = path.join(appDir, 'wrangler.jsonc')
		const override = await readJsoncFile_action(overridePath)
		const merged = deepMergePreferOverride(base, override)
		await writeJsoncFile_action(outPath, merged)
	}
}
