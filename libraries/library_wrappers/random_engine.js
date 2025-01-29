import { nodeCrypto, Random, shuffle } from 'random-js'

const random = new Random(nodeCrypto)

const shuffleArray = (array) => shuffle(nodeCrypto, array)

export { random, shuffleArray }
