import { readFile } from 'node:fs/promises'

import { getAbsolutePath } from '@library/helpers/fs-sync'

export async function getPost(slug, lang) {
	const fullPath = getAbsolutePath(import.meta.url, `../../posts/${slug}/${lang}.md`)
	const value = await readFile(fullPath, 'utf8')

	return value
}