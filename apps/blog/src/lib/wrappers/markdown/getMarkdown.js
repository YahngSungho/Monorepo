import { getLocale } from '@library/paraglide/helpers'
import { getOneMarkdown_base } from '@library/third-parties/supabase'

import { APP_NAME } from '$lib/info.js'

/**
 * @typedef {Object} MarkdownWithMermaid
 * @property {string} body
 * @property {Object} mermaid_svg_object
 */

/**
 * @typedef {Object} MarkdownBody
 * @property {string} body
 */

const getOneMarkdown_base0 = getOneMarkdown_base(APP_NAME)

/**
 * @callback GetOneMarkdown
 * @param {string} key
 * @returns {Promise<MarkdownWithMermaid | undefined>}
 */
/** @type {GetOneMarkdown} */
export async function getOneMarkdown(key) {
	const locale = getLocale()
	return await getOneMarkdown_base0(locale, 'body, mermaid_svg_object', key)
}

/**
 * @callback GetOneMarkdownBody
 * @param {string} key
 * @returns {Promise<MarkdownBody | undefined>}
 */
/** @type {GetOneMarkdownBody} */
export async function getOneMarkdownBody(key) {
	const locale = getLocale()
	return await getOneMarkdown_base0(locale, 'body', key)
}
