import { Random, nodeCrypto, shuffle } from 'random-js'

export const random = new Random(nodeCrypto)

export const shuffleArray = array => shuffle(nodeCrypto, array)
