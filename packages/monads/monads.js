// @ts-nocheck
import util, { inspect } from 'node:util'
import { compose, curry, identity } from 'ramda'

export {
	createCompose, Identity, IO, List, Map, Maybe, Task,
}

export { default as Validator } from './validator.js'

const createCompose = curry((F, G) => class Compose {
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

	// ----- Functor (Compose F G)
	map(function_) {
		return new Compose(this.$value.map(x => x.map(function_)))
	}

	[util.inspect.custom]() {
		return `Compose(${inspect(this.$value)})`
	}
})

class Identity {
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

	join() {
		return this.$value
	}

	// ----- Functor Identity
	map(function_) {
		return Identity.of(function_(this.$value))
	}

	// ----- Traversable Identity
	sequence(of) {
		return this.traverse(of, identity)
	}

	traverse(of, function_) {
		return function_(this.$value).map(Identity.of)
	}

	[util.inspect.custom]() {
		return `Identity(${inspect(this.$value)})`
	}
}

class IO {
	constructor(function_) {
		this.unsafePerformIO = function_
	}

	// ----- Pointed IO
	static of(x) {
		return new IO(() => x)
	}

	// ----- Applicative IO
	ap(f) {
		return this.chain(function_ => f.map(function_))
	}

	// ----- Monad IO
	chain(function_) {
		return this.map(function_).join(',')
	}

	join() {
		return new IO(() => this.unsafePerformIO().unsafePerformIO())
	}

	// ----- Functor IO
	map(function_) {
		return new IO(compose(function_, this.unsafePerformIO))
	}

	[util.inspect.custom]() {
		return 'IO(?)'
	}
}

class List {
	constructor(xs) {
		this.$value = xs
	}

	// ----- Pointed List
	static of(x) {
		return new List([x])
	}

	concat(x) {
		return new List(this.$value.concat(x))
	}

	// ----- Functor List
	map(function_) {
		return new List(this.$value.map(function_))
	}

	// ----- Traversable List
	sequence(of) {
		return this.traverse(of, identity)
	}

	traverse(of, function_) {
		return this.$value.reduce(
			(f, a) => function_(a).map(b => bs => bs.concat(b)).ap(f),
			of(new List([])),
		)
	}

	[util.inspect.custom]() {
		return `List(${inspect(this.$value)})`
	}
}

class Map {
	constructor(x) {
		this.$value = x
	}

	insert(k, v) {
		const singleton = {}
		singleton[k] = v
		return Map.of({ ...this.$value, ...singleton })
	}

	// ----- Functor (Map a)
	map(function_) {
		return this.reduceWithKeys(
			(m, v, k) => m.insert(k, function_(v)),
			new Map({}),
		)
	}

	reduceWithKeys(function_, zero) {
		return Object.keys(this.$value)
			.reduce((accumulator, k) => function_(accumulator, this.$value[k], k), zero)
	}

	// ----- Traversable (Map a)
	sequence(of) {
		return this.traverse(of, identity)
	}

	traverse(of, function_) {
		return this.reduceWithKeys(
			(f, a, k) => function_(a).map(b => m => m.insert(k, b)).ap(f),
			of(new Map({})),
		)
	}

	[util.inspect.custom]() {
		return `Map(${inspect(this.$value)})`
	}
}

/**
 * Maybe monad represents an optional value that either holds a value of type T or nothing.
 * @template T - The type of the inner value that Maybe holds.
 */
class Maybe {
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

	join() {
		return this.isNothing ? this : this.$value
	}

	// ----- Functor Maybe
	/**
	 * Applies a function to the inner value of Maybe, if it exists.
	 * @param {function(T): U} function_ - A function to apply to the inner value.
	 * @returns {Maybe<U>} - A new Maybe instance with the transformed value.
	 * @template U
	 */
	map(function_) {
		return this.isNothing ? this : Maybe.of(function_(this.$value))
	}

	// ----- Traversable Maybe
	sequence(of) {
		return this.traverse(of, identity)
	}

	traverse(of, function_) {
		return this.isNothing ? of(this) : function_(this.$value).map(Maybe.of)
	}

	[util.inspect.custom]() {
		return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
	}

	get isJust() {
		return !this.isNothing
	}

	get isNothing() {
		return this.$value === null || this.$value === undefined
	}
}

class Task {
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
		return this.chain(function_ => f.map(function_))
	}

	// ----- Monad (Task a)
	chain(function_) {
		return new Task((reject, resolve) => this.fork(reject, x => function_(x).fork(reject, resolve)))
	}

	join() {
		return this.chain(identity)
	}

	// ----- Functor (Task a)
	map(function_) {
		return new Task((reject, resolve) => this.fork(reject, compose(resolve, function_)))
	}

	[util.inspect.custom]() {
		return 'Task(?)'
	}
}
