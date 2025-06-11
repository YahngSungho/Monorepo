<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.GridProps = $props()
</script>

<RangeCalendarPrimitive.Grid
	class={cn('w-full border-collapse space-y-1', className)}
	bind:ref
	{...restProps}
/>
