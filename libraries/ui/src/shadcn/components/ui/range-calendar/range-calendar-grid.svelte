<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(null),
	...restProps
}: RangeCalendarPrimitive.GridProps = $props()
</script>

<RangeCalendarPrimitive.Grid
	bind:ref
	class={cn('w-full border-collapse space-y-1', className)}
	{...restProps}
/>
