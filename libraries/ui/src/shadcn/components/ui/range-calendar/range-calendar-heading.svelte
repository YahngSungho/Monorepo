<script lang="ts">
import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

import { cn } from '$shadcn/utils'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: RangeCalendarPrimitive.HeadingProps = $props()
</script>

<RangeCalendarPrimitive.Heading
	class={cn('text-sm font-medium', className)}
	bind:ref
	{...restProps}
/>
