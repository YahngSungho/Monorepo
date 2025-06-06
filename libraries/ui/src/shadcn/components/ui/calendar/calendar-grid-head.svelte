<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.GridHeadProps = $props()
</script>

<CalendarPrimitive.GridHead class={cn(className)} bind:ref {...restProps} />
