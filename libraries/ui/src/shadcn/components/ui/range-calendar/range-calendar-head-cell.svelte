<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.HeadCellProps = $props()
</script>

<RangeCalendarPrimitive.HeadCell
	class={cn('text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal', className)}
	bind:ref
	{...restProps}
/>
