<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.HeaderProps = $props()
</script>

<RangeCalendarPrimitive.Header
	class={cn('relative flex w-full items-center justify-between pt-1', className)}
	bind:ref
	{...restProps}
/>
