import { R } from '@library/helpers/R'

import * as m from '../paraglide-output/messages.js'

export const getLanguageName = R.curry((displayLanguage, localeCode) => {
	try {
		const languageNamer = new Intl.DisplayNames([displayLanguage], { type: 'language' })
		const regionNamer = new Intl.DisplayNames([displayLanguage], { type: 'region' })

		const parts = localeCode.split('-')
		const language = parts[0]
		let languageDisplay = languageNamer.of(language)

		if (parts.length > 1) {
			const region = parts[1].toUpperCase() // 지역 코드는 대문자로
				try {
					const regionDisplay = regionNamer.of(region)
				if (regionDisplay) {
					return `${languageDisplay} (${m.region({}, {locale: displayLanguage})}: ${regionDisplay})`
				}
				return languageDisplay
				} catch {
					const language0 = languageNamer.of(localeCode)
					if (language0 && language0.includes('(') && language0.endsWith(')')) {
						const openParenIndex = language0.lastIndexOf('(');
						if (openParenIndex > 0 && language0[openParenIndex - 1] !== ' ') {
							const part1 = language0.slice(0, Math.max(0, openParenIndex));
							const part2 = language0.slice(Math.max(0, openParenIndex));
							return `${part1} ${part2}`;
						}
					}
					return language0
				}
		}
		return languageDisplay
	} catch (error) {
		console.error('Error getting language and region name:', error)
		return localeCode
	}
})

// const getLanguageNameBy = getLanguageName('en')

// console.log(getLanguageNameBy('ko-KR')) // "한국어 (대한민국)" 출력
// console.log(getLanguageNameBy('en-US')) // "영어 (미국)" 출력
// console.log(getLanguageNameBy('en-GB')) // "영어 (영국)" 출력
// console.log(getLanguageNameBy('es-ES')) // "스페인어 (스페인)" 출력
// console.log(getLanguageNameBy('fr')) // "프랑스어" 출력 (지역 정보 없음)
// console.log(getLanguageNameBy('sr-ME'))
// console.log(getLanguageNameBy('sr-Latn'))
// console.log(getLanguageNameBy('zh-Hans'))
// console.log(getLanguageNameBy('zh-Hant'))
