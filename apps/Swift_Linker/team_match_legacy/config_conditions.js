import * as yup from 'yup'

/**
 * @module types
 */

/**
 * @typedef {Object} Config
 * @property {number} size - 크기
 * @property {number[]} sizesFixed - 고정 크기 배열
 * @property {boolean} distribute - 분배 여부
 * @property {number} threshold - 임계값
 * @property {number} number - 숫자
 * @property {number[][]} avoidGroups - 그룹 회피 배열
 * @property {number[][]} glueGroups - 그룹 접착 배열
 */
/**
 * @typedef {Object} Condition
 * @property {string} error - 오류 메시지
 * @property {(config: Config) => boolean} function - 조건 함수
 */

/**
 * @type {Object.<string, Condition>}
 * @description 여러 조건을 포함하는 객체
 */
const conditions = {
	/**
	 * @type {Condition}
	 * @description size가 0보다 큰지 확인하는 조건
	 */
	size: {
		error: 'size must be greater than 0',
		function: ({ size }) => yup.number().integer().positive().isValidSync(size),
	},
	/**
	 * @type {Condition}
	 * @description sizesFixed 배열의 모든 요소가 0보다 큰지 확인하는 조건
	 */
	sizesFixed: {
		error: 'Fixed size must be greater than 0',
		function: ({ sizesFixed }) =>
			yup.array().of(yup.number().integer().positive()).isValidSync(sizesFixed),
	},
}

// ---

/**
 * @export
 * @param {string[]} picks - 조건 선택 배열
 * @returns {Condition[]}
 */
export function getConditions(picks) {
	return picks.map((pick) => {
		const condition = conditions[pick]
		if (!condition) {
			throw new Error(`Unknown condition: ${pick}`)
		}

		if (pick === 'sizesFixed') {
			console.log(condition)
		}

		return condition
	})
}

getConditions(['size', 'sizesFixed']) /* ? */
