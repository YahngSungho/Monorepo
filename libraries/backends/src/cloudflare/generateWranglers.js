import { getAbsolutePath } from '@library/helpers/fs-sync'
import { R } from '@library/helpers/R'
import fs from 'node:fs/promises'
import path from 'node:path'

const appsPath = getAbsolutePath(import.meta.url, '../../../../apps/')
const wranglerBasePath = getAbsolutePath(import.meta.url, './wrangler.base.jsonc')

await generateWranglers_action()

// ---

/**
 * 헬퍼들 (계산)
 */
function isQuote(ch) {
	return ch === '"' || ch === "'"
}

function isWhitespace(ch) {
	return /\s/.test(ch)
}

function startsLineComment(input, i) {
	return input[i] === '/' && i + 1 < input.length && input[i + 1] === '/'
}

function startsBlockComment(input, i) {
	return input[i] === '/' && i + 1 < input.length && input[i + 1] === '*'
}

function advanceToLineEnd(input, startIndex) {
	let index = startIndex
	while (index < input.length && input[index] !== '\n') index++
	return index
}

function advanceToBlockEnd(input, startIndex) {
	let index = startIndex
	while (index < input.length) {
		if (input[index] === '*' && index + 1 < input.length && input[index + 1] === '/') {
			return index + 2
		}
		index++
	}
	return index
}

function isTrailingCommaAt(input, i) {
	if (input[i] !== ',') return false
	let j = i + 1
	while (j < input.length && isWhitespace(input[j])) j++
	const c = j < input.length ? input[j] : ''
	return c === '}' || c === ']'
}

function consumeComment(input, i, keepComments) {
	if (startsLineComment(input, i)) {
		const start = i
		const end = advanceToLineEnd(input, i + 2)
		return { handled: true, newIndex: end, snippet: keepComments ? input.slice(start, end) : '' }
	}
	if (startsBlockComment(input, i)) {
		const start = i
		const end = advanceToBlockEnd(input, i + 2)
		return { handled: true, newIndex: end, snippet: keepComments ? input.slice(start, end) : '' }
	}
	return { handled: false }
}

function consumeString(input, i) {
	const quote = input[i]
	let j = i + 1
	while (j < input.length) {
		const ch = input[j]
		if (ch === '\\') {
			j += 2
			continue
		}
		if (ch === quote) {
			j++
			break
		}
		j++
	}
	return { newIndex: j, snippet: input.slice(i, j) }
}

/**
 * 공통 JSONC 변환기 (계산)
 * @param {string} input
 * @param {{ removeComments: boolean, removeTrailingCommas: boolean }} options
 */
function transformJsonc(input, options) {
	const keepComments = !options.removeComments
	const removeTrailing = options.removeTrailingCommas

	let output = ''
	let i = 0

	while (i < input.length) {
		const ch = input[i]

		// 댓글 처리
		const comment = consumeComment(input, i, keepComments)
		if (comment.handled) {
			output += comment.snippet
			i = comment.newIndex
			continue
		}

		// 문자열 처리
		if (isQuote(ch)) {
			const { newIndex, snippet } = consumeString(input, i)
			output += snippet
			i = newIndex
			continue
		}

		// 트레일링 콤마 처리
		if (removeTrailing && ch === ',' && isTrailingCommaAt(input, i)) {
			i++
			continue
		}

		// 기본 문자 출력
		output += ch
		i++
	}

	return output
}

/**
 * JSONC 문자열에서 주석을 제거합니다. (계산)
 * @param {string} input
 * @returns {string}
 */
function stripComments(input) {
	return transformJsonc(input, { removeComments: true, removeTrailingCommas: false })
}

/**
 * JSONC 문자열에서 트레일링 콤마를 제거합니다. (계산)
 * @param {string} input
 * @returns {string}
 */
function stripTrailingCommas(input) {
	return transformJsonc(input, { removeComments: false, removeTrailingCommas: true })
}

/**
 * JSONC 문자열을 안전하게 파싱합니다. (계산)
 * @param {string} content
 * @returns {any}
 */
function parseJsonc_toObject(content) {
	const noComments = stripComments(content)
	const normalized = stripTrailingCommas(noComments)
	return JSON.parse(normalized)
}

/**
 * 깊은 병합: 객체는 재귀 병합, 배열은 concat, 그 외는 override 선택 (계산)
 * @param {any} base
 * @param {any} override
 * @returns {any}
 */
function deepMergePreferOverride(base, override) {
	const combine = (left, right) => (Array.isArray(left) && Array.isArray(right) ? R.concat(left)(right) : right)
	return R.mergeDeepWith(combine, base, override)
}

/**
 * 파일을 읽고 JSONC로 파싱 (액션)
 * @param {string} absoluteFilePath
 * @returns {Promise<any>}
 */
async function readJsoncFile_action(absoluteFilePath) {
	const content = await fs.readFile(absoluteFilePath, 'utf8')
	return parseJsonc_toObject(content)
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
	const appDirs = dirents.filter((d) => d.isDirectory()).map((d) => path.join(absoluteAppsPath, d.name))
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
