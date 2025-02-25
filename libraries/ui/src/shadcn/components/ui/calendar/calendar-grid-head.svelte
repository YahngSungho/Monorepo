<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: CalendarPrimitive.GridHeadProps = $props()
</script>

<CalendarPrimitive.GridHead bind:ref class={cn(className)} {...restProps} />
