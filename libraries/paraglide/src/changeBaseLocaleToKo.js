import { getAbsolutePath } from '@library/helpers/fs-sync'
import { changeBaseLocaleInFile_action } from '@library/scripts/changeBaseLocaleInFile'

await changeBaseLocaleInFile_action(getAbsolutePath(import.meta.url, '../project.inlang/settings.json'), 'ko')
