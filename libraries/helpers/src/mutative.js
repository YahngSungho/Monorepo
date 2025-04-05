import { makeCreator } from 'mutative'

const create = makeCreator({
	strict: process.env.NODE_ENV !== 'production',
	enableAutoFreeze: true,
})

export { create }
export { unsafe } from 'mutative'
