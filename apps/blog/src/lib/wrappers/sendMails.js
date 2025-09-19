import { sendMails_base_action } from '@library/library-top/sendMails'

import { EMAIL, EMAIL_SENDER_NAME, URL } from '$lib/info.js'

/**
 * 블로그용 메일 발송 액션 (info가 미리 적용된 커리 함수)
 *
 * @typedef {Object} EmailContent
 * @property {string} markdownText
 * @property {string} campaignID
 */
/**
 * @callback SendMailsAction
 * @param {EmailContent} content
 * @param {string[]} emailList
 * @returns {Promise<void>}
 */

const sendMails_base0_action = sendMails_base_action({
	domain: URL,
	emailOfSender: EMAIL,
	name: EMAIL_SENDER_NAME,
	preprocessMarkdownText: (string) => string.replaceAll('(/', `(https://${URL}/`),
})

/** @type {SendMailsAction} */
export const sendMails_immediate_action = sendMails_base0_action({ deliveryTimeOptimize: false })

/** @type {SendMailsAction} */
export const sendMails_optimize_action = sendMails_base0_action({ deliveryTimeOptimize: true })
