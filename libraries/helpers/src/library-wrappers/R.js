import * as rambda from 'rambda'
import * as ramda from 'ramda'

export const R = {
	...ramda,
	...rambda,
	concat: ramda.concat,
}
