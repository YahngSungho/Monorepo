<script>
import { TableHead } from '$shadcn/components/ui/table/index'
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

<TableHead class={alignClass} {...rest}>{@render children()}</TableHead>
