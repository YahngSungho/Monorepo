import { R } from '@library/helpers/R'

import { generateWithRetry_atQuotaLimit } from '../heleprs.js'
import { generateText } from './generateText.js'
import { latestModel } from './modelNames.js'

// 어떻게든 Cache를 사용할 수 있게 만들기 위해서 object 검증은 여기서 수동으로 한다
export const generateObjectWithRetry = R.curry(async (model, cache, schema, prompt) => {
	const result = await generateWithRetry_atQuotaLimit(generateText, 3, 60, {
		model,
		contents: prompt,
		cache,
	})

	try {
		const parsedObject = JSON.parse(result)
		try {
			schema.parse(parsedObject)
			return parsedObject // 성공적인 파싱 및 유효성 검사 시에만 반환
		} catch (validationError) {
			console.error('스키마 유효성 검사에 실패했습니다:', validationError)
			console.error('잘못된 객체를 수신했습니다:', parsedObject)
			// 유효성 검사 오류 처리 (예: throw, null 반환, 피드백과 함께 재시도)
			throw new Error('LLM 출력이 스키마 유효성 검사에 실패했습니다.')
		}
	} catch (parseError) {
		console.error('JSON 파싱에 실패했습니다:', parseError)
		console.error('수신된 원본 텍스트:', result)
		// 파싱 오류 처리 (예: throw, null 반환, 재시도)
		throw new Error('LLM 출력이 유효한 JSON이 아니거나 추출할 수 없습니다.')
	}
})

export const generateObjectWithRetry_latestModel = generateObjectWithRetry(latestModel)
