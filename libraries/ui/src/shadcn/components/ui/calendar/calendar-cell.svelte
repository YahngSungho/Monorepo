<script lang="ts">
import { Calendar as CalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let { class: className, ref = $bindable(), ...restProps }: CalendarPrimitive.CellProps = $props()
</script>

<CalendarPrimitive.Cell
	class={cn(
		`[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50
		relative size-9 p-0 text-center text-sm focus-within:relative focus-within:z-20
		[&:has([data-selected])]:rounded-md`,
		className,
	)}
	bind:ref
	{...restProps}
/>
