<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: RangeCalendarPrimitive.HeadCellProps = $props()
</script>

<RangeCalendarPrimitive.HeadCell
	class={cn('text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal', className)}
	bind:ref
	{...restProps}
/>
