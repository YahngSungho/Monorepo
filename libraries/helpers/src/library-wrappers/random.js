import { nodeCrypto, Random, shuffle } from 'random-js'

const random = new Random(nodeCrypto)

/**
 * 배열을 받아서 셔플된 새 배열을 반환해.
 * @param {Array} array - 셔플할 배열
 * @returns {Array} 셔플된 배열
 */
const shuffleArray = (array) => shuffle(nodeCrypto, array)

export { random, shuffleArray }
