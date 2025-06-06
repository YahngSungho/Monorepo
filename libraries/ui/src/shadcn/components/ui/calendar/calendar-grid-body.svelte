<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.GridBodyProps = $props()
</script>

<CalendarPrimitive.GridBody class={cn(className)} bind:ref {...restProps} />
