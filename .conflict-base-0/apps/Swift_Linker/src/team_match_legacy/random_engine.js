import { nodeCrypto, Random, shuffle } from 'random-js'

export const random = new Random(nodeCrypto)

export const shuffleArray = (array) => shuffle(nodeCrypto, array)
