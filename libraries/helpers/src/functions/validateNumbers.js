import { R } from '../library-wrappers/R.js'

export const validateNumbers = R.curry((targetMessages, translatedMessages) => {
	const keys = Object.keys(translatedMessages)
	if (keys.length !== Object.keys(targetMessages).length) {
		return false
	}

	// 1. 모든 키가 양의 정수 형태의 문자열인지 확인
	const numericKeys = keys.map((key) => Number.parseInt(key, 10))
	if (
		numericKeys.some(
			(num) =>
				Number.isNaN(num) ||
				num <= 0 ||
				!Number.isInteger(num) ||
				String(num) !== keys[numericKeys.indexOf(num)],
		)
	) {
		// 정수가 아니거나, 0 이하이거나, 원래 문자열과 다른 경우 실패
		return false
	}

	// 2. 키가 1부터 시작하여 연속적인지 확인
	numericKeys.sort((a, b) => a - b) // 숫자 기준으로 정렬
	for (const [i, numericKey] of numericKeys.entries()) {
		if (numericKey !== i + 1) {
			return false // 연속적이지 않음 (1부터 시작 가정)
		}
	}

	return true
})

// const result = validateNumbers({
// 		'1': {
// 			ko: '안녕하세요, 세상!',
// 			explanation: '간단한 인사말입니다.',
// 		},
// 		'2': {
// 			ko: '이것은 **굵은** 텍스트입니다.',
// 			explanation: '마크다운 굵은 스타일이 포함된 텍스트입니다.',
// 		},
// 	}, JSON.parse('{"1":"Hello, world!","2":"This is **bold** text."}'))

// console.log('💬 result:', result)
