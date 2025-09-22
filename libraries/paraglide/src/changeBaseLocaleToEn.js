import { getAbsolutePath } from '@library/helpers/fs-sync'
import { changeBaseLocaleInFile_action } from '@library/scripts/changeBaseLocaleInFile'

if (process.env.CI) {
	await changeBaseLocaleInFile_action(
		getAbsolutePath(import.meta.url, '../project.inlang/settings.json'),
		'en',
	)
}
