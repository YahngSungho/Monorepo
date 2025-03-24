<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: CalendarPrimitive.GridBodyProps = $props()
</script>

<CalendarPrimitive.GridBody class={cn(className)} bind:ref {...restProps} />
