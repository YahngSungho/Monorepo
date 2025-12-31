<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.CellProps = $props()
</script>

<RangeCalendarPrimitive.Cell
	class={cn(
		`[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50
		relative size-8 p-0 text-center text-sm focus-within:relative
		focus-within:z-20
		`,
		className,
	)}
	bind:ref
	{...restProps}
/>
