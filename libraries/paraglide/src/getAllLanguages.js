import fs from 'node:fs'

import { getAbsolutePath } from '@library/helpers/fs-sync'

const settingPath = getAbsolutePath(
	import.meta.url,
	'../../../paraglide/project.inlang/settings.json',
)
const settings = JSON.parse(fs.readFileSync(settingPath, 'utf8'))
