<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: CalendarPrimitive.GridProps = $props()
</script>

<CalendarPrimitive.Grid
	class={cn('w-full border-collapse space-y-1', className)}
	bind:ref
	{...restProps}
/>
