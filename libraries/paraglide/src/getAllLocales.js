// import fs from 'node:fs'

// import { getAbsolutePath } from '@library/helpers/fs-sync'
import settings from '../project.inlang/settings.json' with { type: 'json' }

// const settingPath = getAbsolutePath(
// \timport.meta.url,
// \t'../project.inlang/settings.json',
// )
// const settings = JSON.parse(fs.readFileSync(settingPath, 'utf8'))
export function getAllLocales() {
	return settings.locales
}