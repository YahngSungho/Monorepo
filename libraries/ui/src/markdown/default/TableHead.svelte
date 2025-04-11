<script>
import { TableHead } from '$shadcn/components/ui/table/index'
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
}
</script>

<TableHead class={alignClass}>{@render children()}</TableHead>
