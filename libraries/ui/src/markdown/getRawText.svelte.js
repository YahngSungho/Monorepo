import { getAstNode } from 'svelte-exmarkdown'

export function getRawText() {
	const ast = getAstNode()
	return ast.current.children?.[0]?.value ?? ''
}
