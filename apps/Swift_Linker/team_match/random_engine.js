import { Random, nodeCrypto, shuffle } from 'random-js'

export const random = new Random(nodeCrypto)

export const shuffleArray = array => shuffle(nodeCrypto, array)

const testArray = [1, 2, 3, 4, 5, 6]

console.log(shuffleArray(testArray))
console.log(shuffleArray(testArray))
console.log(shuffleArray(testArray))
console.log(shuffleArray(testArray))
console.log(shuffleArray(testArray))
console.log(shuffleArray(testArray))
