import * as R from 'ramda'

/**
 * 두 배열 간에 공통된 요소가 있는지 확인하는 함수
 *
 * @function hasCommonElements
 * @param {Array} list1
 * @param {Array} list2
 * @returns {boolean} - 공통된 요소가 있으면 true, 없으면 false
 */
const hasCommonElements = (list1, list2) => !R.isEmpty(R.intersection(list1, list2))

// 한 배열 안에 중복되는 요소가 이미 있는지 확인
const areDisjoint = (array) => array.length === R.uniq(array).length

/**
 * 모든 배열들이 서로소인지 확인하는 함수
 *
 * @function areAllDisjoint
 * @param {Array[]} arrays 배열들의 배열
 * @returns {boolean} 모든 배열들이 서로소이면 true, 아니면 false
 */
const areAllDisjoint = (arrays) => {
	// 한 배열 안에 중복되는 요소가 이미 있는지 확인
	if (arrays.some((array) => !areDisjoint(array))) {
		return false
	}

	// 모든 배열 쌍에 대해 공통된 요소가 있는지 확인
	for (let i = 0; i < arrays.length; i++) {
		for (let index = i + 1; index < arrays.length; index++) {
			if (hasCommonElements(arrays[i], arrays[index])) {
				return false
			}
		}
	}

	return true
}

// Test
console.log(
	areAllDisjoint([
		[1, 2],
		[3, 4],
	]),
)

export { areAllDisjoint, areDisjoint }
