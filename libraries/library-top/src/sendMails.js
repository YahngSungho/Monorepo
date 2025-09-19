import { createMessage_action } from '@library/backends/mailgun'
import { getFrontmatterObject, removeMDAndTags } from '@library/helpers/markdown'
import { R } from '@library/helpers/R'
// @ts-ignore
import MarkdownComponent from '@library/ui/markdown-email'
import { render } from 'svelte/server'

const EMAIL_MINIMAL_STYLES = `
  ul, ol { padding-inline: 1em !important; padding-left: 1em !important; padding-right: 1em !important; }
  pre { padding: 1em; }
  section { padding-top: 2em !important; }
  h2[id$='footnote-label'] { display: none; }
`

function getEmailHTMLContent(markdownText) {
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

export const sendMails_base_action = R.curry(async (info, config, content, emailList) => {
	const { domain, emailOfSender, name, preprocessMarkdownText = R.identity } = info
	const { markdownText, campaignID } = content
	const { deliveryTimeOptimize = true } = config

	const frontmatterObject = getFrontmatterObject(markdownText)
	const { title } = frontmatterObject
	if (!title) {
		throw new Error('title is required')
	}

	const markdownText_preprocessed = preprocessMarkdownText(markdownText)
	let result
	try {
		result = await createMessage_action(domain)({
			from: `${name} <${emailOfSender}>`,
			html: getEmailHTMLContent(markdownText_preprocessed),
			'o:deliverytime-optimize-period': deliveryTimeOptimize ? '72h' : undefined, // 72h = 3일
			'o:tracking': 'yes',
			'o:tracking-clicks': 'yes',
			'o:tracking-opens': 'yes',
			'o:campaign': campaignID,
			'recipient-variables': JSON.stringify(toObject(emailList)),
			subject: title,
			text: removeMDAndTags(markdownText_preprocessed),
			to: emailList,
		})
	} catch (error) {
		console.error(error)
		throw error
	}

	console.log(result)
})

/**
 * 배열을 인자로 받아, 각 요소를 key로, 빈 객체를 value로 가지는 객체를 반환합니다.
 * @param {Array<string>} arr - 키로 사용할 값들이 담긴 배열
 * @returns {Object} 변환된 객체
 */
const toObject = (arr) => {
	return arr.reduce((accumulator, currentKey) => {
		// accumulator는 최종적으로 반환될 객체입니다.
		// currentKey는 배열의 현재 요소입니다.
		accumulator[currentKey] = {}
		return accumulator
	}, {}) // {}는 accumulator의 초기값으로, 빈 객체에서 시작합니다.
}
