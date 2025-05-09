import { generateWithRetry_atQuotaLimit } from '../heleprs.js'
import { generateText_default } from './generateText.js'

// 어떻게든 Cache를 사용할 수 있게 만들기 위해서 object 검증은 여기서 수동으로 한다
export const generateObjectWithRetry = async ({model, schema, prompt}) => {
	const result = await generateWithRetry_atQuotaLimit(generateText_default, 3, 60, {
		model,
		prompt
	})
	console.log('💬 generateObjectWithRetry 결과:', result)
	const { text } =  result

	try {
		let jsonContent = '';
		const startIndex = text.lastIndexOf('```json\n');
		const endIndex = text.lastIndexOf('\n```');

		if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
			jsonContent = text.slice(startIndex + '```json\n'.length, endIndex).trim();
		} else {
			console.error('LLM 응답에서 JSON 콘텐츠를 추출하지 못했습니다. 원본 텍스트:', text);
			throw new Error('LLM 응답에 추출 가능한 JSON 콘텐츠가 포함되어 있지 않습니다.');
		}

		const parsedObject = JSON.parse(jsonContent)

		try {
			schema.parse(parsedObject)
			return parsedObject // 성공적인 파싱 및 유효성 검사 시에만 반환
		} catch (validationError) {
			console.error('스키마 유효성 검사에 실패했습니다:', validationError);
			console.error('잘못된 객체를 수신했습니다:', parsedObject);
			// 유효성 검사 오류 처리 (예: throw, null 반환, 피드백과 함께 재시도)
			throw new Error('LLM 출력이 스키마 유효성 검사에 실패했습니다.');
		}
	} catch (parseError) {
		console.error('JSON 파싱에 실패했습니다:', parseError);
		console.error('수신된 원본 텍스트:', text);
		// 파싱 오류 처리 (예: throw, null 반환, 재시도)
		throw new Error('LLM 출력이 유효한 JSON이 아니거나 추출할 수 없습니다.');
	}
}