import { getAllLocales } from './getAllLocales.js'

import allLanguageInfo from '../messages-helpers/languages-info.json' with { type: 'json' }

const allLocales = getAllLocales()

if (allLocales.some((locale) => allLanguageInfo.every((info) => info.value !== locale))) {
	throw new Error(`어떤 locale이 languages-info.json에 없음. pnpm run get-all-language-info 실행해라`)
}

export const allLanguages = allLanguageInfo.filter((info) => allLocales.includes(info.value))
