import { sendMails_action as sendMails_base } from '@library/library-top/sendMails'

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
/** @type {SendMailsAction} */
export const sendMails_action = sendMails_base({
	name: 'Sungho Yahng',
	url: 'sungho.blog',
	myEmail: 'hi@sungho.blog',
	preprocessMarkdownText: ((string) => (string.replaceAll('(/posts/', '(https://sungho.blog/posts/')))
})