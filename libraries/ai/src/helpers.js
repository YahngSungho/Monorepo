import { R } from '@library/helpers/R'

/**
 * 지정된 횟수만큼 재시도 로직과 함께 generateObject를 실행합니다. 'quota' 에러 발생 시에만 재시도합니다.
 *
 * @param {function} generateFunc - GenerateObject 또는 generateText 등의 함수
 * @param {number} [maxRetries=3] - 최대 재시도 횟수. Default is `3`
 * @param {number} [delaySeconds=60] - 재시도 간 지연 시간(초). Default is `60`
 * @param {object} options - GenerateObject 옵션 (model, schema, prompt)
 * @returns {Promise<object>} - GenerateObject 결과의 object
 * @throws {Error} - 최대 재시도 후에도 실패하거나 'quota' 이외의 에러 발생 시
 */
export const generateWithRetry_atQuotaLimit = R.curry(
	async (generateFunction, maxRetries, delaySeconds, options) => {
		let attempts = 0
		while (attempts < maxRetries) {
			try {
				const result = await generateFunction(
					options.model,
					options.config,
					options.cache,
					options.contents,
				)
				return result // 성공 시 결과 반환
			} catch (error) {
				attempts++
				const errorMessage = error?.message?.toLowerCase()
				// 에러 메시지에 'quota'가 포함되고 재시도 횟수가 남았는지 확인 (대소문자 무시)
				if (
					attempts < maxRetries &&
					(errorMessage?.includes('quota') || errorMessage?.includes('later'))
				) {
					console.log(
						`Quota 오류 감지됨. ${delaySeconds}초 후 ${attempts + 1}/${maxRetries}번째 재시도를 실행합니다...`,
					)
					await new Promise((resolve) => {
						setTimeout(resolve, delaySeconds * 1000)
					})
				} else {
					// 'quota' 에러가 아니거나 재시도 횟수를 모두 소진한 경우
					console.error(`${attempts}번 시도 후 실패했습니다. 오류:`, error)
					throw error // 마지막 에러를 다시 throw
				}
			}
		}
		// 이론적으로는 여기까지 도달하지 않아야 하지만, 만약을 대비한 에러 처리
		throw new Error(
			`예기치 않은 제어 흐름으로 인해 ${maxRetries}번의 시도 후 generateObject가 실패했습니다.`,
		)
	},
)
