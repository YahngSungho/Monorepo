import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getAllLocales } from './getAllLocales.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const locales = getAllLocales()

const capitalizeFirstLetter = (string) => {
	if (!string) return string
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const getLanguageName = (localeCode) => {
	try {
		const languageNamer = new Intl.DisplayNames([localeCode], { type: 'language' })
		const languageNamer_en = new Intl.DisplayNames(['en'], { type: 'language' })
		const regionNamer = new Intl.DisplayNames([localeCode], { type: 'region' })
		const regionNamer_en = new Intl.DisplayNames(['en'], { type: 'region' })

		const parts = localeCode.split('-')
		const language = parts[0]
		const languageDisplay = capitalizeFirstLetter(languageNamer.of(language))
		const languageDisplay_en = capitalizeFirstLetter(languageNamer_en.of(language))

		if (parts.length > 1) {
			const region = parts[1].toUpperCase() // 지역 코드는 대문자로
			try {
				const regionDisplay = capitalizeFirstLetter(regionNamer.of(region))
				const regionDisplay_en = capitalizeFirstLetter(regionNamer_en.of(region))
				if (regionDisplay) {
					return {
						label: `${languageDisplay} (${regionDisplay})`,
						label_en: `${languageDisplay_en} (${regionDisplay_en})`,
						value: localeCode,
					}
				}
				return {
					label: `${languageDisplay}`,
					label_en: `${languageDisplay_en}`,
					value: localeCode,
				}
			} catch {
				const language0 = capitalizeFirstLetter(languageNamer.of(localeCode))
				const language0_en = capitalizeFirstLetter(languageNamer_en.of(localeCode))
				if (language0 && language0.includes('(') && language0.endsWith(')')) {
					const openParenIndex = language0.lastIndexOf('(')
					if (openParenIndex > 0 && language0[openParenIndex - 1] !== ' ') {
						const part1 = capitalizeFirstLetter(language0.slice(0, Math.max(0, openParenIndex)))
						const part2 = capitalizeFirstLetter(language0.slice(Math.max(0, openParenIndex)))
						return {
							label: `${part1} (${part2})`,
							label_en: `${part1} (${part2})`,
							value: localeCode,
						}
					}
				}
				return {
					label: `${language0}`,
					label_en: `${language0_en}`,
					value: localeCode,
				}
			}
		}
		return {
			label: `${languageDisplay}`,
			label_en: `${languageDisplay_en}`,
			value: localeCode,
		}
	} catch (error) {
		console.error('Error getting language and region name:', error)
		return localeCode
	}
}

export const allLanguages = locales.map(getLanguageName)

const outputPath = path.join(__dirname, '../messages-helpers/languages-info.json')
fs.writeFileSync(outputPath, JSON.stringify(allLanguages, null, 2))

console.log(`Language info saved to ${outputPath}`)
