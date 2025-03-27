import { makeCreator } from 'mutative'

const create = makeCreator({
	strict: process.env.NODE_ENV !== 'production',
})

export { create }
export { unsafe } from 'mutative'
