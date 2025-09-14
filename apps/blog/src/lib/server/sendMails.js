import { sendMails_base } from '@library/library-top/sendMails'
import { EMAIL_SENDER_NAME, URL, EMAIL } from '$lib/info.js'

/**
 * 블로그용 메일 발송 액션 (info가 미리 적용된 커리 함수)
 *
 * @typedef {Object} EmailContent
 * @property {string} markdownText
 * @property {object} [mermaidSVGObject]
 */
/**
 * @callback SendMailsAction
 * @param {EmailContent} content
 * @param {string[]} emailList
 * @returns {Promise<void>}
 */


const sendMails_base0 = sendMails_base({
	name: EMAIL_SENDER_NAME,
	domain: URL,
	emailOfSender: EMAIL,
	preprocessMarkdownText: ((string) => (string.replaceAll('(/posts/', `(https://${URL}/posts/`)))
})


/** @type {SendMailsAction} */
export const sendMails_immediate_action = sendMails_base0({ deliveryTimeOptimize: false })

/** @type {SendMailsAction} */
export const sendMails_optimize_action = sendMails_base0({ deliveryTimeOptimize: true })