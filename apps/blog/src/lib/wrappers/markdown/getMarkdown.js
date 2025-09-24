import { getOneMarkdown_base } from '@library/backends/supabase'
import { getLocale } from '@library/paraglide/helpers'

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

const getOneMarkdown_base0 = getOneMarkdown_base(APP_NAME, getLocale())

/**
 * @callback GetOneMarkdown
 * @param {string} key
 * @returns {Promise<MarkdownWithMermaid | undefined>}
 */
/** @type {GetOneMarkdown} */
export const getOneMarkdown = getOneMarkdown_base0('body, mermaid_svg_object')

/**
 * @callback GetOneMarkdownBody
 * @param {string} key
 * @returns {Promise<MarkdownBody | undefined>}
 */
/** @type {GetOneMarkdownBody} */
export const getOneMarkdownBody = getOneMarkdown_base0('body')
