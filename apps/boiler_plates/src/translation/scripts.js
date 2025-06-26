import { getAbsolutePath } from '@library/helpers/fs-sync'
import { markdownScript_action } from '@library/scripts/markdown'

const rootPath = getAbsolutePath(import.meta.url, '../')
const helperPath = getAbsolutePath(import.meta.url, './')
await markdownScript_action(rootPath, helperPath)
