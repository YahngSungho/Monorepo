<script>
import { TableHeader } from '$shadcn/components/ui/table/index'
// 테이블 헤더는 align 속성을 가질 수 있습니다.
let { align = 'left', children, ...rest } = $props()

const alignClass = $derived(() => {
	switch (align) {
		case 'center': {
			return 'text-center'
		}
		case 'left': {
			return 'text-left'
		}
		case 'right': {
			return 'text-right'
		}
		default: {
			return 'text-left' // 기본값 처리 추가 (선택 사항이지만 권장)
		}
	}
})
</script>

<TableHeader class={alignClass} {...rest}>{@render children()}</TableHeader>
