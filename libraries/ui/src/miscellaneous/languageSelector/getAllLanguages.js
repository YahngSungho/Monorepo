import { getAllLocales } from '@library/paraglide/getAllLocales'

import allLanguageInfo from './languages-info.json' with { type: 'json' }

const allLocales = getAllLocales()
export const allLanguages = allLanguageInfo.filter((info) => allLocales.includes(info.value))
