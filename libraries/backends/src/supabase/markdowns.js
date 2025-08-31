import { supabase } from './init.js'

/**
 * Supabase에 마크다운 리스트를 저장하는 함수야.
 *
 * @param {Array<{
 *   body: string,
 *   frontmatter: object,
 *   key: string,
 *   locale: string,
 *   projectName: string,
 *   mermaidSVGObject: object,
 * }>} markdownList - 저장할 마크다운 객체 배열
 * @returns {Promise<void>} 에러 발생 시 예외를 throw해
 */
export async function saveMarkdownList_action(markdownList) {
	const dateNow = new Date().toISOString()
	const { error } = await supabase.from('markdowns').upsert(
		markdownList.map((markdown) => ({
			body: markdown.body,
			frontmatter: markdown.frontmatter,
			key: markdown.key,
			locale: markdown.locale,
			project_name: markdown.projectName,
			mermaid_svg_object: markdown.mermaidSVGObject,
			updated_at: dateNow,
		})),
		{ ignoreDuplicates: false, onConflict: 'project_name,key,locale' },
	)

	if (error) {
		throw error
	}
}

export async function getMarkdownListByProjectName(projectName, exceptLangs) {
	const { data, error } = await supabase
		.from('markdowns')
		.select('body, key, locale')
		.eq('project_name', projectName)
		.not('locale', 'in', JSON.stringify(exceptLangs).replace('[', '(').replace(']', ')'))

	if (error) {
		throw error
	}

	return data
}

export async function getOneMarkdownBody(projectName, locale, key) {
	const { data, error } = await supabase
		.from('markdowns')
		.select('body, mermaid_svg_object')
		.eq('project_name', projectName)
		.eq('locale', locale)
		.eq('key', key)

	if (error) {
		throw error
	}

	return data[0]
}

export async function getMarkdownFrontmatterList(projectName, locale) {
	const { data, error } = await supabase
		.from('markdowns')
		.select('key, frontmatter')
		.eq('project_name', projectName)
		.eq('locale', locale)

	if (error) {
		throw error
	}

	return data
}
