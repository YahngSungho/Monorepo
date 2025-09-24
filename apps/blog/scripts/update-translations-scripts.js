import { getAbsolutePath } from '@library/helpers/fs-sync'
import { updateTranslations_action } from '@library/scripts/markdown'

import { APP_NAME, baseLocales } from '../src/lib/info.js'

const rootPath = getAbsolutePath(import.meta.url, '../markdowns/')
const helperPath = getAbsolutePath(import.meta.url, './')
await updateTranslations_action(APP_NAME, baseLocales, rootPath, helperPath)
