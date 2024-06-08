import { createActor, createMachine } from 'xstate'

// 간단한 카운터 머신 정의
export const counterMachine = createMachine({
	id: 'counter',
	initial: 'inactive',
	states: {
		active: {
			on: {
				DEACTIVATE: 'inactive',
			},
		},
		inactive: {
			on: {
				ACTIVATE: 'active',
			},
		},
	},
})

// Actor 생성 및 시작
const counterActor = createActor(counterMachine).start()

// 상태 변화 확인을 위한 로그
counterActor.subscribe(state => {
	console.log(state.value)
})

// Event 보내기
counterActor.send({ type: 'ACTIVATE' })
