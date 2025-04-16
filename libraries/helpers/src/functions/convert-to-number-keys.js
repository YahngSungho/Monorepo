import { R } from '../library-wrappers/R.js'

const convertToNumberKeys = R.curry((keyNumberDictionary, object) => {
	const result = {}
	for (const key of Object.keys(object)) {
		result[keyNumberDictionary[key]] = object[key]
	}
	return result
})

const restoreFromNumberKeys = R.curry((keyNumberDictionary, object) => {
	const result = {}
	for (const [key, number] of Object.entries(keyNumberDictionary)) {
		if (object[number] === undefined) {
			continue
		}
		result[key] = object[number]
	}
	return result
})

export function generateKeyNumberFunctions(objectWithTotalKeys) {
	let counter = 0
	const keyNumberDictionary = {}
	for (const key of Object.keys(objectWithTotalKeys)) {
		keyNumberDictionary[key] = counter
		counter += 1
	}
	return {
		convertToNumberKeys: convertToNumberKeys(keyNumberDictionary),
		restoreFromNumberKeys: restoreFromNumberKeys(keyNumberDictionary),
	}
}
