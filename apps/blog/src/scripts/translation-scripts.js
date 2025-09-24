import { getAbsolutePath } from '@library/helpers/fs-sync'
import { translationScript_action } from '@library/scripts/markdown'

import { APP_NAME } from '$lib/info.js'

const rootPath = getAbsolutePath(import.meta.url, '../../posts/')
const helperPath = getAbsolutePath(import.meta.url, './')
await translationScript_action(APP_NAME, rootPath, helperPath)
