import { makeCreator } from 'mutative'

// Todo: production 에서는 strict를 다 false로 바꿔야 함 - 개발 모드에서는 strict를 활성화하고 프로덕션 모드에서는 strict를 비활성화하는 것이 좋습니다. 이렇게 하면 안전한 명시적 반환을 보장하고 프로덕션 빌드에서도 좋은 성능을 유지할 수 있습니다. 현재 초안을 혼합하지 않거나 정의되지 않은 값이 반환되는 경우 rawReturn()을 사용합니다.
const create = makeCreator({
	strict: true,
})

export default create
export { unsafe } from 'mutative'
