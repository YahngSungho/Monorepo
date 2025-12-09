// @ts-ignore
import MarkdownComponent from '@library/ui/markdown-email'
import { render } from 'svelte/server'

const EMAIL_MINIMAL_STYLES = `
  ul, ol { padding-inline: 1em !important; padding-left: 1em !important; padding-right: 1em !important; }
  pre { padding: 1em; }
  section { padding-top: 2em !important; }
  h2[id$='footnote-label'] { display: none; }
`
export function getEmailHTMLFromMarkdownText_onlyContent (markdownText) {
	const { body } = render(MarkdownComponent, { props: { value: markdownText } })

	return body
}

export function getEmailHTMLFromMarkdownText(markdownText) {
	const { body, head } = render(MarkdownComponent, { props: { value: markdownText } })

	// Workers-safe: avoid CSS inlining via Node-only libraries. Embed minimal styles inline.
	return `<!DOCTYPE html>
<html>
  <head>
    ${head}
    <style>
${EMAIL_MINIMAL_STYLES}
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`
}