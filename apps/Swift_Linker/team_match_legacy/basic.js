import * as R from 'ramda'
import { Maybe, Validator } from '../../../utilities/monads/monads.js'
import { getConditions } from './config_conditions.js'

/**
 * @typedef {import('./config_conditions.js').Config} Config
 * @typedef {import('./config_conditions.js').Condition} Condition
 */

// Todo: 일단 고 수준에서 정리하기가 필요하다!

// Todo: 일단 에러 뜨는 것들 부터 수정
// Todo: 함수들마다 타입 분류 - maybe, array 외에도 array가 depth가 몇인지도 분류해야함

// Todo: 각 함수마다 conditions 작성하고 .isValidWith에 반영
// Todo: conditions에 사용될 element condition들도 미리 작성해서 가져다 쓸 수 있음

// Todo: 역할이나 그런 것마다 숫자 말고 토큰 같은 걸로 대체하기. 대체 가능한 멤버들마다. avoidGroups처럼 이름 지정 안 된 특성들의 경우엔 이름 생성해서 그걸로 표시하기. 이 경우엔 A B C면 된다

const sortBySize = R.curry(
	/**
	 * @param {Validator<Config>} validatorConfig
	 * @param {Maybe<number[][]>} maybeNestedArray
	 * @returns {Maybe<number[][]>}
	 */

	(validatorConfig, maybeNestedArray) => {
		if (!validatorConfig.isValidWith(getConditions(['size']))) {
			return Maybe.of(null)
		}

		return maybeNestedArray.chain((array) => {
			const config = validatorConfig.getConfig()
			const { size } = config

			let initArray = []
			let lastArray = array
			if (size) {
				initArray = R.filter((subArray) => subArray.length === size, array)
				lastArray = R.reject((subArray) => subArray.length === size, array)
			}

			lastArray = R.sort((subArray1, subArray2) => subArray1.length - subArray2.length, lastArray)
			return Maybe.of(R.concat(initArray, lastArray))
		})
	},
)

// Tests
sortBySize(
	Validator.of({ size: 2 }),
	Maybe.of([
		[3, 4, 5],
		[1, 2, 3, 5],
		[4, 5, 6, 8, 10],
		[10, 11],
	]),
) /* ? */
sortBySize(
	Validator.of({ size: 0 }),
	Maybe.of([
		[3, 4, 5],
		[1, 2, 3, 5],
		[4, 5, 6, 8, 10],
		[10, 11],
	]),
) /* ? */

// ---

const splitArrayBySize = R.curry((validatorConfig, array) => {
	if (!validatorConfig.isValidWith()) {
		return Maybe.of(null)
	}

	const config = validatorConfig.getConfig()
	const { distribute, size, threshold } = config
	const splittedArray = R.splitEvery(size, array)

	if (splittedArray.length > 1) {
		const lastArray = R.last(splittedArray)
		if (
			Array.isArray(lastArray) &&
			lastArray.length !== size &&
			distribute &&
			lastArray.length < threshold
		) {
			const splittedInitArray = R.dropLast(1, splittedArray)
			const arrayNumber = splittedInitArray.length
			R.addIndex(R.forEach)((element, index) => {
				const targetIndex = index % arrayNumber
				const targetArray = splittedInitArray[targetIndex]
				if (Array.isArray(targetArray)) {
					targetArray.push(element)
				}
			})(lastArray)

			return Maybe.of(splittedInitArray)
		}
	}

	return Maybe.of(splittedArray)
})

// Tests
splitArrayBySize(Validator.of({ size: 2 }), [1, 2, 3, 4, 5, 6, 7])
sortBySize(
	Validator.of({ size: 2 }),
	splitArrayBySize(Validator.of({ size: 2 }), [1, 2, 3, 4, 5, 6, 7]),
) /* ? */
splitArrayBySize(Validator.of({ distribute: true, size: 2 }), [1, 2, 3, 4, 5, 6, 7])

/**
 * @param {Validator<Config>} validatorConfig
 * @param {number[]} array
 * @returns {Maybe<number[][]>}
 */
const splitArrayByNumber = R.curry(
	/**
	 * @param {Validator<Config>} validatorConfig
	 * @param {number[]} array
	 * @returns {Maybe<number[][]>}
	 */

	(validatorConfig, array) => {
		if (!validatorConfig.isValidWith()) {
			return Maybe.of(null)
		}

		const config = validatorConfig.getConfig()
		const { number } = config

		const size = Math.floor(array.length / number)
		if (size === 0) {
			const splitBy1 = R.splitEvery(1, array)
			const remainedNumber = number - splitBy1.length
			const lastArray = R.map(() => [], R.range(0, remainedNumber))
			return Maybe.of(R.concat(splitBy1, lastArray))
		}

		const newValidator = validatorConfig.mapValue((config) => ({
			...config,
			distribute: true,
			size,
			threshold: size,
		}))
		const result = splitArrayBySize(newValidator, array)
		validatorConfig.mergeErrors(newValidator)
		return result
	},
)

// Tests
splitArrayByNumber(Validator.of({ number: 3 }), R.range(1, 11))
splitArrayByNumber(Validator.of({ number: 3 }), R.range(1, 34))
splitArrayByNumber(Validator.of({ number: 3 }), R.range(1, 33))
splitArrayByNumber(Validator.of({ number: 3 }), R.range(1, 22))
splitArrayByNumber(Validator.of({ number: 3 }), R.range(1, 23))
splitArrayByNumber(Validator.of({ number: 8 }), R.range(1, 5))

