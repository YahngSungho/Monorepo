import path from 'node:path'

import { saveMarkdownList_action } from '@library/third-parties/supabase_admin'
import { writeFile_async } from '@library/helpers/fs-async'
import { getFrontmatterObject } from '@library/helpers/markdown'

import { getNewCache } from '../translation/helpers.js'
import { dictFolderPath } from '../translation/markdown/translation.js'
import { getMermaidSVGObject } from './getMermaidSVGObject.js'

export async function saveFiles_action(
	projectName,
	helperFolderPath,
	translatedLanguageMap,
	updatedMessagesPerLang,
	explanations,
	languageMessageMap_baseLocales,
) {
	const markdownPromiseListForSave = []

	for (const [language, messageMap] of Object.entries(translatedLanguageMap)) {
		if (messageMap.missingMessageKeys.length === 0) {
			continue
		}

		await writeFile_async(
			path.join(dictFolderPath, `${language}.json`),
			JSON.stringify(
				{
					$schema: 'https://inlang.com/schema/inlang-message-format',
					...messageMap.newDictionary,
				},
				undefined,
				2,
			),
		)

		// messages 배열을 순회하며 각 항목을 '최종 결과 객체를 반환하는 프로미스'로 변환합니다.
		const promises = Object.entries(messageMap.translatedMessages).map(
			async ([messageKey, messageValue]) => {
				// 1. 비동기 작업을 병렬로 실행
				const mermaidSVGObject = await getMermaidSVGObject(messageValue)

				// 2. 필요한 모든 데이터를 포함한 최종 객체를 반환
				return {
					body: messageValue,
					frontmatter: getFrontmatterObject(messageValue),
					key: messageKey,
					locale: language,
					mermaidSVGObject, // await로 얻은 결과를 바로 사용
					projectName,
				}
			},
		)

		markdownPromiseListForSave.push(...promises)
	}

	for (const [lang, updatedMessages] of Object.entries(updatedMessagesPerLang)) {
		// messages 배열을 순회하며 각 항목을 '최종 결과 객체를 반환하는 프로미스'로 변환합니다.
		const promises = Object.entries(updatedMessages).map(async ([messageKey, messageValue]) => {
			// 1. 비동기 작업을 병렬로 실행
			const mermaidSVGObject = await getMermaidSVGObject(messageValue)

			// 2. 필요한 모든 데이터를 포함한 최종 객체를 반환
			return {
				body: messageValue,
				frontmatter: getFrontmatterObject(messageValue),
				key: messageKey,
				locale: lang,
				mermaidSVGObject, // await로 얻은 결과를 바로 사용
				projectName,
			}
		})

		markdownPromiseListForSave.push(...promises)
	}

	await saveMarkdownList_action(await Promise.all(markdownPromiseListForSave))

	const newCache = getNewCache(languageMessageMap_baseLocales, explanations)
	await writeFile_async(
		path.join(helperFolderPath, 'cache.json'),
		JSON.stringify(newCache, undefined, 2),
	)
}
