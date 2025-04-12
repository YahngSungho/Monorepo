<script>
// 테이블 셀은 align 속성을 가질 수 있습니다.
import { TableCell } from '$shadcn/components/ui/table/index'
let { align = 'left', children } = $props()

let alignClass = ''
switch (align) {
	case 'center': {
		alignClass = 'text-center'

		break
	}
	case 'left': {
		alignClass = 'text-left'

		break
	}
	case 'right': {
		alignClass = 'text-right'

		break
	}
}
</script>

<TableCell class={alignClass}>{@render children()}</TableCell>