const splitArrayWithSizesFixed = R.curry((validatorConfig, array) => {
	const conditions = [conditions.sizesFixed]

	if (!validatorConfig.isValidWith()) {
		return Maybe.of(null)
	}

	const config = validatorConfig.getConfig()
	const { number, size, sizesFixed } = config

	const mapReject = R.pipe(R.map, R.reject(R.isNil))

	let arrayInex = 0
	const initSplit = mapReject((oneSize) => {
		if (arrayInex + oneSize > array.length) {
			return Maybe.of(null)
		}

		const result = R.slice(arrayInex, arrayInex + oneSize, array)
		arrayInex += oneSize
		return Maybe.of(result)
	}, sizesFixed)

	let lastSplit = []
	if (arrayInex < array.length) {
		const remainedArray = R.slice(arrayInex, array.length, array)
		if (number) {
			const initNumber = initSplit.length
			let lastNumber = 0
			if (initNumber < number) {
				lastNumber = number - initNumber
				const newValidator = validatorConfig.mapValue((config) => ({
					...config,
					number: lastNumber,
				}))
				lastSplit = splitArrayByNumber(newValidator, remainedArray)
				validatorConfig.mergeErrors(newValidator)
			}
		} else if (size) {
			// Todo number가 있으면 size가 무시되는거 conditions에 모순 조건으로 넣기
			const newValidator = validatorConfig.mapValue((config) => ({ size, ...config }))
			lastSplit = splitArrayBySize(newValidator, remainedArray)
			validatorConfig.mergeErrors(newValidator)
		} else {
			const newValidator = validatorConfig.mapValue((config) => ({
				size: R.last(sizesFixed),
				...config,
			}))
			validatorConfig.mergeErrors(newValidator)
		}
	}

	return Maybe.of(R.concat(initSplit)).ap(lastSplit)
})

// Tests
// splitArrayWithSizesFixed(Validator.of({ size: 4, sizesFixed: [2, 2] }), R.range(1, 11))
// splitArrayWithSizesFixed(Validator.of({ size: 2, sizesFixed: [2, 2] }), R.range(1, 34))
// splitArrayWithSizesFixed(Validator.of({ size: 3, sizesFixed: [2, 2] }), R.range(1, 33))
// splitArrayWithSizesFixed(Validator.of({ size: 5, sizesFixed: [2, 2] }), R.range(1, 22))
// splitArrayWithSizesFixed(Validator.of({ size: 1, sizesFixed: [2, 2] }), R.range(1, 23))
splitArrayWithSizesFixed(Validator.of({ number: 7, size: 2, sizesFixed: [2, 2] }), R.range(1, 23))

const getNumberOfTeams = R.curry((validatorConfig, array) => {
	if (!validatorConfig.isValidWith()) {
		return Maybe.of(null)
	}

	const config = validatorConfig.getConfig()
	const { number } = config

	if (number) {
		return Maybe.of(number)
	}

	const rawSplittedArray = splitArrayBySize(validatorConfig, array)
	return Maybe.of(rawSplittedArray.getValue()?.length)
})

// Tests
getNumberOfTeams(Validator.of({ size: 2, threshold: 8 }), R.range(1, 11))
getNumberOfTeams(Validator.of({ distribute: true, size: 10, threshold: 8 }), R.range(1, 34))
getNumberOfTeams(Validator.of({ distribute: true, size: 10, threshold: 8 }), R.range(1, 38))
getNumberOfTeams(Validator.of({ distribute: true, size: 10, threshold: 8 }), R.range(1, 39))

// ---

// 이런 것들을 위한 함수를 따로 써야한다
const splitAvoidGroups = R.curry((validatorConfig, array) => {
	if (!validatorConfig.isValidWith()) {
		return Maybe.of(null)
	}

	const config = validatorConfig.getConfig()
	const { avoidGroups } = config

	const numberOfSplit = getNumberOfTeams(validatorConfig, array).getValue()

	const newValidator = validatorConfig.mapValue((config) => ({ number: numberOfSplit, ...config }))
	const result = R.map(
		(oneGroup) => splitArrayByNumber(newValidator, oneGroup).getValue(),
		avoidGroups,
	)
	validatorConfig.mergeErrors(newValidator)
	return Maybe.of(result)
})

// Tests
splitAvoidGroups(
	Validator.of({
		avoidGroups: [
			[1, 2],
			[2, 3],
		],
		size: 2,
	}),
	R.range(1, 11),
)
splitAvoidGroups(Validator.of({ avoidGroups: [R.range(1, 8), [2, 3]], size: 2 }), R.range(1, 11))

const splitGlueGroups = R.curry((validatorConfig, array) => {
	if (!validatorConfig.isValidWith()) {
		return Maybe.of(null)
	}

	const config = validatorConfig.getConfig()
	const { glueGroups } = config

	const numberOfSplit = getNumberOfTeams(validatorConfig, array).getValue()
})

// Tests
splitGlueGroups(
	Validator.of({
		glueGroups: [
			[3, 4],
			[4, 5],
			[5, 6],
		],
		size: 2,
	}),
	R.range(1, 11),
)
splitGlueGroups(Validator.of({ glueGroups: [R.range(1, 8), [2, 3]], size: 2 }), R.range(1, 11))
