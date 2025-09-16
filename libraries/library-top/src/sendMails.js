import { mg } from '@library/backends/mailgun'
import { getFrontmatterObject, removeMDAndTags } from '@library/helpers/markdown'
import { R } from '@library/helpers/R'
// @ts-ignore
import EmailContent from '@library/ui/emailContent'
import juice from 'juice'
import { render } from 'svelte/server'

function getEmailHTMLContent(markdownText, mermaidSVGObject) {
	const { body, head } = render(EmailContent, { props: { mermaidSVGObject, value: markdownText } })

	const html = `
	<!DOCTYPE html>
	<html>
		<head>
			${head}
		</head>
		<body>
			${body}
		</body>
	</html>
`

	// eslint-disable-next-line import-x/no-named-as-default-member
	return juice.inlineContent(
		html,
		`
	ul, ol {
		padding-inline: 1em !important;
		padding-left: 1em !important;
		padding-right: 1em !important;
	}

	pre {
		padding: 1em;
	}

	section {
		padding-top: 2em !important;
	}
	h2[id$='footnote-label'] {
		display: none;
	}
			`,
	)
}

export const sendMails_base = R.curry(async (info, config, content, emailList) => {
	const { domain, emailOfSender, name, preprocessMarkdownText = R.identity } = info
	const { markdownText, mermaidSVGObject } = content
	const { deliveryTimeOptimize = true } = config

	const frontmatterObject = getFrontmatterObject(markdownText)
	const { title } = frontmatterObject
	if (!title) {
		throw new Error('title is required')
	}

	const markdownText_preprocessed = preprocessMarkdownText(markdownText)
	let result
	try {
		result = await mg.messages.create(domain, {
			from: `${name} <${emailOfSender}>`,
			html: getEmailHTMLContent(markdownText_preprocessed, mermaidSVGObject),
			'o:deliverytime-optimize-period': deliveryTimeOptimize ? '168h' : undefined, // 168h = 7일
			'o:tracking': 'yes',
			'o:tracking-clicks': 'yes',
			'o:tracking-opens': 'yes',
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
