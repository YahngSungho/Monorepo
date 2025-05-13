export const getLanguageName = (localeCode) => {
	try {
		const languageNamer = new Intl.DisplayNames(['en'], { type: 'language' })
		const regionNamer = new Intl.DisplayNames(['en'], { type: 'region' })

		const parts = localeCode.split('-')
		const language = parts[0]
		let languageDisplay = languageNamer.of(language)

		if (parts.length > 1) {
			const region = parts[1].toUpperCase() // 지역 코드는 대문자로
			try {
				const regionDisplay = regionNamer.of(region)
				if (regionDisplay) {
					return `${localeCode}: ${languageDisplay} (Region: ${regionDisplay})`
				}
				return `${localeCode}: ${languageDisplay}`
			} catch {
				const language0 = languageNamer.of(localeCode)
				if (language0 && language0.includes('(') && language0.endsWith(')')) {
					const openParenIndex = language0.lastIndexOf('(')
					if (openParenIndex > 0 && language0[openParenIndex - 1] !== ' ') {
						const part1 = language0.slice(0, Math.max(0, openParenIndex))
						const part2 = language0.slice(Math.max(0, openParenIndex))
						return `${localeCode}: ${part1} ${part2}`
					}
				}
				return `${localeCode}: ${language0}`
			}
		}
		return `${localeCode}: ${languageDisplay}`
	} catch (error) {
		console.error('Error getting language and region name:', error)
		return localeCode
	}
}

// console.log(getLanguageName('ko-KR')) // "한국어 (대한민국)" 출력
// console.log(getLanguageName('en-US')) // "영어 (미국)" 출력
// console.log(getLanguageName('en-GB')) // "영어 (영국)" 출력
// console.log(getLanguageName('es-ES')) // "스페인어 (스페인)" 출력
// console.log(getLanguageName('fr')) // "프랑스어" 출력 (지역 정보 없음)
// console.log(getLanguageName('sr-ME'))
// console.log(getLanguageName('sr-Latn'))
// console.log(getLanguageName('zh-Hans'))
// console.log(getLanguageName('zh-Hant'))
