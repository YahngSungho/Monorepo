import { getAbsolutePath } from '@library/helpers/fs-sync'
import { updateTranslations_action } from '@library/scripts/markdown'

import { APP_NAME } from '../info.js'

const rootPath = getAbsolutePath(import.meta.url, '../')
const helperPath = getAbsolutePath(import.meta.url, './')
await updateTranslations_action(APP_NAME, rootPath, helperPath)
