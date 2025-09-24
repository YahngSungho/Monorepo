import { fixMarkdownText_action } from '@library/scripts/markdown'

import { baseLocales } from '../src/lib/info.js'
import { getAbsolutePath } from '@library/helpers/fs-sync'

await fixMarkdownText_action(getAbsolutePath(import.meta.url, '../markdowns/'), baseLocales)