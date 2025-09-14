import { supabase } from './init.js'

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

export async function getOneMarkdown_base(projectName, locale, key) {
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
