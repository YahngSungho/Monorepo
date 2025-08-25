import { getAbsolutePath } from '@library/helpers/fs-sync'
import { markdownScript_action } from '@library/scripts/markdown'

import { APP_NAME } from '../info.js'

const rootPath = getAbsolutePath(import.meta.url, '../../posts/')
const helperPath = getAbsolutePath(import.meta.url, './')
await markdownScript_action(APP_NAME, rootPath, helperPath)
