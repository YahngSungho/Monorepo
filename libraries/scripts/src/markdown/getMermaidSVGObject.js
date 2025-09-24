import { getSimpleHash, normalizeString } from '@library/helpers/functions'
import { optimizeMermaidSvg } from '@library/helpers/svgo'
import { buildThemeVariables } from '@library/library-bottom/mermaid'
import { createMermaidRenderer } from 'mermaid-isomorphic'

export async function getMermaidSVGObject(markdownText) {
	const result = {}

	if (!markdownText || typeof markdownText !== 'string') return result

	// 안전한 수동 파싱으로 <Mermaid>...</mermaid> 블록 추출
	const mermaidValues = []
	// eslint-disable-next-line github/unescaped-html-literal
	const openTagLower = '<mermaid>'
	const closeTagLower = '</mermaid>'
	const lowerText = markdownText.toLowerCase()
	let fromIndex = 0
	while (fromIndex < lowerText.length) {
		const start = lowerText.indexOf(openTagLower, fromIndex)
		if (start === -1) break
		const contentStart = start + openTagLower.length
		const end = lowerText.indexOf(closeTagLower, contentStart)
		if (end === -1) break
		const captured = markdownText.slice(contentStart, end).trim()
		if (captured) mermaidValues.push(captured)
		fromIndex = end + closeTagLower.length
	}

	if (mermaidValues.length === 0) return result

	// 중복 제거하여 동일한 다이어그램은 한 번만 렌더
	const uniqueValues = Array.from(new Set(mermaidValues))
	const hashKeys = uniqueValues.map((string) => getSimpleHash(normalizeString(string)))

	// 렌더러는 한 번 생성하여 재사용
	const renderer = createMermaidRenderer()

	for (const theme of ['light', 'dark']) {
		const mermaidInit = {
			deterministicIds: true,
			logLevel: 'fatal',
			securityLevel: 'loose',
			startOnLoad: false,
			theme: 'base',
			themeVariables: buildThemeVariables(theme),
		}

		// 다이어그램 앞에 init 디렉티브를 주입하여 테마 적용
		const diagrams = uniqueValues.map((v) => `%%{init: ${JSON.stringify(mermaidInit)} }%%\n${v}`)

		// 다이어그램들을 한 번에 렌더 (입력 순서 보장 가정)
		const results = await renderer(diagrams, {
			containerStyle: { fontSize: '18px' },
		})

		for (let index = 0; index < uniqueValues.length; index++) {
			const key = `${theme}:${hashKeys[index]}`
			const item = results[index]
			let svg = ''
			/** @type {any} */
			const itemAny = item
			if (itemAny && typeof itemAny === 'object') {
				const value = itemAny.status === 'fulfilled' ? itemAny.value : itemAny
				if (value && value.svg) svg = String(value.svg)
			}
			result[key] = optimizeMermaidSvg(svg)
		}
	}

	return result
}
