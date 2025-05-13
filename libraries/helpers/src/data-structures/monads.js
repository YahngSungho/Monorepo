// @ts-nocheck
import { inspect } from 'node:util'

import { create } from '../library-wrappers/mutative.js'
import { R } from '../library-wrappers/R.js'

export const createCompose = R.curry(
	(F, G) =>
		class Compose {
			constructor(x) {
				this.$value = x
			}

			// ----- Pointed (Compose F G)
			static of(x) {
				return new Compose(F(G(x)))
			}

			// ----- Applicative (Compose F G)
			ap(f) {
				return f.map(this.$value)
			}

			[inspect.custom]() {
				return `Compose(${inspect(this.$value)})`
			}

			// ----- Functor (Compose F G)
			map(function_) {
				return new Compose(this.$value.map((x) => x.map(function_)))
			}
		},
)

export class ObjectMonad {
	constructor(object) {
		this.$object = object
	}

	static empty() {
		return ObjectMonad.of({})
	}

	// ----- Pointed ObjectMonad
	static of(obj) {
		return new ObjectMonad(obj)
	}

	concat(...anotherObjects) {
		return ObjectMonad.of(Object.assign(this.$object, ...anotherObjects))
	}

	// ----- Functor ObjectMonad
	create(callback) {
		return ObjectMonad.of(create(this.$object, callback))
	}

	[inspect.custom]() {
		return `ObjectMonad(${inspect(this.$object)})`
	}

	join() {
		// 재귀적으로 객체를 탐색하며 ObjectMonad를 푸는 내부 함수
		const deepUnwrap = (obj) => {
			const newObject = {}
			for (const [key, value] of Object.entries(obj)) {
				if (value instanceof ObjectMonad) {
					// ObjectMonad 인스턴스면 내부 객체($object)에 대해 재귀적으로 호출하여 값을 얻음
					newObject[key] = deepUnwrap(value.$object)
				} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					// 일반 객체(ObjectMonad가 아니고, null/배열이 아닌)면 재귀적으로 호출
					newObject[key] = deepUnwrap(value)
				} else {
					// 그 외의 경우 (primitive 값, 배열 등)는 그대로 유지
					newObject[key] = value
				}
			}
			return newObject
		}

		// 현재 ObjectMonad의 내부 객체($object)에 대해 deepUnwrap을 호출하고
		// 결과를 새 ObjectMonad로 감싸서 반환
		return ObjectMonad.of(deepUnwrap(this.$object))
	}

	map(valueCallback = R.identity, keyCallback = R.identity) {
		const newObject = {}
		for (const [key, value] of Object.entries(this.$object)) {
			newObject[keyCallback(key)] = valueCallback(value)
		}

		return ObjectMonad.of(newObject)
	}
}

export class ListMonad {
	constructor(xs) {
		this.$value = xs
	}

	static empty() {
		return ListMonad.of([])
	}

	// ----- Pointed List
	static of(x) {
		return new ListMonad([x])
	}

	concat(x) {
		return ListMonad.of(this.$value.concat(x))
	}

	create(callback) {
		return ListMonad.of(create(this.$value, callback))
	}

	[inspect.custom]() {
		return `ListMonad(${inspect(this.$value)})`
	}

	// ----- Functor List
	map(function_) {
		return ListMonad.of(this.$value.map(function_))
	}

	// ----- Traversable List
	sequence(of) {
		return this.traverse(of, R.identity)
	}

	traverse(of, function_) {
		return this.$value.reduce(
			(f, a) =>
				function_(a)
					.map((b) => (bs) => bs.concat(b))
					.ap(f),
			ListMonad.of([]),
		)
	}
}

export class Identity {
	constructor(x) {
		this.$value = x
	}

	// ----- Pointed Identity
	static of(x) {
		return new Identity(x)
	}

	// ----- Applicative Identity
	ap(f) {
		return f.map(this.$value)
	}

	// ----- Monad Identity
	chain(function_) {
		return this.map(function_).join(',')
	}

	[inspect.custom]() {
		return `Identity(${inspect(this.$value)})`
	}

	join() {
		return this.$value
	}

	// ----- Functor Identity
	map(function_) {
		return Identity.of(function_(this.$value))
	}

	// ----- Traversable Identity
	sequence(of) {
		return this.traverse(of, R.identity)
	}

	traverse(of, function_) {
		return function_(this.$value).map(Identity.of)
	}
}

export class IO {
	constructor(function_) {
		this.unsafePerformIO = function_
	}

	// ----- Pointed IO
	static of(x) {
		return new IO(() => x)
	}

	// ----- Applicative IO
	ap(f) {
		return this.chain((function_) => f.map(function_))
	}

	// ----- Monad IO
	chain(function_) {
		return this.map(function_).join(',')
	}

	[inspect.custom]() {
		return 'IO(?)'
	}

	join() {
		return new IO(() => this.unsafePerformIO().unsafePerformIO())
	}

	// ----- Functor IO
	map(function_) {
		return new IO(R.compose(function_, this.unsafePerformIO))
	}
}

/**
 * Maybe monad represents an optional value that either holds a value of type T or nothing.
 *
 * @template T - The type of the inner value that Maybe holds.
 */
export class Maybe {
	get isJust() {
		return !this.isNothing
	}

	get isNothing() {
		return this.$value === null || this.$value === undefined
	}

	constructor(x) {
		this.$value = x
	}

	// ----- Pointed Maybe
	static of(x) {
		return new Maybe(x)
	}

	// ----- Applicative Maybe
	ap(f) {
		return this.isNothing ? this : f.map(this.$value)
	}

	// ----- Monad Maybe
	chain(function_) {
		return this.map(function_).join(',')
	}

	getOrElse(defaultValue) {
		return this.isNothing ? defaultValue : this.$value
	}

	getValue() {
		return this.$value
	}

	[inspect.custom]() {
		return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
	}

	join() {
		return this.isNothing ? this : this.$value
	}

	// ----- Functor Maybe
	/**
	 * Applies a function to the inner value of Maybe, if it exists.
	 *
	 * @template U
	 * @param {function(T): U} function_ - A function to apply to the inner value.
	 * @returns {Maybe<U>} - A new Maybe instance with the transformed value.
	 */
	map(function_) {
		return this.isNothing ? this : Maybe.of(function_(this.$value))
	}

	// ----- Traversable Maybe
	sequence(of) {
		return this.traverse(of, R.identity)
	}

	traverse(of, function_) {
		return this.isNothing ? of(this) : function_(this.$value).map(Maybe.of)
	}
}

export class Task {
	constructor(fork) {
		this.fork = fork
	}

	// ----- Pointed (Task a)
	static of(x) {
		return new Task((_, resolve) => resolve(x))
	}

	static rejected(x) {
		return new Task((reject, _) => reject(x))
	}

	// ----- Applicative (Task a)
	ap(f) {
		return this.chain((function_) => f.map(function_))
	}

	// ----- Monad (Task a)
	chain(function_) {
		return new Task((reject, resolve) =>
			this.fork(reject, (x) => function_(x).fork(reject, resolve)),
		)
	}

	[inspect.custom]() {
		return 'Task(?)'
	}

	join() {
		return this.chain(R.identity)
	}

	// ----- Functor (Task a)
	map(function_) {
		return new Task((reject, resolve) => this.fork(reject, R.compose(resolve, function_)))
	}
}

export { default as Validator } from './validator.js'
