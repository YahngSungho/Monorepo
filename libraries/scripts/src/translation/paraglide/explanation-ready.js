import { readFile, writeFile } from 'node:fs/promises';

import { getAbsolutePath } from '@library/helpers/fs-sync'

const missingExplanationsPath = getAbsolutePath('../../../../paraglide/messages-helpers/missing-explanations.json', import.meta.url)
const explanationPath = getAbsolutePath('../../../../paraglide/messages-helpers/explanations.json', import.meta.url)
const koPath = getAbsolutePath('../../../../paraglide/messages/ko.json', import.meta.url)

export async function getMissingExplanations() {
	const explanations = JSON.parse(await readFile(explanationPath, 'utf8'))
	const ko = JSON.parse(await readFile(koPath, 'utf8'))

	const missingExplanations = {}

	for (const key of Object.keys(ko)) {
		if (!explanations[key]) {
			missingExplanations[key] = ko[key]
		}
	}

	await writeFile(missingExplanationsPath, JSON.stringify(missingExplanations, undefined, 2))

}
