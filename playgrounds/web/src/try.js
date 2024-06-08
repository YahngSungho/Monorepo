import {
	MersenneTwister19937, Random, bool, integer, nodeCrypto, 
} from 'random-js'
import { createActor, createMachine } from 'xstate'



// 특정 값으로 seed를 고정
const seed = 1234
const engine = MersenneTwister19937.autoSeed()
// Random 인스턴스 생성
const random = new Random(nodeCrypto)

// 난수 생성
console.log(random.integer(1, 100)) // 난수 출력
console.log(random.integer(1, 100)) // 난수 출력
console.log(random.integer(1, 100)) // 난수 출력
console.log(random.integer(1, 100)) // 난수 출력
console.log(random.integer(1, 100)) // 난수 출력
console.log(random.integer(1, 100)) //


let testValue = 10_000

random.uuid4()/* ? */

random.string(10, 'abcdefghijklmnopqrstuvwxyz')/* ? */


const distribution = integer(1, 100)

distribution(engine)/* ?+ */
console.log('🚀 ~ distribution:', distribution)

bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */
bool(0.5)(engine)/* ? */


const testMachine1 = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QBc7IHQEsB2nmYEMAbAZWQNQGIARAUQGEAlWgWVoDkAVAbQAYBdRKAAOAe1h5Mo7EJAAPRAA4A7ABoQAT0QBmdABYArNoCMAJgMBfC+tSwMOScTIUwlAJLsmrDjwGyxEvjSsgoIALTGxrzoAGzm6lrhMQCc6JZW6tiiEHCytsj+4pLBSPKIEQaKsfGa5cYGyhkg+Vi4+E7kqIWBUjKlocnK6LwmNYmmpnr6vHHpVkA */
	id: 'test',
	initial: 'initialState',
	states: {
		initialState: {
			on: {
				DECREMENT: {
					actions: () => testValue--,
				},
				INCREMENT: {
					actions: () => testValue++,
				},
			},
		},
	},
})

// watch: 이거저거 이거임
// tests
// tests
// Tests
// test
// Tests
// 실험: 이거랑 저거랑 이거
// Todo
// Bug
// Hack
// Fix
// Notdone
// Done
// Experiment
// Watch
// Todo
// X

// Check: 이건 이거고 이거 확인해



// Watch




const testMachine2 = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgBc4CAmfEABy1gEsCasNyAPRAWgDZ0BPdj5NCCKxSAOhoY6NAIYAbAMoFpRclVr1GLRABYSPRAA4AjKICsAgUA */
	id: 'test2',
	initial: 'initialState',
	states: {
		initialState: {
			on: {
				DECREMENT_BY_ANOTHER_ACTOR: {
					actions: ({ event }) => event.sender.send({ type: 'DECREMENT' }),
				},
				INCREMENT_BY_ANOTHER_ACTOR: {
					actions: ({ event }) => event.sender.send({ type: 'INCREMENT' }),
				},
			},
		},
	},
})

const testActor1 = createActor(testMachine1).start()

const testActor2 = createActor(testMachine2).start()

testActor1.send({
	type: 'INCREMENT',
})


testValue
console.log(testValue)

testActor2.send({
	sender: testActor1, // Ensure the sender is testActor1
	type: 'INCREMENT_BY_ANOTHER_ACTOR',
})


testValue
console.log(testValue)
