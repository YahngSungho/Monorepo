import * as rambda from 'rambda'
import * as ramda from 'ramda'

export const R = {
	...ramda,
	...rambda,
	concat: ramda.concat,
	mapObjectParallel: ramda.curry(async (fn, obj) => {
		return await rambda.pipeAsync(
			Object.entries(obj),
			rambda.mapParallelAsync(async ([key, value]) => {
				return [key, await fn(value, key)]
			}),
			Object.fromEntries,
		)
	}),
}
