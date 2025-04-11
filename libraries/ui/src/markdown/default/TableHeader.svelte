<script>
import { TableHeader } from '$shadcn/components/ui/table/index'
// 테이블 헤더는 align 속성을 가질 수 있습니다.
let { align = 'left', children } = $props()

let alignClass = ''
switch (align) {
case 'center': {
	alignClass = 'text-center'

break;
}
case 'left': {
	alignClass = 'text-left'

break;
}
case 'right': {
	alignClass = 'text-right'

break;
}
// No default
}

</script>

<TableHeader class={alignClass}>{@render children()}</TableHeader>
