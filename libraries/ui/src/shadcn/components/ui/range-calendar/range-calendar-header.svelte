<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils.js'

let {
	class: className,
	ref = $bindable(),
	...restProps
}: RangeCalendarPrimitive.HeaderProps = $props()
</script>

<RangeCalendarPrimitive.Header
	class={cn('relative flex w-full items-center justify-between pt-1', className)}
	bind:ref
	{...restProps}
/>
