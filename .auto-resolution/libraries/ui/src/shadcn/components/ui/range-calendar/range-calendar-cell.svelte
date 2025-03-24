<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: RangeCalendarPrimitive.CellProps = $props()
</script>

<RangeCalendarPrimitive.Cell
	class={cn(
		`[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50
		relative size-9 p-0 text-center text-sm focus-within:relative focus-within:z-20
		first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md
		[&:has([data-selected][data-selection-end])]:rounded-r-md
		[&:has([data-selected][data-selection-start])]:rounded-l-md`,
		className,
	)}
	bind:ref
	{...restProps}
/>
