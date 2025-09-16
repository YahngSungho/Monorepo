import { inspect } from 'node:util'

import { R } from '../library-wrappers/R'

/**
 * @typedef {Object} Condition
 * @property {string} error - 오류 메시지
 * @property {(config: Object) => boolean} function - 조건 함수
 */

const getErrors = R.curry(
	/**
	 * 조건 배열에 대한 오류 배열을 반환하는 함수
	 *
	 * @function getErrors
	 * @param {Object} config - 조건 배열에 대한 config
	 * @param {Condition[]} conditions - 조건 배열
	 * @returns {string[]} - 오류 배열
	 */

	(config, conditions) =>
		R.applyPipe(
			R.reject((condition) => condition.function(config)),
			R.map((condition) => condition.error),
		)(conditions),
)

/** @template T - The type of the inner value that Validator holds. */
export default class Validator {
	/**
	 * @param {Object} config - 설정 객체
	 * @param {string[]} [errors=[]] - 오류 배열. Default is `[]`
	 */
	constructor(config, errors = []) {
		/** @type {Object} */
		this.config = config
		/** @type {string[]} */
		this.errors = errors
	}

	/**
	 * @param {string[]} errors - 오류 배열
	 * @returns {Validator}
	 */
	static fail(errors) {
		return new Validator(undefined, errors)
	}

	// ----- Pointed Validator
	/**
	 * @param {Object} config - 설정 객체
	 * @returns {Validator}
	 */
	static of(config) {
		return new Validator(config)
	}

	/**
	 * @param {string} error - 오류 메시지
	 * @returns {Validator}
	 */
	addError(error) {
		if (this.isNothing()) {
			return this
		}

		return new Validator(this.config, R.append(error, this.errors))
	}

	/**
	 * @param {string[]} errors - 오류 배열
	 * @returns {Validator}
	 */
	addErrors(errors) {
		if (this.isNothing()) {
			return this
		}

		return new Validator(this.config, R.concat(this.errors)(errors))
	}

	// ----- Applicative Validator
	/**
	 * @param {Validator} validator - Validator 인스턴스
	 * @returns {Validator}
	 */
	ap(validator) {
		if (this.isNothing()) {
			return this
		}

		// 여기서 this.config는 function: (config, errors) -> { config, errors }
		return validator.map(this.config)
	}

	/** @returns {Object} - 설정 객체 */
	getConfig() {
		return this.config
	}

	/** @returns {string[]} - 오류 배열 */
	getErrors() {
		return this.errors
	}

	/** @returns {{ config: Object; errors: string[] }} - 내부 값 객체 */
	getInnerValue() {
		return { config: this.config, errors: this.errors }
	}

	/** @returns {string} - 커스텀 인스펙트 결과 */
	[inspect.custom]() {
		return this.isNothing() ? `Invalid(${inspect(this.errors)})` : `Valid(${inspect(this.config)})`
	}

	/** @returns {boolean} - 설정 객체가 null 또는 undefined인지 여부 */
	isNothing() {
		return this.config === null || this.config === undefined
	}

	/**
	 * Mutable Method
	 *
	 * @param {Condition[]} newConditions - 새로운 조건 배열
	 * @returns {boolean} - 전체 조건 배열이 유효한지 여부
	 */
	isValidWith(newConditions) {
		// @ts-ignore
		// file deepcode ignore WrongNumberOfArguments: Curry
		this.errors = R.concat(this.errors, getErrors(this.config)(newConditions))
		return this.errors.length === 0
	}

	/**
	 * @param {(config: Object, errors: string[]) => [Object, string[]]} function_ - 매핑 함수
	 * @returns {Validator}
	 */
	map(function_) {
		if (this.isNothing()) {
			return this
		}

		return new Validator(...function_(this.config, this.errors))
	}

	/**
	 * @param {(config: Object) => Object} function_ - 설정 매핑 함수
	 * @returns {Validator}
	 */
	mapConfig(function_) {
		if (this.isNothing()) {
			return this
		}

		return new Validator(function_(this.config), this.errors)
	}

	/**
	 * @param {(errors: string[]) => string[]} function_ - 오류 매핑 함수
	 * @returns {Validator}
	 */
	mapErrors(function_) {
		if (this.isNothing()) {
			return this
		}

		return new Validator(this.config, function_(this.errors))
	}

	/**
	 * @param {Validator | Validator[]} validators - Validator 인스턴스 또는 배열
	 * @returns {Validator}
	 */
	mergeErrors(validators) {
		// X mutable

		this.errors =
			Array.isArray(validators) ?
				R.applyPipe(
					R.map((validator) => validator.errors),
					R.flatten,
					R.concat(this.errors),
				)(validators)
			:	R.concat(this.errors, validators.errors)

		return this
	}

	// ----- Traversable Validator
	/**
	 * @param {Function} of - Applicative 함수
	 * @returns {Validator}
	 */
	sequence(of) {
		return this.traverse(of, R.identity)
	}

	/**
	 * @param {Function} of - Applicative 함수
	 * @param {Function} function_ - 매핑 함수
	 * @returns {Validator}
	 */
	traverse(of, function_) {
		if (this.isNothing()) {
			return of(this)
		}

		return function_(this.config).map(Validator.of)
	}
}

// Tests
const config1 = Validator.fail(['1'])
const config2 = Validator.fail(['2'])
const config3 = Validator.fail(['3'])

config1.mergeErrors([config2, config3])

console.log(config1)

// Tests
const gt0 = R.both(R.is(Number), R.gt(R.__, 0))

const conditions = {
	size: {
		error: 'size must be greater than 0',
		function: ({ size }) => gt0(size),
	},
	sizesFixed: {
		error: 'Fixed size must be greater than 0',
		function: ({ sizesFixed }) => R.all(gt0)(sizesFixed),
	},
}

Validator.of({ size: 2 }).isValidWith([conditions.size]) /* ? */
