import { visit } from 'unist-util-visit'

export function rehypeRenameFootnotePrefix(customPrefix) {
	const from = 'user-content-fn'
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (!node.properties) return
			for (const key of ['id', 'href']) {
				const value = node.properties[key]
				if (typeof value !== 'string') continue
				// both fn- and fnref- targets; handle raw id and hash href
				const from1 = `${from}-`
				if (value.startsWith(from1)) {
					node.properties[key] = customPrefix + value.slice(from1.length)
				}
				if (value.startsWith(`#${from1}`)) {
					node.properties[key] = `#${customPrefix}${value.slice(`#${from1}`.length)}`
				}
				const from2 = `${from}ref-`
				if (value.startsWith(from2)) {
					node.properties[key] = `${customPrefix}ref-${value.slice(from2.length)}`
				}
				if (value.startsWith(`#${from2}`)) {
					node.properties[key] = `#${customPrefix}ref-${value.slice(`#${from2}`.length)}`
				}
			}
		})
	}
}
