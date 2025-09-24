import { readFilesToStrings_recursive, writeFile_async } from '@library/helpers/fs-async'
import path from 'node:path'
import { nanoid } from 'nanoid'

// Calculation helpers (no heavy regex to avoid ReDoS concerns)
function isHeadingLine(line) {
    if (!line || line[0] !== '#') return false
    let hashCount = 0
    while (hashCount < line.length && hashCount < 6 && line[hashCount] === '#') {
        hashCount++
    }
    if (hashCount === 0 || hashCount > 6) return false
    const next = line[hashCount]
    return next === ' ' || next === '\t'
}

function rtrimSpacesTabs(text) {
    let end = text.length
    while (end > 0) {
        const ch = text.codePointAt(end - 1)
        if (ch === 0x20 || ch === 0x09) {
            end--
        } else {
            break
        }
    }
    return end === text.length ? text : text.slice(0, end)
}

function extractTrailingId(line) {
    // Ignore trailing spaces/tabs for parsing
    let end = line.length
    while (end > 0) {
        const ch = line.codePointAt(end - 1)
        if (ch === 0x20 || ch === 0x09) end--
        else break
    }
    if (end === 0) return null
    if (line[end - 1] !== '}') return null
    const start = line.lastIndexOf('{#', end)
    if (start === -1) return null
    const idStart = start + 2
    const idEnd = end - 1
    if (idStart >= idEnd) return null
    const idText = line.slice(idStart, idEnd)
    // idText must not contain whitespace or '}'
    for (let i = 0; i < idText.length; i++) {
        const c = idText.codePointAt(i)
        if (c === 0x7d /* } */ || c === 0x20 /* space */ || c === 0x09 /* tab */ || c === 0x0a || c === 0x0d) {
            return null
        }
    }
    return { id: idText, startIndex: start, endIndex: end }
}

// Calculation: parse heading lines and extract existing ids
/**
 * @param {string} content
 * @returns {Array<{ index: number, line: string, id: string|null }>}
 */
function getHeadingLines(content) {
    const eol = content.includes('\r\n') ? '\r\n' : '\n'
    const lines = content.split(eol)
    const result = []
    for (const [i, rawLine] of lines.entries()) {
        const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine
        if (!isHeadingLine(line)) continue
        const parsed = extractTrailingId(line)
        result.push({ index: i, line, id: parsed ? parsed.id : null })
    }
    return result
}

// Calculation: collect base heading ids or generate
/**
 * @param {string} baseContent
 * @returns {string[]}
 */
function collectHeadingIdsFromBase(baseContent) {
    const headings = getHeadingLines(baseContent)
    return headings.map((h) => h.id || nanoid())
}

// Calculation: apply heading ids to a markdown content
/**
 * @param {string} content
 * @param {string[]} headingIds
 * @returns {string}
 */
function applyHeadingIds(content, headingIds) {
    const eol = content.includes('\r\n') ? '\r\n' : '\n'
    const lines = content.split(eol)
    const headings = getHeadingLines(content)
    if (headings.length !== headingIds.length) {
        throw new Error('headingIds의 갯수와 현재 순회대상 마크다운 텍스트의 heading의 갯수가 다릅니다.')
    }

    let i = 0
    for (const heading of headings) {
        const { index, line } = heading
        const idToApply = headingIds[i]
        i++
        const trailing = extractTrailingId(line)
        const withoutId = trailing ? line.slice(0, trailing.startIndex) : line
        const trimmed = rtrimSpacesTabs(withoutId)
        const updated = `${trimmed} {#${idToApply}}`
        lines[index] = updated
    }

    return lines.join(eol)
}

// Calculation: group markdown file objects by their folder path
/**
 * @param {Array<{ fileName: string, value: string, path: string }>} markdownFiles
 * @returns {Record<string, Array<{ fileName: string, value: string, path: string }>>}
 */
function groupByFolder(markdownFiles) {
    /** @type {Record<string, Array<{ fileName: string, value: string, path: string }>>} */
    const groups = {}
    for (const fileObj of markdownFiles) {
        const folder = path.dirname(fileObj.path)
        if (!groups[folder]) groups[folder] = []
        groups[folder].push(fileObj)
    }
    return groups
}

// Action: orchestrate reading, processing, and writing files
/**
 * @param {string} rootAbsolutePath
 * @param {string[]} baseLocales
 */
export async function fixMarkdownText_action (rootAbsolutePath, baseLocales) {
    const markdownFiles = await readFilesToStrings_recursive(
        rootAbsolutePath,
        '**/*.md',
        '**/*prompt.md',
    )

    const groups = groupByFolder(markdownFiles)
    const primaryBase = Array.isArray(baseLocales) && baseLocales.length > 0 ? baseLocales[0] : null
    if (!primaryBase) {
        throw new Error('baseLocales가 비어있습니다.')
    }

    for (const [folderPath, files] of Object.entries(groups)) {
        // Find base-locale markdown in the folder
        const baseFile = files.find((f) => path.basename(f.fileName, '.md') === primaryBase)
        if (!baseFile) {
            throw new Error(`baseLocales[0]에 해당하는 마크다운 파일이 없습니다. 폴더: ${folderPath}`)
        }

        const headingIds = collectHeadingIdsFromBase(baseFile.value)

        for (const fileObj of files) {
            const locale = path.basename(fileObj.fileName, '.md')
            if (locale === 'explanation') continue

            const updated = applyHeadingIds(fileObj.value, headingIds)
            if (updated !== fileObj.value) {
                await writeFile_async(fileObj.path, updated)
            }
        }
    }
}