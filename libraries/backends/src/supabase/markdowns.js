import { supabase } from './init.js'

/**
 * Supabase에 마크다운 리스트를 저장하는 함수야.
 *
 * @param {Array<{
 *   body: string,
 *   frontmatter: object,
 *   key: string,
 *   locale: string,
 *   projectName: string
 * }>} markdownList - 저장할 마크다운 객체 배열
 * @returns {Promise<void>} 에러 발생 시 예외를 throw해
 */
export async function saveMarkdownList_action(markdownList) {
	const dateNow = new Date().toISOString()
	const { error } = await supabase
.from('markdowns')
.upsert(markdownList.map(markdown => ({
	body: markdown.body,
	frontmatter: markdown.frontmatter,
	key: markdown.key,
	locale: markdown.locale,
	project_name: markdown.projectName,
	updated_at: dateNow
})), { ignoreDuplicates: false, onConflict: 'project_name,key,locale' })
.select()

	if (error) {
		throw error
	}
}

// Todo: getOneMarkdown 추가

// Todo: getMarkdownListMetadata 추가